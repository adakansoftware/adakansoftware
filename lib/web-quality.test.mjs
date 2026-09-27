/* global URL */
import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const layout = fs.readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
const globals = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
const studio = fs.readFileSync(new URL("../app/studio.css", import.meta.url), "utf8")
const navbar = fs.readFileSync(new URL("../components/navbar.tsx", import.meta.url), "utf8")
const nextConfigSource = fs.readFileSync(new URL("../next.config.mjs", import.meta.url), "utf8")

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

test("browser chrome follows the visitor's light or dark color scheme", () => {
  assert.match(layout, /media:\s*["']\(prefers-color-scheme: light\)["'][\s\S]*?color:\s*["']#ffffff["']/)
  assert.match(layout, /media:\s*["']\(prefers-color-scheme: dark\)["'][\s\S]*?color:\s*["']#000000["']/)
})

test("production responses do not advertise the framework", () => {
  assert.match(nextConfigSource, /poweredByHeader:\s*false/)
})

test("compact navigation and footer controls keep accessible pointer targets", () => {
  assert.match(studio, /\.studio-theme-toggle[^}]*width:\s*44px[^}]*height:\s*44px/)
  assert.match(studio, /\.studio-nav-cta[^}]*min-height:\s*44px/)
  assert.match(studio, /\.studio-desktop-nav a[^}]*min-height:\s*44px/)
  assert.match(studio, /\.studio-footer-bottom a[^}]*min-width:\s*24px/)
})
