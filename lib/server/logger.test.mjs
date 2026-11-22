import assert from "node:assert/strict"
import test from "node:test"

import { createLogPayload } from "./logger.ts"
import { loadTypescript } from "../test-support/load-typescript.mjs"

test("redacts configured secrets even when upstream errors omit a credential label", () => {
  const secret = ["opaqueRuntime", "Credential98765"].join("")
  const logger = loadTypescript({ env: { CONTACT_ADMIN_SIGNING_SECRET: secret } })("lib/server/logger.ts")
  const payload = logger.createLogPayload("error", "upstream.failed", { error: `rejected value ${secret}` })
  assert.equal(payload.error, "rejected value [REDACTED]")
})

test("redacts quoted JSON credentials, prefixed keys and bare provider tokens", () => {
  const secret = ["opaqueSensitive", "Value987654321"].join("")
  const providerToken = ["re_", "abcdefghijklmnop_1234567890"].join("")
  for (const message of [
    JSON.stringify({ apiKey: secret }),
    JSON.stringify({ CONTACT_DATA_ENCRYPTION_KEY: secret }),
    `upstream rejected ${providerToken}`,
    `callback?access_token=${secret}&result=failed`,
    `ADMIN_SESSION_SECRET=${secret}`,
  ]) {
    const serialized = JSON.stringify(createLogPayload("error", "upstream.failed", { error: message }))
    assert.ok(!serialized.includes(secret), "log leaked a credential")
    assert.ok(!serialized.includes(providerToken), "log leaked a provider token")
  }
})

test("redacts database and encryption fields in nested context", () => {
  const payload = createLogPayload("error", "failed", { nested: { DATABASE_URL: "connection-value", encryptionKey: "key-value" } })
  assert.deepEqual(payload.nested, { DATABASE_URL: "[REDACTED]", encryptionKey: "[REDACTED]" })
})

test("redacts secret-like fields from structured logs", () => {
  const payload = createLogPayload("error", "admin.login.rejected", {
    requestId: "req-1",
    authorization: "Bearer secret",
    password: "password",
    sessionCredential: "session-value",
    nested: { token: "secret-token", email: "person@example.com" },
  })

  assert.equal(payload.authorization, "[REDACTED]")
  assert.equal(payload.password, "[REDACTED]")
  assert.equal(payload.sessionCredential, "[REDACTED]")
  assert.deepEqual(payload.nested, { token: "[REDACTED]", email: "[REDACTED]" })
})

test("redacts credentials embedded inside error-message strings", () => {
  const payload = createLogPayload("error", "database.failed", {
    error: "database postgresql://service-user:test-fixture-password@db.internal/app upstream https://api-user:api-pass@example.com/path",
  })

  assert.equal(payload.error, "database postgresql://[REDACTED]@db.internal/app upstream https://[REDACTED]@example.com/path")
})

test("redacts bearer tokens and inline secret assignments inside messages", () => {
  const payload = createLogPayload("error", "upstream.failed", {
    error: "Authorization: Bearer opaque-token-value token=top-secret-value session=session-value cookie=cookie-value",
  })

  assert.equal(payload.error, "Authorization: Bearer [REDACTED] token=[REDACTED] session=[REDACTED] cookie=[REDACTED]")
})

test("adds a stable structured event envelope", () => {
  const payload = createLogPayload("info", "contact.accepted", { requestId: "req-2", route: "/api/contact" })
  assert.equal(payload.schemaVersion, 1)
  assert.equal(payload.level, "info")
  assert.equal(payload.event, "contact.accepted")
  assert.equal(payload.requestId, "req-2")
  assert.equal(payload.route, "/api/contact")
  assert.equal(typeof payload.timestamp, "string")
})
