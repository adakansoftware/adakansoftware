import { adminCookie, adminSessionMaxAgeSeconds, cookieName } from "@/lib/admin-auth"
import { matchesAdminCredentials } from "@/lib/admin-login-credentials"
import { hasAdminLoginConfiguration } from "@/lib/admin-login-config"
import { getAdminSessionMutationRequestError, readAdminLoginCredentials } from "@/lib/admin-session-request"
import { getTrustedClientIp } from "@/lib/server/client-ip"
import { createRequestId, isAllowedOrigin, jsonResponse, optionsResponse } from "@/lib/server/http"
import {
  clearAdminLoginFailures,
  consumeAdminLoginAttempt,
  hasAdminLoginRateLimitProtection,
} from "@/lib/server/admin-login-rate-limit"

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

  if (!hasAdminLoginRateLimitProtection()) {
    return jsonResponse({ ok: false }, { status: 503, requestId })
  }

  const clientIp = getTrustedClientIp(request.headers)
  const now = Date.now()

  const credentials = await readAdminLoginCredentials(request)
  const rateLimitEmail = credentials.ok ? credentials.email : ""
  if (await consumeAdminLoginAttempt(clientIp, now, rateLimitEmail)) {
    return jsonResponse({ ok: false }, { status: 429, requestId })
  }

  if (!hasAdminLoginConfiguration({
    email: process.env.ADMIN_EMAIL,
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
    sessionSecret: process.env.ADMIN_SESSION_SECRET,
  })) {
    return jsonResponse({ ok: false }, { status: 503, requestId })
  }

  if (!credentials.ok) {
    return jsonResponse({ ok: false }, { status: credentials.status, requestId })
  }
  const { email, password } = credentials
  if (!await matchesAdminCredentials(email, password, {
    email: process.env.ADMIN_EMAIL,
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
  })) {
    return jsonResponse({ ok: false }, { status: 401, requestId })
  }

  await clearAdminLoginFailures(clientIp, email)
  const response = jsonResponse({ ok: true, email }, { requestId })
  response.cookies.set(cookieName, await adminCookie(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: adminSessionMaxAgeSeconds })
  return response
}
