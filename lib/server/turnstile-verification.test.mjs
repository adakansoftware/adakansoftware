import assert from "node:assert/strict"
import test from "node:test"

import { isTurnstileConfigured, verifyTurnstileToken } from "./turnstile-verification.ts"

test("skips verification while Turnstile is not configured", async () => {
  const previousSecret = process.env.TURNSTILE_SECRET_KEY
  delete process.env.TURNSTILE_SECRET_KEY

  try {
    assert.equal(isTurnstileConfigured(), false)
    assert.deepEqual(await verifyTurnstileToken(undefined, "127.0.0.1"), { ok: true, skipped: true })
    assert.deepEqual(await verifyTurnstileToken("some-token", "127.0.0.1"), { ok: true, skipped: true })
  } finally {
    if (previousSecret !== undefined) {
      process.env.TURNSTILE_SECRET_KEY = previousSecret
    }
  }
})

test("rejects a missing token while Turnstile is configured", async () => {
  const previousSecret = process.env.TURNSTILE_SECRET_KEY
  process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA"

  try {
    assert.equal(isTurnstileConfigured(), true)
    assert.deepEqual(await verifyTurnstileToken(undefined, "127.0.0.1"), { ok: false, skipped: false })
    assert.deepEqual(await verifyTurnstileToken("   ", "127.0.0.1"), { ok: false, skipped: false })
  } finally {
    if (previousSecret !== undefined) {
      process.env.TURNSTILE_SECRET_KEY = previousSecret
    } else {
      delete process.env.TURNSTILE_SECRET_KEY
    }
  }
})
