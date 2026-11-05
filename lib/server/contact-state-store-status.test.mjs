import assert from "node:assert/strict"
import test from "node:test"

import { getSafeContactStateError } from "./contact-state-status.ts"
import { loadTypescript } from "../test-support/load-typescript.mjs"

test("does not expose a failed backend's raw error to an HTTP response", () => {
  assert.equal(
    getSafeContactStateError({
      available: false,
      error: "Redis authentication failed for redis://service-user:secret@redis.internal:6379",
    }),
    "Contact state is unavailable",
  )
})

test("does not create an error message while the contact state is available", () => {
  assert.equal(getSafeContactStateError({ available: true, error: null }), null)
})

test("fails closed when production resolves to the file backend", async () => {
  const load = loadTypescript({ env: { NODE_ENV: "production", CONTACT_STATE_BACKEND: "" } })
  const storeModule = load("lib/server/contact-state-store.ts")
  const status = await storeModule.getContactStateStoreStatus("production")

  assert.equal(status.backend, "file")
  assert.equal(status.available, false)
  assert.equal(status.error, "file backend is not supported in production")
  assert.equal(status.capabilities.requestedBackendReady, false)
})

test("keeps the file backend available outside production", async () => {
  const load = loadTypescript({ env: { NODE_ENV: "development", CONTACT_STATE_BACKEND: "" } })
  const storeModule = load("lib/server/contact-state-store.ts")
  const status = await storeModule.getContactStateStoreStatus("development")

  assert.equal(status.backend, "file")
  assert.equal(status.available, true)
  assert.equal(status.capabilities.requestedBackendReady, true)
})
