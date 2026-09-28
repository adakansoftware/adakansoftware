import { isAdminPasswordHash } from "./admin-login-credentials.ts"

const minimumSessionSecretLength = 32

export function hasAdminLoginConfiguration(input: {
  email: string | undefined
  passwordHash: string | undefined
  sessionSecret: string | undefined
}) {
  const sessionSecret = input.sessionSecret?.trim() ?? ""

  return Boolean(
    input.email?.trim()
    && isAdminPasswordHash(input.passwordHash)
    && sessionSecret.length >= minimumSessionSecretLength,
  )
}
