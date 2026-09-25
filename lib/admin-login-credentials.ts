import { timingSafeEqual } from "node:crypto"

export function matchesAdminCredentials(
  email: string,
  password: string,
  expected: { email: string | undefined; password: string | undefined },
) {
  if (!expected.email || !expected.password) return false

  const emailBuffer = Buffer.from(email)
  const expectedEmailBuffer = Buffer.from(expected.email)
  const passwordBuffer = Buffer.from(password)
  const expectedPasswordBuffer = Buffer.from(expected.password)

  return emailBuffer.length === expectedEmailBuffer.length
    && passwordBuffer.length === expectedPasswordBuffer.length
    && timingSafeEqual(emailBuffer, expectedEmailBuffer)
    && timingSafeEqual(passwordBuffer, expectedPasswordBuffer)
}
