/* global Request, ReadableStream, TextEncoder */
import assert from "node:assert/strict"
import test from "node:test"
import { readBoundedJsonObject, getAdminContentRequestError } from "./admin-content-request.ts"
import { readAdminLoginCredentials } from "./admin-session-request.ts"
import { readBoundedJsonObject as readJson } from "./request-body.ts"

for (const [name, read, limit] of [
  ["admin content", (request) => readBoundedJsonObject(request, 32 * 1024), 32 * 1024],
  ["admin login", readAdminLoginCredentials, 8 * 1024],
]) {
  test(`${name} cancels an oversized stream before consuming the remaining body`, async () => {
    let pulls = 0
    let cancelled = false
    const stream = new ReadableStream({
      pull(controller) {
        pulls += 1
        controller.enqueue(new TextEncoder().encode(" ".repeat(limit + 1)))
        if (pulls === 5) controller.close()
      },
      cancel() { cancelled = true },
    }, { highWaterMark: 0 })
    const request = new Request("https://example.com/api", {
      method: "POST", headers: { "content-type": "application/json", "content-length": "1" },
      body: stream, duplex: "half",
    })
    assert.deepEqual(await read(request), { ok: false, status: 413 })
    assert.equal(cancelled, true)
    assert.equal(pulls, 1)
  })

  test(`${name} returns 400 when the request stream fails`, async () => {
    const request = new Request("https://example.com/api", {
      method: "POST", headers: { "content-type": "application/json" }, duplex: "half",
      body: new ReadableStream({ start(controller) { controller.error(new Error("disconnected")) } }),
    })
    assert.deepEqual(await read(request), { ok: false, status: 400 })
  })
}

test("JSON media type matching rejects lookalikes and accepts case-insensitive JSON", async () => {
  for (const [type, status] of [["text/plain; note=application/json", 400], ["application/jsonp", 400], ["Application/JSON; charset=utf-8", null]]) {
    const request = new Request("https://example.com/api", {
      method: "POST", headers: { "content-type": type }, body: '{"email":"ada@example.com","password":"pass"}',
    })
    assert.equal(getAdminContentRequestError(request, () => true), status)
    const result = await readAdminLoginCredentials(request)
    assert.equal(result.ok ? null : result.status, status)
  }
})

test("counts UTF-8 bytes and decodes characters split across chunks", async () => {
  const bytes = new TextEncoder().encode('{"name":"Çağrı"}')
  function request() {
    let offset = 0
    return new Request("https://example.com/api", {
      method: "POST", duplex: "half",
      body: new ReadableStream({
        pull(controller) {
          if (offset === bytes.length) return controller.close()
          controller.enqueue(bytes.slice(offset, ++offset))
        },
      }),
    })
  }
  assert.deepEqual(await readJson(request(), 19), { ok: true, body: { name: "Çağrı" } })
  assert.deepEqual(await readJson(request(), 18), { ok: false, status: 413 })
})

test("rejects empty, malformed, non-object and invalid UTF-8 JSON bodies", async () => {
  for (const body of ["", "{", "null", "[]", "42", new Uint8Array([123, 34, 120, 34, 58, 34, 255, 34, 125])]) {
    const request = new Request("https://example.com/api", { method: "POST", body })
    assert.deepEqual(await readJson(request, 100), { ok: false, status: 400 })
  }
})
