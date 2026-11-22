import assert from "node:assert/strict"
import { mkdtemp, rm, readFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { loadTypescript } from "../test-support/load-typescript.mjs"

test("delivery errors are redacted before persistence and legacy diagnostics are sanitized", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "adakan-redaction-"))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const load = loadTypescript({ cwd: directory })
  const pipeline = load("lib/server/contact-pipeline.ts")
  const outbox = load("lib/server/contact-outbox.ts")
  const entry = await outbox.enqueueContactOutboxEntry({ submission: {
    name: "Test User", email: "test@example.com", project: "Testing safe contact errors.", locale: "tr",
  } })
  const secret = ["opaqueCredential", "1234567890"].join("")
  await pipeline.markContactMessageFailed(entry.id, JSON.stringify({ apiKey: secret }))
  const disk = await readFile(join(directory, ".data", "contact-outbox.json"), "utf8")
  assert.ok(!disk.includes(secret), "outbox persisted an upstream credential")
  await outbox.updateContactOutboxEntry(entry.id, { lastError: `Authorization: Bearer ${secret}` })
  const diagnostics = await outbox.getContactOutboxDiagnostics()
  assert.ok(!JSON.stringify(diagnostics).includes(secret), "diagnostics exposed a legacy credential")
  assert.equal(diagnostics.recent[0].lastError, "Authorization: Bearer [REDACTED]")
})
