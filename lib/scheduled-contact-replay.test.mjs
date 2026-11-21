/* global Response */
import assert from "node:assert/strict"
import test from "node:test"
import { runScheduledContactReplay } from "./server/scheduled-contact-replay.mjs"

const environment = { CONTACT_STATE_BACKEND: "redis", CONTACT_CRON_SECRET: "test-cron-secret-with-at-least-32-characters" }

test("database-only deployments do not attempt outbox replay", async () => {
  const result = await runScheduledContactReplay({}, async () => { throw new Error("unexpected request") })
  assert.equal(result, "skipped")
})

test("scheduled replay sends an authenticated request to the canonical endpoint", async () => {
  const result = await runScheduledContactReplay(environment, async (request) => {
    assert.equal(request.url, "https://adakansoftware.com/api/contact/replay/cron")
    assert.equal(request.method, "POST")
    assert.equal(request.headers.get("authorization"), "Bearer test-cron-secret-with-at-least-32-characters")
    assert.equal(request.redirect, "manual")
    return new Response('{"ok":true}', { status: 200 })
  })
  assert.equal(result, "completed")
})

test("scheduled replay fails closed without a strong cron secret", async () => {
  await assert.rejects(() => runScheduledContactReplay({ CONTACT_STATE_BACKEND: "redis" }, async () => { throw new Error("unexpected request") }), /CONTACT_CRON_SECRET/)
})

test("replay failures surface without leaking response diagnostics", async () => {
  await assert.rejects(() => runScheduledContactReplay(environment, async () => new Response("sensitive diagnostics", { status: 503 })), { message: "Scheduled contact replay failed with HTTP 503" })
  assert.equal(await runScheduledContactReplay(environment, async () => new Response("{}", { status: 409 })), "busy")
  await assert.rejects(() => runScheduledContactReplay(environment, async () => new Response("", { status: 308 })), /HTTP 308/)
})
