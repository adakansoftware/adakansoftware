export function getCanonicalRedirectUrl(
  requestUrl: string,
  canonicalOrigin: string,
  environment = process.env.NODE_ENV,
  forwardedProtocol?: string | null,
) {
  if (environment !== "production") return null

  const url = new URL(requestUrl)
  const canonical = new URL(canonicalOrigin)
  const protocol = forwardedProtocol?.split(",")[0]?.trim().toLowerCase()
  const isAlternateHost = url.hostname.endsWith(".workers.dev")
    || url.hostname === `www.${canonical.hostname}`
  if (protocol !== "http" && !isAlternateHost) return null

  url.protocol = canonical.protocol
  url.host = canonical.host
  return url
}
