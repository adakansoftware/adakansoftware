type TimingSafeSubtleCrypto = SubtleCrypto & {
  timingSafeEqual?: (left: Uint8Array, right: Uint8Array) => boolean
}

const encoder = new TextEncoder()

function constantTimeStringEqual(left: string, right: string) {
  const leftBytes = encoder.encode(left)
  const rightBytes = encoder.encode(right)
  const subtle = crypto.subtle as TimingSafeSubtleCrypto

  if (subtle.timingSafeEqual) {
    return leftBytes.byteLength === rightBytes.byteLength
      ? subtle.timingSafeEqual(leftBytes, rightBytes)
      : !subtle.timingSafeEqual(leftBytes, leftBytes)
  }

  const length = Math.max(leftBytes.byteLength, rightBytes.byteLength)
  let difference = leftBytes.byteLength ^ rightBytes.byteLength
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0)
  }
  return difference === 0
}

export function matchesAdminCredentials(
  email: string,
  password: string,
  expected: { email: string | undefined; password: string | undefined },
) {
  if (!expected.email || !expected.password) return false

  const emailMatches = constantTimeStringEqual(email, expected.email)
  const passwordMatches = constantTimeStringEqual(password, expected.password)
  return emailMatches && passwordMatches
}
