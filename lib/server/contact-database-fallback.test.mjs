import assert from "node:assert/strict"
import test from "node:test"

import { persistContactWithoutDelivery } from "./contact-database-fallback.ts"

const submission = {
  name: "Ada Example",
  email: "ada@example.com",
  phone: "+90 555 000 00 00",
  project: "A production website inquiry that must not be lost.",
  locale: "tr",
}

test("database fallback persists a contact before acknowledging it", async () => {
  const recorded = []

  const response = await persistContactWithoutDelivery(submission, async (value) => {
    recorded.push(value)
  })

  assert.deepEqual(recorded, [submission])
  assert.deepEqual(response, {
    ok: true,
    accepted: true,
    deliveryConfigured: false,
    duplicate: false,
    skippedDelivery: true,
    queued: false,
    fallback: "database",
  })
})

test("database fallback never acknowledges a failed persistence write", async () => {
  await assert.rejects(
    persistContactWithoutDelivery(submission, async () => {
      throw new Error("database unavailable")
    }),
    /database unavailable/,
  )
})
