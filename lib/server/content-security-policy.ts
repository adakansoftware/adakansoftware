export const cspNonceHeaderName = "x-nonce"

export function createCspNonce() {
  return crypto.randomUUID().replaceAll("-", "")
}

export function buildContentSecurityPolicy(nonce: string, isProduction: boolean) {
  const turnstileConfigured = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim())

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self' mailto:",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isProduction ? "" : " 'unsafe-eval'"}`,
    "script-src-attr 'none'",
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${turnstileConfigured ? " https://challenges.cloudflare.com" : ""}`,
    `frame-src ${turnstileConfigured ? "https://challenges.cloudflare.com" : "'none'"}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(isProduction ? ["upgrade-insecure-requests"] : []),
  ].join("; ")
}

export function buildTrustedTypesReportOnlyPolicy() {
  return "default-src 'self'; require-trusted-types-for 'script'; trusted-types default nextjs#bundler"
}
