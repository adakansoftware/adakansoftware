/* global Request */
import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { WatchError } from "redis"
import { createHash } from "node:crypto"
import { loadTypescript } from "../test-support/load-typescript.mjs"

const submission = { name: "Test User", email: "test@example.com", project: "A sufficiently detailed test project.", locale: "tr" }
const silentLogger = { logServerEvent() {} }
const makeRequest = (key) => new Request("https://adakansoftware.com/api/contact", {
  method: "POST", headers: { "content-type": "application/json", ...(key ? { "idempotency-key": key } : {}) },
  body: JSON.stringify(submission),
})

async function routeFixture(t, recordContactRequest) {
  const directory = await mkdtemp(join(tmpdir(), "adakan-contact-"))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const load = loadTypescript({ cwd: directory, overrides: {
    "@/lib/contact-request-store": { recordContactRequest },
    "@/lib/server/logger": silentLogger,
  } })
  return { route: load("app/api/contact/route.ts"), load }
}

for (const key of [undefined, "retry-key"]) {
  test(`retries a failed database write without acknowledging a missing record (${key ?? "no key"})`, async (t) => {
    let attempts = 0
    const { route } = await routeFixture(t, async () => {
      attempts++
      if (attempts === 1) throw new Error("database unavailable")
    })
    assert.equal((await route.POST(makeRequest(key))).status, 503)
    const retry = await route.POST(makeRequest(key))
    assert.equal(retry.status, 200)
    assert.equal(attempts, 2, "retry must persist the contact before reporting success")
    assert.equal((await retry.json()).accepted, true)
  })
}

test("an in-flight duplicate is not acknowledged before persistence completes", async (t) => {
  let unblock
  let started
  const pending = new Promise((resolve) => { unblock = resolve })
  const writing = new Promise((resolve) => { started = resolve })
  let writes = 0
  const { route } = await routeFixture(t, async () => { writes++; started(); await pending })
  const first = route.POST(makeRequest())
  await writing
  try {
    const concurrent = await route.POST(makeRequest())
    assert.equal(concurrent.status, 409)
    assert.equal((await concurrent.json()).ok, false)
  } finally { unblock(); await first }
  const completedDuplicate = await route.POST(makeRequest())
  assert.equal(completedDuplicate.status, 200)
  assert.equal((await completedDuplicate.json()).duplicate, true)
  assert.equal(writes, 1)
})

test("idempotency cleanup preserves a record completed after its initial read", async () => {
  const now = Date.now()
  let records = [["expired", { storedAt: 0 }]]
  const concurrentRecord = ["new", { storedAt: now, fingerprint: "new", status: 200, body: { ok: true } }]
  const store = {
    async readIdempotencyRecords() {
      const snapshot = records.slice()
      if (!records.some(([key]) => key === "new")) records = [...records, concurrentRecord]
      return snapshot
    },
    async writeIdempotencyRecords(next) { records = next },
    async updateIdempotencyRecords(updater) { records = await updater(records) },
    async claimReservation() { return "acquired" },
  }
  const pipeline = loadTypescript({ overrides: {
    "@/lib/server/contact-state-store": { getContactStateStore: () => store },
    "@/lib/server/contact-outbox": {}, "@/lib/server/contact-service": {}, "@/lib/server/logger": silentLogger,
  } })("lib/server/contact-pipeline.ts")
  await pipeline.getIdempotencyReplay(makeRequest("other"), submission, now, "owner")
  assert.deepEqual(records, [concurrentRecord])
})

test("concurrent idempotency keys do not poison retries after the original write fails", async (t) => {
  let unblock
  let started
  const pending = new Promise((resolve) => { unblock = resolve })
  const writing = new Promise((resolve) => { started = resolve })
  let attempts = 0
  const { route } = await routeFixture(t, async () => {
    attempts++
    if (attempts === 1) { started(); await pending; throw new Error("temporary database failure") }
  })
  const first = route.POST(makeRequest("original"))
  await writing
  try {
    assert.equal((await route.POST(makeRequest("original"))).status, 409)
    assert.equal((await route.POST(makeRequest("concurrent"))).status, 409)
  } finally { unblock() }
  assert.equal((await first).status, 503)
  assert.equal((await route.POST(makeRequest("concurrent"))).status, 200)
  assert.equal(attempts, 2)
})

