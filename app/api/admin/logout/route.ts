import { cookies } from "next/headers"

import { cookieName } from "@/lib/admin-auth"
import { readAdminSession } from "@/lib/admin-session"
import { getAdminSessionStore } from "@/lib/admin-session-store"
import { getAdminSessionMutationRequestError } from "@/lib/admin-session-request"
import { createRequestId, isAllowedOrigin, jsonResponse, optionsResponse } from "@/lib/server/http"

const ALLOW_HEADER_VALUE = "POST, OPTIONS"

export function OPTIONS(request: Request) {
  return optionsResponse(createRequestId(request), ALLOW_HEADER_VALUE)
}

export async function POST(request: Request) {
  const requestId = createRequestId(request)
  const requestError = getAdminSessionMutationRequestError(request, isAllowedOrigin)
  if (requestError) {
    return jsonResponse({ ok: false }, { status: requestError, requestId })
  }

  const value = (await cookies()).get(cookieName)?.value
  const session = value
    ? readAdminSession(value, process.env.ADMIN_EMAIL, process.env.ADMIN_SESSION_SECRET ?? "", Date.now())
    : null
  let revoked = true
  if (session) {
    try {
      await getAdminSessionStore().revoke(session.sessionId)
    } catch {
      revoked = false
    }
  }

  const response = jsonResponse({ ok: revoked }, { status: revoked ? 200 : 503, requestId })
  response.cookies.set(cookieName, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 })
  return response
}
