import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { defaultLocale, isLocale, localeHeaderName, stripLocalePrefix } from "@/lib/i18n"
import { getProxyRateLimitPolicy, isProxyRateLimited } from "@/lib/server/proxy-rate-limit"
import { getTrustedClientIp } from "@/lib/server/client-ip"
import { buildContentSecurityPolicy, createCspNonce, cspNonceHeaderName } from "@/lib/server/content-security-policy"
import { isSensitiveDotPath } from "@/lib/server/sensitive-path"
import { getCanonicalRedirectUrl } from "@/lib/server/transport-security"
import { siteConfig } from "@/lib/site-config"

const PUBLIC_FILE = /\.[^/]+$/

function withSecurityHeaders(response: NextResponse, contentSecurityPolicy: string) {
  response.headers.set("X-Proxy-Cache", "bypass")
  response.headers.set("Content-Security-Policy", contentSecurityPolicy)
  return response
}

function applyApiBurstProtection(request: NextRequest) {
  const policy = getProxyRateLimitPolicy()
  const key = `${getTrustedClientIp(request.headers)}:${request.nextUrl.pathname}`
  const now = Date.now()

  if (!isProxyRateLimited(key, now)) {
    return null
  }

  return NextResponse.json(
    { ok: false, error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(Math.ceil(policy.windowMs / 1000)),
      },
    },
  )
}

function forwardWithLocale(requestHeaders: Headers, contentSecurityPolicy: string) {
  return withSecurityHeaders(
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }),
    contentSecurityPolicy,
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const nonce = createCspNonce()
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce, process.env.NODE_ENV === "production")
  const canonicalRedirectUrl = getCanonicalRedirectUrl(
    request.url,
    siteConfig.url,
    process.env.NODE_ENV,
    request.headers.get("x-forwarded-proto"),
  )

  if (canonicalRedirectUrl) {
    return withSecurityHeaders(NextResponse.redirect(canonicalRedirectUrl, 308), contentSecurityPolicy)
  }

  if (isSensitiveDotPath(pathname)) {
    return withSecurityHeaders(new NextResponse(null, { status: 404 }), contentSecurityPolicy)
  }

  if (pathname.startsWith("/api")) {
    const limitedResponse = applyApiBurstProtection(request)
    if (limitedResponse) {
      return withSecurityHeaders(limitedResponse, contentSecurityPolicy)
    }

    return withSecurityHeaders(NextResponse.next(), contentSecurityPolicy)
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return withSecurityHeaders(NextResponse.next(), contentSecurityPolicy)
  }

  const [, firstSegment] = pathname.split("/")
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(cspNonceHeaderName, nonce)
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy)

  if (firstSegment === defaultLocale) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = stripLocalePrefix(pathname)

    return withSecurityHeaders(NextResponse.redirect(redirectUrl), contentSecurityPolicy)
  }

  if (isLocale(firstSegment)) {
    requestHeaders.set(localeHeaderName, firstSegment)
    return forwardWithLocale(requestHeaders, contentSecurityPolicy)
  }

  requestHeaders.set(localeHeaderName, defaultLocale)
  return forwardWithLocale(requestHeaders, contentSecurityPolicy)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
