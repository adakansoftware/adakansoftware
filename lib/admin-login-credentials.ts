import { pbkdf2Async } from "@noble/hashes/pbkdf2.js"
import { sha256 } from "@noble/hashes/sha2.js"

const encoder = new TextEncoder()
const algorithm = "pbkdf2-sha256"
const digestLength = 32
const saltLength = 16
const productionIterations = 600_000
const minimumIterations = 100_000
const maximumIterations = 5_000_000

function encodeBase64Url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "")
}

function decodeBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) return null
  try {
    const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=")
    const binary = atob(padded)
    return Uint8Array.from(binary, (character) => character.charCodeAt(0))
  } catch {
    return null
  }
}

function parsePasswordHash(value: string | undefined) {
  if (!value) return null
  const [hashAlgorithm, rawIterations, rawSalt, rawDigest, extra] = value.split("$")
  const iterations = Number(rawIterations)
  const salt = decodeBase64Url(rawSalt ?? "")
  const digest = decodeBase64Url(rawDigest ?? "")

  if (extra !== undefined || hashAlgorithm !== algorithm || !Number.isSafeInteger(iterations)
    || iterations < minimumIterations || iterations > maximumIterations
    || salt?.byteLength !== saltLength || digest?.byteLength !== digestLength) return null

  return { iterations, salt, digest }
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  const length = Math.max(left.byteLength, right.byteLength)
  let difference = left.byteLength ^ right.byteLength
  for (let index = 0; index < length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }
  return difference === 0
}

async function derivePassword(password: string, salt: Uint8Array, iterations: number) {
  return await pbkdf2Async(sha256, encoder.encode(password), salt, {
    c: iterations,
    dkLen: digestLength,
    asyncTick: 10,
  })
}

export function isAdminPasswordHash(value: string | undefined) {
  return parsePasswordHash(value) !== null
}

export async function hashAdminPassword(password: string) {
  if (password.length < 16) throw new Error("Admin password must contain at least 16 characters")
  const salt = crypto.getRandomValues(new Uint8Array(saltLength))
  const digest = await derivePassword(password, salt, productionIterations)
  return `${algorithm}$${productionIterations}$${encodeBase64Url(salt)}$${encodeBase64Url(digest)}`
}

export async function verifyAdminPassword(password: string, encodedHash: string | undefined) {
  const parsed = parsePasswordHash(encodedHash)
  if (!parsed) return false
  const candidate = await derivePassword(password, parsed.salt, parsed.iterations)
  return constantTimeEqual(candidate, parsed.digest)
}

export async function matchesAdminCredentials(
  email: string,
  password: string,
  expected: { email: string | undefined; passwordHash: string | undefined },
) {
  if (!expected.email || !expected.passwordHash) return false

  const emailMatches = constantTimeEqual(encoder.encode(email), encoder.encode(expected.email))
  const passwordMatches = await verifyAdminPassword(password, expected.passwordHash)
  return emailMatches && passwordMatches
}
