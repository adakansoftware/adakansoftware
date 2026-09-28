const prefix = "enc:v1:"
const encoder = new TextEncoder()
const decoder = new TextDecoder("utf-8", { fatal: true })

function encode(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "")
}

function decode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/")
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export function generateContactDataEncryptionKey() {
  return encode(crypto.getRandomValues(new Uint8Array(32)))
}

export function isEncryptedContactValue(value: string) {
  return value.startsWith(prefix)
}

export function createContactDataProtector(encodedKey: string) {
  const rawKey = decode(encodedKey)
  if (rawKey.byteLength !== 32) throw new Error("CONTACT_DATA_ENCRYPTION_KEY must be a base64url encoded 256-bit key")
  const keyPromise = crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt", "decrypt"])

  return {
    async encrypt(value: string) {
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyPromise, encoder.encode(value))
      return `${prefix}${encode(iv)}:${encode(new Uint8Array(ciphertext))}`
    },
    async decrypt(value: string) {
      if (!isEncryptedContactValue(value)) return value
      const [version, algorithm, ivValue, ciphertextValue, extra] = value.split(":")
      if (version !== "enc" || algorithm !== "v1" || !ivValue || !ciphertextValue || extra !== undefined) {
        throw new Error("Malformed encrypted contact value")
      }
      const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: decode(ivValue) },
        await keyPromise,
        decode(ciphertextValue),
      )
      return decoder.decode(plaintext)
    },
  }
}

export function getContactDataProtector() {
  const key = process.env.CONTACT_DATA_ENCRYPTION_KEY?.trim()
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("CONTACT_DATA_ENCRYPTION_KEY is required in production")
    return null
  }
  return createContactDataProtector(key)
}
