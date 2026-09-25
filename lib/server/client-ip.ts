import { isIP } from "node:net"

function firstForwardedAddress(value: string | null) {
  const address = value?.split(",")[0]?.trim()
  if (!address) return null

  const bracketedIpv6 = address.match(/^\[([^\]]+)\](?::\d+)?$/)?.[1]
  const candidate = bracketedIpv6
    ?? address.match(/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/)?.[0]?.replace(/:\d+$/, "")
    ?? address

  return isIP(candidate) ? candidate : null
}

export function getTrustedClientIp(headers: Headers, environment = process.env.NODE_ENV) {
  // Trust only headers written by the deployment edge. Cloudflare is the
  // production host; the Vercel header remains as a portability fallback.
  // Generic forwarding headers can be supplied by a client and must not be
  // allowed to bypass an IP-based rate limit.
  if (environment === "production") {
    return (
      firstForwardedAddress(headers.get("cf-connecting-ip"))
      || firstForwardedAddress(headers.get("x-vercel-forwarded-for"))
      || "unknown"
    )
  }

  return (
    firstForwardedAddress(headers.get("x-vercel-forwarded-for"))
    || headers.get("x-real-ip")?.trim()
    || firstForwardedAddress(headers.get("x-forwarded-for"))
    || "unknown"
  )
}
