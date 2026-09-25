/* global URL */
import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const layout = fs.readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
const globals = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
const studio = fs.readFileSync(new URL("../app/studio.css", import.meta.url), "utf8")
const navbar = fs.readFileSync(new URL("../components/navbar.tsx", import.meta.url), "utf8")

test("critical text uses the system font stack without shipping remote font payloads", () => {
  assert.doesNotMatch(layout, /next\/font\/google|Inter\(/)
  assert.match(globals, /-apple-system/)
  assert.match(globals, /BlinkMacSystemFont/)
})

test("production layout does not request provider-specific analytics on unsupported hosts", () => {
  assert.doesNotMatch(layout, /@vercel\/analytics|<Analytics/)
})

test("brand link derives its accessible name from the visible Adakan Software text", () => {
  assert.doesNotMatch(navbar, /className="studio-brand"[^>]+aria-label=/)
})

test("light and dark links use contrast-safe blue tokens", () => {
  assert.match(globals, /--accent: #0066cc/)
  assert.match(globals, /\.dark[\s\S]*?--accent: #2997ff/)
  assert.match(studio, /\.dark \.studio-link[^}]*color: #2997ff/)
})
