import assert from "node:assert/strict"
import test from "node:test"

import { hasAdminLoginConfiguration } from "./admin-login-config.ts"

const passwordHash = "pbkdf2-sha256$100000$MDEyMzQ1Njc4OWFiY2RlZg$CQEF03iMraucElCfobodRqkaFY16F3mxFDIvP9WoJcs"

test("rejects a login configuration with no administrator password", () => {
  assert.equal(
    hasAdminLoginConfiguration({
      email: "admin@example.com",
      passwordHash: "",
      sessionSecret: "dummy-session-signing-secret-with-32-chars",
    }),
    false,
  )
})

test("accepts a login configuration with all required credentials", () => {
  assert.equal(
    hasAdminLoginConfiguration({
      email: "admin@example.com",
      passwordHash,
      sessionSecret: "dummy-session-signing-secret-with-32-chars",
    }),
    true,
  )
})

test("rejects a login configuration with a short session signing secret", () => {
  assert.equal(
    hasAdminLoginConfiguration({
      email: "admin@example.com",
      passwordHash,
      sessionSecret: "too-short",
    }),
    false,
  )
})

test("rejects a malformed administrator password hash", () => {
  assert.equal(
    hasAdminLoginConfiguration({
      email: "admin@example.com",
      passwordHash: "password",
      sessionSecret: "dummy-session-signing-secret-with-32-chars",
    }),
    false,
  )
})
