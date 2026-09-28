import assert from "node:assert/strict"
import test from "node:test"

import { createContactDataProtector, generateContactDataEncryptionKey } from "./contact-data-protection.ts"

test("encrypts contact data with randomized authenticated encryption", async () => {
  const protector = createContactDataProtector(generateContactDataEncryptionKey())
  const first = await protector.encrypt("person@example.com")
  const second = await protector.encrypt("person@example.com")

  assert.notEqual(first, "person@example.com")
  assert.notEqual(first, second)
  assert.equal(await protector.decrypt(first), "person@example.com")
  assert.equal(await protector.decrypt(second), "person@example.com")
})

test("rejects tampered contact ciphertext", async () => {
  const protector = createContactDataProtector(generateContactDataEncryptionKey())
  const encrypted = await protector.encrypt("sensitive")
  const parts = encrypted.split(":")
  parts[3] = `${parts[3][0] === "A" ? "B" : "A"}${parts[3].slice(1)}`

  await assert.rejects(() => protector.decrypt(parts.join(":")))
})
