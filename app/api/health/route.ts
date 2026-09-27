import { getContactPipelineDiagnostics } from "@/lib/server/contact-pipeline"
import { getContactServiceDiagnostics } from "@/lib/server/contact-service"
import { contactPolicy } from "@/lib/server/contact-policy"
import {
  getContactRuntimeConfigurationIssues,
  getContactRuntimeMode,
  isContactRuntimeConfigurationValid,
} from "@/lib/server/contact-runtime-config"
import { getProxyRateLimitDiagnostics } from "@/lib/server/proxy-rate-limit"
import { getContactStateStore, getContactStateStoreStatus } from "@/lib/server/contact-state-store"
import { getSafeContactStateError } from "@/lib/server/contact-state-status"
import { getManagedContentSourceStatus } from "@/lib/content-source-status"
import { getPublicHealthPayload } from "@/lib/server/public-health"
import {
  createRequestId,
  emptyResponse,
  hasSignedAdminNonceProtection,
  hasSignedAdminProtection,
  isAuthorizedAdminRequest,
  jsonResponse,
} from "@/lib/server/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOW_HEADER_VALUE = "GET, HEAD, OPTIONS"

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

export async function HEAD(request: Request) {
  const requestId = createRequestId(request)

  return emptyResponse({
    status: 200,
    requestId,
    headers: {
      Allow: ALLOW_HEADER_VALUE,
    },
  })
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)
  const includeDiagnostics = await isAuthorizedAdminRequest(request)

  if (!includeDiagnostics) {
    const ready = isContactRuntimeConfigurationValid()

    return jsonResponse(
      getPublicHealthPayload(ready),
      {
        requestId,
        headers: { Allow: ALLOW_HEADER_VALUE },
      },
    )
  }

  const diagnostics = getContactServiceDiagnostics()
  const contactConfigurationIssues = getContactRuntimeConfigurationIssues()
  const contactRuntimeMode = getContactRuntimeMode()
  const emailPipelineActive = contactRuntimeMode === "email" || contactRuntimeMode === "development"
  const proxyRateLimit = includeDiagnostics ? getProxyRateLimitDiagnostics() : null
  const pipeline = includeDiagnostics && emailPipelineActive ? await getContactPipelineDiagnostics() : null
  const stateStatus = emailPipelineActive ? await getContactStateStoreStatus() : null
  const workerRuntime = stateStatus?.available
    ? await getContactStateStore().readWorkerRuntimeState()
    : {
      workerId: null,
      lastHeartbeatAt: null,
      lastReplayAt: null,
      lastBatchSize: null,
      lastOutcome: null,
      lastError: stateStatus ? getSafeContactStateError(stateStatus) : null,
    }
  const stateCapabilities = stateStatus?.capabilities ?? {
    backend: "database" as const,
    sharedStoreReady: true,
    distributedStoreConfigured: true,
    implementedBackends: ["file", "redis"] as const,
    requestedBackendImplemented: true,
    requestedBackendReady: true,
    redisUrlConfigured: false,
  }
  const hasQueueAlerts = pipeline?.alerts.length ? pipeline.alerts.length > 0 : false
  const workerHeartbeatAgeMs =
    workerRuntime.lastHeartbeatAt === null ? null : Date.now() - workerRuntime.lastHeartbeatAt
  const automaticReplayConfigured = emailPipelineActive
    && Boolean(process.env.CONTACT_CRON_SECRET?.trim() || process.env.CRON_SECRET?.trim())
  const workerHealthy = !automaticReplayConfigured
    || (workerHeartbeatAgeMs !== null && workerHeartbeatAgeMs <= contactPolicy.queueAlertAgeMs)
  const status =
    process.env.NODE_ENV === "production"
      && (
        contactConfigurationIssues.length > 0
        || hasQueueAlerts
        || !workerHealthy
        || (emailPipelineActive && !stateStatus?.available)
      )
      ? "degraded"
      : "ok"

  return jsonResponse(
    {
      ok: status === "ok",
      status,
      service: "adakansoftware-website",
      timestamp: new Date().toISOString(),
      ...(includeDiagnostics
        ? {
            environment: process.env.NODE_ENV ?? "development",
            checks: {
              contactDeliveryConfigured: diagnostics.deliveryConfigured,
              contactRuntimeMode,
              contactRuntimeConfigurationValid: contactConfigurationIssues.length === 0,
              requestId: true,
              originProtection: true,
              duplicateProtection: contactRuntimeMode === "email",
              idempotencyProtection: contactRuntimeMode === "email",
              outboxTracking: contactRuntimeMode === "email",
              replayEndpointProtected: true,
              signedAdminProtection: hasSignedAdminProtection(),
              signedAdminNonceProtection: hasSignedAdminNonceProtection(),
              sharedAdminNonceProtection: hasSignedAdminNonceProtection() && Boolean(stateStatus?.available),
              automaticReplayAvailable: automaticReplayConfigured,
              automaticReplayHealthy: workerHealthy,
              requestedStateBackendImplemented: stateCapabilities.requestedBackendImplemented,
              requestedStateBackendReady: stateCapabilities.requestedBackendReady,
              stateBackendAvailable: stateStatus?.available ?? true,
              queueHealthy: !hasQueueAlerts,
            },
            diagnostics,
            managedContent: getManagedContentSourceStatus(),
            contactConfigurationIssues,
            pipeline,
            state: {
              ...stateCapabilities,
              available: stateStatus?.available ?? true,
              error: stateStatus ? getSafeContactStateError(stateStatus) : null,
            },
            worker: {
              ...workerRuntime,
              heartbeatAgeMs: workerHeartbeatAgeMs,
            },
            proxy: proxyRateLimit,
          }
        : {}),
    },
    {
      requestId,
      headers: {
        Allow: ALLOW_HEADER_VALUE,
      },
    },
  )
}
