/* global URL */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { hashAdminPassword, matchesAdminCredentials, verifyAdminPassword } from "./admin-login-credentials.ts"

const passwordHash = "pbkdf2-sha256$100000$MDEyMzQ1Njc4OWFiY2RlZg$CQEF03iMraucElCfobodRqkaFY16F3mxFDIvP9WoJcs"

test("accepts only an exact administrator email and hashed password match", async () => {
  const expected = { email: "owner@example.com", passwordHash }

  assert.equal(await matchesAdminCredentials(expected.email, "correct horse battery staple", expected), true)
  assert.equal(await matchesAdminCredentials("other@example.com", "correct horse battery staple", expected), false)
  assert.equal(await matchesAdminCredentials(expected.email, "wrong password", expected), false)
})

test("rejects missing or malformed password hashes safely", async () => {
  assert.equal(await matchesAdminCredentials("owner@example.com", "secret", { email: undefined, passwordHash: undefined }), false)
  assert.equal(await matchesAdminCredentials("owner@example.com", "secret", { email: "owner@example.com", passwordHash: "invalid" }), false)
  assert.equal(await matchesAdminCredentials("ö@example.com", "secret", { email: "o@example.com", passwordHash }), false)
})

test("generates a salted production password hash that verifies only the original password", async () => {
  const generated = await hashAdminPassword("a unique administrator password")

  assert.match(generated, /^pbkdf2-sha256\$100000\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/)
  assert.equal(await verifyAdminPassword("a unique administrator password", generated), true)
  assert.equal(await verifyAdminPassword("a different password", generated), false)
})

test("keeps PBKDF2 within Cloudflare Web Crypto's supported iteration limit", () => {
  const source = readFileSync(new URL("./admin-login-credentials.ts", import.meta.url), "utf8")

  assert.match(source, /productionIterations = 100_000/)
  assert.doesNotMatch(source, /from ["']node:crypto["']/)
  assert.doesNotMatch(source, /@noble\/hashes/)
  assert.match(source, /crypto\.subtle/)
})
