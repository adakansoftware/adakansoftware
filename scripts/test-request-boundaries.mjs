/* global console, fetch, process */
import assert from "node:assert/strict"
import { request as httpRequest } from "node:http"

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3101"
let client = 0

async function post(path, body, contentType = "application/json") {
  client += 1
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": contentType,
      origin: baseUrl,
      "x-forwarded-for": `127.0.0.${client}`,
    },
    body,
  })
  assert.equal(response.headers.get("cache-control"), "no-store")
  assert.ok(response.headers.get("x-request-id"))
  return response
}

for (const path of ["/", "/en", "/contact", "/en/contact", "/admin/login"]) {
  const response = await fetch(`${baseUrl}${path}`)
  assert.equal(response.status, 200, path)
}

for (const path of ["/api/contact", "/api/admin/login"]) {
  for (const body of ["{", "[]", "null"]) {
    assert.equal((await post(path, body)).status, 400, `${path}: malformed body`)
  }
  assert.equal((await post(path, "{}", "text/plain; note=application/json")).status, 400)
  assert.equal((await post(path, "{}", "application/jsonp")).status, 400)
  assert.equal((await post(path, " ".repeat(33 * 1024))).status, 413)
}

// Send chunked HTTP with no Content-Length: the route must enforce its own limit.
await new Promise((resolve, reject) => {
  const request = httpRequest(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: baseUrl, "x-forwarded-for": "127.0.0.200" },
  }, (response) => {
    response.resume()
    response.on("end", () => {
      try {
        assert.equal(response.statusCode, 413)
        resolve()
      } catch (error) { reject(error) }
    })
  })
  request.on("error", reject)
  request.setTimeout(15_000, () => request.destroy(new Error("Chunked request timed out")))
  request.write(" ".repeat(13_000))
  request.end()
})

for (const path of ["/api/admin/content", "/api/admin/contact-requests"]) {
  assert.equal((await fetch(`${baseUrl}${path}`)).status, 401)
}

console.log("Request boundary checks passed: pages, malformed JSON, media types, body limits, chunked requests and admin authorization.")
