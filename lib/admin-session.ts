import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex")
}

export function createAdminSession(email: string, secret: string, expiresAt: number) {
  const encodedEmail = Buffer.from(email).toString("base64url")
  const sessionId = randomBytes(32).toString("base64url")
  const payload = `${encodedEmail}.${expiresAt}.${sessionId}`
  return `${payload}.${signature(payload, secret)}`
}

export function readAdminSession(
  value: string,
  email: string | undefined,
  secret: string,
  now: number,
) {
  if (!email?.trim() || !secret.trim()) return null
  const [encodedEmail, expiresAtValue, sessionId, token] = value.split(".")
  if (!encodedEmail || !expiresAtValue || !sessionId || !token || value.split(".").length !== 4) return null

  const expiresAt = Number(expiresAtValue)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || !/^[A-Za-z0-9_-]{40,}$/u.test(sessionId)) return null

  const payload = `${encodedEmail}.${expiresAtValue}.${sessionId}`
  const expected = signature(payload, secret)
  if (token.length !== expected.length || !timingSafeEqual(Buffer.from(token), Buffer.from(expected))) return null

  try {
    if (Buffer.from(encodedEmail, "base64url").toString("utf8") !== email) return null
    return { email, expiresAt, sessionId }
  } catch {
    return null
  }
}

export function verifyAdminSession(value: string, email: string | undefined, secret: string, now: number) {
  return readAdminSession(value, email, secret, now) !== null
}
