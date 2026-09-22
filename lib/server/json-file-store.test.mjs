import assert from "node:assert/strict"
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { readJsonFile, updateJsonFile, writeJsonFile } from "./json-file-store.ts"

test("a failed write or update does not poison later queued writes", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "adakan-json-"))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const blocker = join(directory, "blocker")
  const target = join(directory, "state.json")
  await writeFile(blocker, "not a directory")
  await assert.rejects(writeJsonFile(join(blocker, "state.json"), {}))
  await writeJsonFile(target, { count: 1 })
  await assert.rejects(updateJsonFile(target, {}, () => { throw new Error("updater failed") }), /updater failed/)
  await updateJsonFile(target, {}, (state) => ({ count: state.count + 1 }))
  assert.deepEqual(await readJsonFile(target, null), { count: 2 })
})

test("failed serialization preserves the previous valid file and cleans temporary files", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "adakan-json-"))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const target = join(directory, "state.json")
  await writeJsonFile(target, { count: 7 })
  await assert.rejects(writeJsonFile(target, { invalid: 1n }))
  assert.deepEqual(JSON.parse(await readFile(target, "utf8")), { count: 7 })
  await writeJsonFile(target, { count: 8 })
  assert.deepEqual(await readdir(directory), ["state.json"])
})

test("concurrent updates preserve every increment", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "adakan-json-"))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const target = join(directory, "state.json")
  await Promise.all(Array.from({ length: 20 }, () => updateJsonFile(target, { count: 0 }, (state) => ({ count: state.count + 1 }))))
  assert.deepEqual(await readJsonFile(target, null), { count: 20 })
})