test("a request that acquires a just-released key rechecks the completed response", async () => {
  let completed = false
  const now = Date.now()
  const originalFingerprint = createHash("sha256").update(`${submission.email}\n${submission.project}\n${submission.locale}`).digest("hex")
  const store = {
    async readIdempotencyRecords() { return completed ? [["same", { storedAt: now, fingerprint: originalFingerprint, status: 200, body: { ok: true } }]] : [] },
    async claimReservation() { completed = true; return "acquired" },
  }
  const pipeline = loadTypescript({ overrides: {
    "@/lib/server/contact-state-store": { getContactStateStore: () => store },
    "@/lib/server/contact-outbox": {}, "@/lib/server/contact-service": {}, "@/lib/server/logger": silentLogger,
  } })("lib/server/contact-pipeline.ts")
  const replay = await pipeline.getIdempotencyReplay(makeRequest("same"), { ...submission, project: "Different project" }, now, "second-owner")
  assert.equal(replay?.conflict, true)
})

function redisFixture({ conflicts = 1, failure } = {}) {
  let committed = []
  let attempts = 0
  let closed = false
  const client = {
    async connect() {}, destroy() {}, async quit() { closed = true }, async watch() {},
    async get() { return JSON.stringify(committed) },
    duplicate() { return this },
    multi() {
      let next
      return {
        set(_key, value) { next = JSON.parse(value) },
        async exec() {
          attempts++
          if (failure) throw failure
          if (attempts <= conflicts) {
            committed = [{ id: "other-worker" }]
            throw new WatchError()
          }
          committed = next
          return ["OK"]
        },
      }
    },
  }
  const load = loadTypescript({ env: { CONTACT_STATE_BACKEND: "redis", REDIS_URL: "redis://unused" }, overrides: { redis: { createClient: () => client, WatchError } } })
  return { store: load("lib/server/contact-state-store.ts").getContactStateStore(), state: () => ({ committed, attempts, closed }) }
}

test("Redis WATCH conflicts retry against fresh state without dropping another writer", async () => {
  const { store, state } = redisFixture()
  await store.updateIdempotencyRecords((records) => [...records, { id: "ours" }])
  assert.deepEqual(state(), { committed: [{ id: "other-worker" }, { id: "ours" }], attempts: 2, closed: true })
})

test("Redis retries are bounded and release their connection", async () => {
  const { store, state } = redisFixture({ conflicts: 9 })
  await assert.rejects(store.updateIdempotencyRecords((records) => records), /Redis update conflict/)
  assert.equal(state().attempts, 5)
  assert.equal(state().closed, true)
})

test("Redis infrastructure errors are not retried as transaction conflicts", async () => {
  const failure = new Error("connection lost")
  const { store, state } = redisFixture({ failure })
  await assert.rejects(store.updateIdempotencyRecords((records) => records), (error) => error === failure)
  assert.equal(state().attempts, 1)
  assert.equal(state().closed, true)
})

test("outbox claims contain only entries owned by the final transaction attempt", async () => {
  const entry = { id: "message", email: "test@example.com", locale: "tr", status: "pending", attempts: 0, createdAt: 1, updatedAt: 1 }
  const store = { async updateOutboxEntries(updater) {
    await updater([entry])
    await updater([{ ...entry, leaseOwner: "other", leaseExpiresAt: 500 }])
  } }
  const outbox = loadTypescript({ overrides: { "@/lib/server/contact-state-store": { getContactStateStore: () => store } } })("lib/server/contact-outbox.ts")
  assert.deepEqual(await outbox.claimReplayableContactOutboxEntries({ owner: "ours", now: 100, limit: 2, leaseMs: 300 }), [])
})
