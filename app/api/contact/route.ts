import { randomUUID } from "node:crypto"

import { contactPolicy } from "@/lib/server/contact-policy"
import { persistContactWithoutDelivery } from "@/lib/server/contact-database-fallback"
import { hasJsonContentType, readBoundedJsonObject } from "@/lib/request-body"
import { isContactRuntimeConfigurationValid } from "@/lib/server/contact-runtime-config"
import { getContactStateStoreStatus } from "@/lib/server/contact-state-store"
import {
  createQueuedContactMessage,
  getIdempotencyReplay,
  markContactMessageDelivered,
  markContactMessageFailed,
  releaseIdempotencyReservation,
  storeIdempotencyReplay,
} from "@/lib/server/contact-pipeline"
import {
  getContactContentLengthLimit,
  hasSpamTrapValue,
  isContactDeliveryConfigured,
  reserveContactSubmission,
  completeContactSubmission,
  releaseContactSubmission,
  isRateLimited,
  parseContactPayload,
  resendContactDelivery,
} from "@/lib/server/contact-service"
import {
  createRequestId,
  emptyResponse,
  getClientIp,
  getContentLength,
  isAllowedOrigin,
  jsonResponse,
} from "@/lib/server/http"
import { logServerEvent } from "@/lib/server/logger"
import { recordContactRequest } from "@/lib/contact-request-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOW_HEADER_VALUE = "POST, OPTIONS"

export async function OPTIONS(request: Request) {
  const requestId = createRequestId(request)

  return emptyResponse({
    status: 204,
    requestId,
    headers: {
      Allow: ALLOW_HEADER_VALUE,
    },
  })
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)

  return jsonResponse(
    { ok: false, error: "Method not allowed" },
    {
      status: 405,
      requestId,
      headers: {
        Allow: ALLOW_HEADER_VALUE,
      },
    },
  )
}

export async function POST(request: Request) {
  const requestId = createRequestId(request)
  try {
    return await handleContactPost(request, requestId, randomUUID())
  } catch (error) {
    logServerEvent("error", "contact.persistence.failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown-error",
    })
    return jsonResponse({ ok: false, error: "Contact service is unavailable" }, { status: 503, requestId })
  }
}

