import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

function readPngSize(path) {
  const image = readFileSync(path)
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) }
}

assert.deepEqual(readPngSize("public/favicon-32.png"), { width: 32, height: 32 })
assert.deepEqual(readPngSize("public/favicon-512.png"), { width: 512, height: 512 })
assert.deepEqual(readPngSize("public/apple-icon-180.png"), { width: 180, height: 180 })

const layout = readFileSync("app/layout.tsx", "utf8")
assert.match(layout, /url: "\/favicon-32\.png"/, "Missing the 32px Adakan favicon")
assert.match(layout, /url: "\/favicon-512\.png"/, "Missing the 512px Adakan favicon")
assert.match(layout, /url: "\/apple-icon-180\.png"/, "Missing the Adakan Apple touch icon")
