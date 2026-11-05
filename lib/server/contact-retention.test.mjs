import assert from "node:assert/strict"
import test from "node:test"

import { CONTACT_RETENTION_MONTHS, eraseExpiredContactRequests, previewExpiredContactRequests } from "./contact-retention.ts"

test("previews only expired records and reports holds separately", async () => {
  const calls = []
  const now = new Date("2026-09-30T12:00:00.000Z")
  const result = await previewExpiredContactRequests({
    query: async (statement, values) => {
      calls.push({ statement, values })
      return [{ eligible_count: 3, held_count: 2, oldest_eligible_at: "2024-01-01T00:00:00.000Z" }]
    },
  }, now)

  assert.equal(CONTACT_RETENTION_MONTHS, 24)
  assert.deepEqual(result, { eligibleCount: 3, heldCount: 2, oldestEligibleAt: "2024-01-01T00:00:00.000Z" })
  assert.match(calls[0].statement, /retention_until <= \$1/)
  assert.match(calls[0].statement, /retention_hold = false/)
  assert.deepEqual(calls[0].values, [now.toISOString()])
})

test("deletes eligible rows atomically and writes only an aggregate audit", async () => {
  const calls = []
  const now = new Date("2026-09-30T12:00:00.000Z")
  const result = await eraseExpiredContactRequests({
    query: async (statement, values) => {
      calls.push({ statement, values })
      return [{
        eligible_count: 4,
        held_count: 1,
        oldest_eligible_at: "2023-09-30T12:00:00.000Z",
        run_id: values[1],
        deleted_count: 4,
        executed_at: values[0],
      }]
    },
  }, now, "operator")

  assert.equal(result.deletedCount, 4)
  assert.equal(result.heldCount, 1)
  assert.equal(result.executedAt, now.toISOString())
  assert.match(result.runId, /^[0-9a-f-]{36}$/)
  assert.match(calls[0].statement, /delete from contact_requests/)
  assert.match(calls[0].statement, /retention_hold = false/)
  assert.match(calls[0].statement, /insert into contact_deletion_audits/)
  assert.match(calls[0].statement, /interval '3 years'/)
  assert.doesNotMatch(calls[0].statement, /\b(name|email|phone|project)\b/)
  assert.deepEqual(calls[0].values.slice(0, 1), [now.toISOString()])
  assert.equal(calls[0].values[2], "operator")
})

test("does not report success when the database operation fails", async () => {
  await assert.rejects(
    eraseExpiredContactRequests({ query: async () => { throw new Error("database unavailable") } }),
    /database unavailable/,
  )
})