async function handleContactPost(request: Request, requestId: string, owner: string) {
  const now = Date.now()
  const clientIp = getClientIp(request)

  const fullPipelineConfigured = isContactRuntimeConfigurationValid()

  // The full production pipeline relies on Redis for durable rate limiting,
  // idempotency, and its delivery outbox. When configured, fail closed if that
  // shared state is unavailable. A database-only fallback below still keeps
  // genuine inquiries when optional delivery infrastructure is not configured.
  if (process.env.NODE_ENV === "production" && fullPipelineConfigured) {
    try {
      const stateStatus = await getContactStateStoreStatus()
      if (!stateStatus.available) {
        logServerEvent("error", "contact.state.unavailable", {
          requestId,
          error: stateStatus.error,
        })
        return jsonResponse(
          { ok: false, error: "Contact service is unavailable" },
          { status: 503, requestId },
        )
      }
    } catch (error) {
      logServerEvent("error", "contact.state.check-failed", {
        requestId,
        error: error instanceof Error ? error.message : "unknown-error",
      })
      return jsonResponse(
        { ok: false, error: "Contact service is unavailable" },
        { status: 503, requestId },
      )
    }
  }

  if (!isAllowedOrigin(request)) {
    return jsonResponse({ ok: false, error: "Origin not allowed" }, { status: 403, requestId })
  }

  const contentLength = getContentLength(request)
  if (contentLength !== null && (contentLength < 0 || contentLength > getContactContentLengthLimit())) {
    return jsonResponse({ ok: false, error: "Payload too large" }, { status: 413, requestId })
  }

  if (await isRateLimited(clientIp, now)) {
    return jsonResponse(
      { ok: false, error: "Too many requests" },
      {
        status: 429,
        requestId,
        headers: {
          "Retry-After": String(Math.ceil(contactPolicy.rateLimitWindowMs / 1000)),
        },
      },
    )
  }

  if (!hasJsonContentType(request)) {
    return jsonResponse({ ok: false, error: "Invalid request" }, { status: 400, requestId })
  }

  const parsedBody = await readBoundedJsonObject(request, getContactContentLengthLimit())
  if (!parsedBody.ok) {
    return jsonResponse(
      { ok: false, error: parsedBody.status === 413 ? "Payload too large" : "Invalid request" },
      { status: parsedBody.status, requestId },
    )
  }
  const body = parsedBody.body

  if (hasSpamTrapValue(body)) {
    return jsonResponse({ ok: true, accepted: true }, { requestId })
  }

  const submission = parseContactPayload(body)
  if (!submission) {
    return jsonResponse({ ok: false, error: "Invalid request" }, { status: 400, requestId })
  }

  if (!fullPipelineConfigured) {
    const fallbackResponse = await persistContactWithoutDelivery(submission, recordContactRequest)

    logServerEvent("warn", "contact.accepted.database-only", {
      requestId,
      clientIp,
    })

    return jsonResponse(fallbackResponse, { requestId })
  }

  try {
    const replay = await getIdempotencyReplay(request, submission, now, owner)
    if (replay?.conflict) {
      return jsonResponse({ ok: false, error: "Idempotency conflict" }, { status: 409, requestId })
    }

    if (replay && !replay.conflict && replay.pending) {
      return jsonResponse({ ok: false, error: "Idempotency request in progress" }, { status: 409, requestId })
    }

    if (replay && !replay.conflict && !replay.pending) {
      return jsonResponse(replay.body, { status: replay.status, requestId })
    }

    const reservation = await reserveContactSubmission(submission, clientIp, owner)
    if (reservation === "pending") {
      return jsonResponse({ ok: false, error: "Contact request in progress" }, { status: 409, requestId })
    }
    if (reservation === "completed") {
      const duplicateResponse = {
        ok: true,
        accepted: true,
        duplicate: true,
        deliveryConfigured: isContactDeliveryConfigured(),
        skippedDelivery: true,
        queued: false,
      }

      await storeIdempotencyReplay(request, submission, {
        status: 200,
        body: duplicateResponse,
      })

      return jsonResponse(duplicateResponse, { requestId })
    }

    try {
      await recordContactRequest(submission)
    } catch (error) {
      logServerEvent("error", "contact.request-record.failed", {
        requestId,
        error: error instanceof Error ? error.message : "unknown-error",
      })
      return jsonResponse({ ok: false, error: "Contact service is unavailable" }, { status: 503, requestId })
    }

    const outboxEntry = await createQueuedContactMessage(submission, {
      owner: `request:${requestId}`,
    })
    // Only durable contacts with an outbox entry may acknowledge a duplicate.
    await completeContactSubmission(submission, clientIp, owner)

    try {
      const result = await resendContactDelivery.deliver(submission)

      if (!result.ok) {
        await markContactMessageFailed(
          outboxEntry.id,
          result.failure ?? "upstream-delivery-rejected",
          undefined,
          outboxEntry.attempts,
          outboxEntry.leaseOwner,
        )

        logServerEvent("error", "contact.delivery.rejected", {
          requestId,
          clientIp,
          messageId: outboxEntry.id,
          reason: result.failure,
        })

        const queuedResponse = {
          ok: true,
          accepted: true,
          deliveryConfigured: isContactDeliveryConfigured(),
          duplicate: false,
          skippedDelivery: false,
          queued: true,
          deliveryPending: true,
          messageId: outboxEntry.id,
        }

        await storeIdempotencyReplay(request, submission, {
          status: 202,
          body: queuedResponse,
        })

        return jsonResponse(queuedResponse, {
          status: 202,
          requestId,
          headers: {
            "X-Contact-Message-Id": outboxEntry.id,
          },
        })
      }

      await markContactMessageDelivered(
        outboxEntry.id,
        result.skipped ? "skipped" : "delivered",
        outboxEntry.leaseOwner,
      )

      const successResponse = {
        ok: true,
        accepted: true,
        deliveryConfigured: isContactDeliveryConfigured(),
        duplicate: false,
        skippedDelivery: result.skipped,
        queued: true,
        messageId: outboxEntry.id,
      }

      await storeIdempotencyReplay(request, submission, {
        status: 200,
        body: successResponse,
      })

      return jsonResponse(successResponse, {
        requestId,
        headers: {
          "X-Contact-Message-Id": outboxEntry.id,
        },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "unknown-error"
      await markContactMessageFailed(
        outboxEntry.id,
        errorMessage,
        undefined,
        outboxEntry.attempts,
        outboxEntry.leaseOwner,
      )

      logServerEvent("error", "contact.delivery.failed", {
        requestId,
        clientIp,
        messageId: outboxEntry.id,
        error: errorMessage,
      })

      const queuedResponse = {
        ok: true,
        accepted: true,
        deliveryConfigured: isContactDeliveryConfigured(),
        duplicate: false,
        skippedDelivery: false,
        queued: true,
        deliveryPending: true,
        messageId: outboxEntry.id,
      }

      await storeIdempotencyReplay(request, submission, {
        status: 202,
        body: queuedResponse,
      })

      return jsonResponse(queuedResponse, {
        status: 202,
        requestId,
        headers: {
          "X-Contact-Message-Id": outboxEntry.id,
        },
      })
    }
  } finally {
    const released = await Promise.allSettled([
      releaseIdempotencyReservation(request, owner),
      releaseContactSubmission(submission, clientIp, owner),
    ])
    for (const result of released) {
      if (result.status === "rejected") {
        logServerEvent("error", "contact.reservation.release-failed", {
          requestId,
          error: result.reason instanceof Error ? result.reason.message : "unknown-error",
        })
      }
    }
  }
}
