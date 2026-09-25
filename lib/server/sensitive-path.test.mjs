import assert from "node:assert/strict"
import test from "node:test"

test("sensitive dot paths are denied while well-known verification remains available", async () => {
  const sensitivePathModule = await import("./sensitive-path.ts").catch(() => ({}))
  assert.equal(typeof sensitivePathModule.isSensitiveDotPath, "function")

  assert.equal(sensitivePathModule.isSensitiveDotPath("/.env"), true)
  assert.equal(sensitivePathModule.isSensitiveDotPath("/assets/.git/config"), true)
  assert.equal(sensitivePathModule.isSensitiveDotPath("/.well-known/.env"), true)
  assert.equal(sensitivePathModule.isSensitiveDotPath("/%2eenv"), true)
  assert.equal(sensitivePathModule.isSensitiveDotPath("/%252eenv"), true)
  assert.equal(sensitivePathModule.isSensitiveDotPath("/.well-known/acme-challenge/token"), false)
  assert.equal(sensitivePathModule.isSensitiveDotPath("/favicon.ico"), false)
  assert.equal(sensitivePathModule.isSensitiveDotPath("/projects/adakan-software"), false)
})
