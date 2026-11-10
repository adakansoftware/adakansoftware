import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

function readPngSize(path) {
  const image = readFileSync(path)
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) }
}

assert.deepEqual(readPngSize("public/favicon-48-v4.png"), { width: 48, height: 48 })
assert.deepEqual(readPngSize("public/icon-192-v4.png"), { width: 192, height: 192 })
assert.deepEqual(readPngSize("public/icon-512-v4.png"), { width: 512, height: 512 })
assert.deepEqual(readPngSize("public/apple-icon-180-v4.png"), { width: 180, height: 180 })

const layout = readFileSync("app/layout.tsx", "utf8")
assert.match(layout, /url: "\/favicon-48-v4\.png"/, "Missing the 48px Adakan favicon")
assert.match(layout, /url: "\/icon-192-v4\.png"/, "Missing the 192px Adakan icon")
assert.match(layout, /url: "\/icon-512-v4\.png"/, "Missing the 512px Adakan icon")
assert.match(layout, /url: "\/apple-icon-180-v4\.png"/, "Missing the Adakan Apple touch icon")
