import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

function readPngSize(path) {
  const image = readFileSync(path)

  assert.equal(image.subarray(1, 4).toString("ascii"), "PNG", `${path} must be a PNG`)

  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
  }
}

test("favicon assets are square and metadata declares their real sizes", () => {
  assert.deepEqual(readPngSize("public/favicon-32.png"), { width: 32, height: 32 })
  assert.deepEqual(readPngSize("public/favicon-512.png"), { width: 512, height: 512 })
  assert.deepEqual(readPngSize("public/apple-icon-180.png"), { width: 180, height: 180 })

  const layout = readFileSync("app/layout.tsx", "utf8")

  assert.match(layout, /url: "\/favicon-32\.png", type: "image\/png", sizes: "32x32"/)
  assert.match(layout, /url: "\/favicon-512\.png", type: "image\/png", sizes: "512x512"/)
  assert.match(layout, /shortcut: "\/favicon-32\.png"/)
  assert.match(layout, /url: "\/apple-icon-180\.png", type: "image\/png", sizes: "180x180"/)
  assert.doesNotMatch(layout, /url: "\/favicon\.png"/)
  assert.doesNotMatch(layout, /url: "\/apple-icon\.png"/)
})
