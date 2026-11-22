import assert from "node:assert/strict"
import test from "node:test"
import { createSmokeEnvironment } from "../scripts/smoke-environment.mjs"

test("smoke defaults isolate credentials, email, database and file state", () => {
  const environment = createSmokeEnvironment({
    PATH: "system-path", DATABASE_URL: "production", REDIS_URL: "production",
    RESEND_API_KEY: "production", CONTACT_ADMIN_KEY: "production",
    TURNSTILE_SECRET_KEY: "production", NEXT_PUBLIC_TURNSTILE_SITE_KEY: "production",
    CONTACT_STATE_DIRECTORY: "existing-data", ADMIN_SESSION_SECRET: "production",
    CONTACT_RATE_LIMIT_MAX_REQUESTS: "1",
  }, "/temporary/smoke", "dev")
  assert.equal(environment.PATH, "system-path")
  assert.equal(environment.DATABASE_URL, "")
  assert.equal(environment.REDIS_URL, "")
  assert.equal(environment.RESEND_API_KEY, "")
  assert.equal(environment.TURNSTILE_SECRET_KEY, "")
  assert.equal(environment.NEXT_PUBLIC_TURNSTILE_SITE_KEY, "")
  assert.equal(environment.CONTACT_STATE_DIRECTORY, "/temporary/smoke")
  assert.equal(environment.CONTACT_ADMIN_KEY, "test-admin-key")
  assert.equal(environment.CONTACT_RATE_LIMIT_MAX_REQUESTS, "")
  assert.notEqual(environment.ADMIN_SESSION_SECRET, "production")
})

test("contact writes require an explicit disposable database", () => {
  assert.throws(() => createSmokeEnvironment({ SMOKE_ENABLE_CONTACT_WRITES: "1", DATABASE_URL: "production" }, "/temporary/smoke", "dev"), /SMOKE_DATABASE_URL/)
  const environment = createSmokeEnvironment({ SMOKE_ENABLE_CONTACT_WRITES: "1", SMOKE_DATABASE_URL: "postgresql://test:test-fixture-password@localhost/smoke", DATABASE_URL: "production" }, "/temporary/smoke", "dev")
  assert.equal(environment.DATABASE_URL, "postgresql://test:test-fixture-password@localhost/smoke")
  assert.equal(environment.RESEND_API_KEY, "")
  assert.throws(() => createSmokeEnvironment({ SMOKE_ENABLE_CONTACT_WRITES: "1", SMOKE_DATABASE_URL: "postgresql://localhost/smoke" }, "/temporary/smoke", "start"), /development/)
})
