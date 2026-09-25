import assert from "node:assert/strict"
import test from "node:test"

test("public health output reveals only availability state", async () => {
  const healthModule = await import("./public-health.ts").catch(() => ({}))
  assert.equal(typeof healthModule.getPublicHealthPayload, "function")
  assert.deepEqual(healthModule.getPublicHealthPayload(false), { ok: false, status: "degraded" })
  assert.deepEqual(healthModule.getPublicHealthPayload(true), { ok: true, status: "ok" })
})
