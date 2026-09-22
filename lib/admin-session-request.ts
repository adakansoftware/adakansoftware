import { hasJsonContentType, readBoundedJsonObject } from "./request-body.ts"

export function getAdminSessionMutationRequestError(
  request: Request,
  isAllowedOrigin: (request: Request) => boolean,
) {
  return isAllowedOrigin(request) ? null : 403
}

const adminLoginMaxBodyBytes = 8 * 1024

export async function readAdminLoginCredentials(request: Request) {
  if (!hasJsonContentType(request)) {
    return { ok: false as const, status: 400 as const }
  }

  const rawContentLength = request.headers.get("content-length")
  if (rawContentLength && (!/^\d+$/.test(rawContentLength.trim()) || Number(rawContentLength) > adminLoginMaxBodyBytes)) {
    return { ok: false as const, status: 413 as const }
  }

  const parsed = await readBoundedJsonObject(request, adminLoginMaxBodyBytes)
  if (!parsed.ok) return parsed

  const { email, password } = parsed.body
  return typeof email === "string" && typeof password === "string"
    ? { ok: true as const, email, password }
    : { ok: false as const, status: 400 as const }
}
