/* global URL */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { matchesAdminCredentials } from "./admin-login-credentials.ts"

test("accepts only an exact administrator email and password match", () => {
  const expected = { email: "owner@example.com", password: "correct horse battery staple" }

  assert.equal(matchesAdminCredentials(expected.email, expected.password, expected), true)
  assert.equal(matchesAdminCredentials("other@example.com", expected.password, expected), false)
  assert.equal(matchesAdminCredentials(expected.email, "wrong password", expected), false)
})

test("rejects missing configuration and byte-length mismatches safely", () => {
  assert.equal(matchesAdminCredentials("owner@example.com", "secret", { email: undefined, password: undefined }), false)
  assert.equal(matchesAdminCredentials("ö@example.com", "secret", { email: "o@example.com", password: "secret" }), false)
})

test("uses the Cloudflare-compatible Web Crypto surface", () => {
  const source = readFileSync(new URL("./admin-login-credentials.ts", import.meta.url), "utf8")

  assert.doesNotMatch(source, /from ["']node:crypto["']/)
  assert.match(source, /crypto\.subtle/)
})
