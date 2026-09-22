import assert from "node:assert/strict"
import test from "node:test"
import { createReservationOperations } from "./contact-reservations.ts"

function fixture() {
  let entries = {}
  return createReservationOperations(async (updater) => { entries = updater(entries) })
}

test("only the pending reservation owner can release a request for retry", async () => {
  const store = fixture()
  assert.equal(await store.claimReservation("submission:one", "first", 10000), "acquired")
  await store.releaseReservation("submission:one", "other")
  assert.equal(await store.claimReservation("submission:one", "other", 10000), "pending")
  await store.releaseReservation("submission:one", "first")
  assert.equal(await store.claimReservation("submission:one", "other", 10000), "acquired")
})

test("completion requires ownership and remains acknowledged after request cleanup", async () => {
  const store = fixture()
  await store.claimReservation("submission:one", "first", 10000)
  await store.completeReservation("submission:one", "other")
  assert.equal(await store.claimReservation("submission:one", "other", 10000), "pending")
  await store.completeReservation("submission:one", "first")
  await store.releaseReservation("submission:one", "first")
  assert.equal(await store.claimReservation("submission:one", "other", 10000), "completed")
})

test("an expired owner's completion or cleanup cannot change its replacement", async (t) => {
  let now = 100
  t.mock.method(Date, "now", () => now)
  const store = fixture()
  await store.claimReservation("submission:one", "old", 10)
  now = 110
  assert.equal(await store.claimReservation("submission:one", "new", 10), "acquired")
  await store.completeReservation("submission:one", "old")
  await store.releaseReservation("submission:one", "old")
  assert.equal(await store.claimReservation("submission:one", "third", 10), "pending")
  now = 120
  assert.equal(await store.claimReservation("submission:one", "third", 10), "acquired")
})

test("a retried reservation claim reports only the committed attempt's state", async () => {
  const store = createReservationOperations(async (updater) => {
    updater({})
    updater({ key: { owner: "other", state: "completed", expiresAt: Date.now() + 10000 } })
  })
  assert.equal(await store.claimReservation("key", "ours", 10000), "completed")
})
