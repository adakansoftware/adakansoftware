import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

function readPngSize(path) {
  const image = readFileSync(path)

  assert.equal(image.subarray(1, 4).toString("ascii"), "PNG", `${path} must be a PNG`)

  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
  }
}

test("favicon assets preserve the production logo in browser-ready sizes", () => {
  assert.ok(existsSync("public/favicon-v3.svg"), "Missing the vector Adakan favicon")
  assert.deepEqual(readPngSize("public/favicon-48-v3.png"), { width: 48, height: 48 })
  assert.deepEqual(readPngSize("public/icon-192-v3.png"), { width: 192, height: 192 })
  assert.deepEqual(readPngSize("public/icon-512-v3.png"), { width: 512, height: 512 })
  assert.deepEqual(readPngSize("public/apple-icon-180-v3.png"), { width: 180, height: 180 })

  const vectorIcon = readFileSync("public/favicon-v3.svg", "utf8")
  assert.match(vectorIcon, /viewBox="0 0 794\.49 519"/)
  assert.doesNotMatch(vectorIcon, /<image\b/, "The vector favicon must not embed a raster image")

  const layout = readFileSync("app/layout.tsx", "utf8")

  assert.match(layout, /url: "\/favicon-v3\.svg", type: "image\/svg\+xml", sizes: "any"/)
  assert.match(layout, /url: "\/favicon-48-v3\.png", type: "image\/png", sizes: "48x48"/)
  assert.match(layout, /url: "\/icon-192-v3\.png", type: "image\/png", sizes: "192x192"/)
  assert.match(layout, /url: "\/icon-512-v3\.png", type: "image\/png", sizes: "512x512"/)
  assert.match(layout, /shortcut: "\/favicon-48-v3\.png"/)
  assert.match(layout, /url: "\/apple-icon-180-v3\.png", type: "image\/png", sizes: "180x180"/)
  assert.doesNotMatch(layout, /url: "\/favicon\.png"/)
  assert.doesNotMatch(layout, /url: "\/apple-icon\.png"/)
})
