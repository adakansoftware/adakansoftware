const minimumSessionSecretLength = 32
const minimumAdminPasswordLength = 16

export function hasAdminLoginConfiguration(input: {
  email: string | undefined
  password: string | undefined
  sessionSecret: string | undefined
}) {
  const sessionSecret = input.sessionSecret?.trim() ?? ""

  return Boolean(
    input.email?.trim()
    && (input.password?.length ?? 0) >= minimumAdminPasswordLength
    && sessionSecret.length >= minimumSessionSecretLength,
  )
}
