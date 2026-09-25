import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

import { loadTypescript } from "./test-support/load-typescript.mjs"

const load = loadTypescript()
const { demoExamplesByLocale } = load("lib/site-data.ts")

test("demos page exposes the supplied dental demo in both locales", () => {
  const expectedHref = "https://dental-demo-by-adakansoftware.vercel.app/"
  const expectedImage = "/demos/adakan-dental-clinic.png"

  for (const locale of ["tr", "en"]) {
    const demo = demoExamplesByLocale[locale].find((item) => item.href === expectedHref)
    assert.ok(demo, `Missing dental demo for ${locale}`)
    assert.equal(demo.coverImage, expectedImage)
  }

  assert.ok(existsSync("public/demos/adakan-dental-clinic.png"))
  assert.ok(existsSync("app/demos/page.tsx"))
  assert.ok(existsSync("app/[locale]/demos/page.tsx"))
})

test("demos page exposes the live Z Grup construction demo", () => {
  const expectedHref = "https://zgrupinsaat.vercel.app/"

  for (const locale of ["tr", "en"]) {
    const demo = demoExamplesByLocale[locale].find((item) => item.href === expectedHref)
    assert.ok(demo, `Missing Z Grup demo for ${locale}`)
    assert.equal(demo.coverImage, "/projects/z-grup-insaat-cover.png")
  }
})

test("demos page exposes the supplied TableFlow POS demo", () => {
  const expectedHref = "https://tableflow-pos-ui.vercel.app/"
  const expectedImage = "/demos/tableflow-pos-dashboard.png"

  for (const locale of ["tr", "en"]) {
    const demo = demoExamplesByLocale[locale].find((item) => item.href === expectedHref)
    assert.ok(demo, `Missing TableFlow POS demo for ${locale}`)
    assert.equal(demo.coverImage, expectedImage)
  }

  assert.ok(existsSync("public/demos/tableflow-pos-dashboard.png"))
})

test("primary navigation links to the demos page", () => {
  const navbar = readFileSync("components/navbar.tsx", "utf8")
  assert.match(navbar, /\["Demolar", "\/demos"\]/)
  assert.match(navbar, /\["Demos", "\/demos"\]/)
})

test("navbar exposes a persistent light and dark theme control", () => {
  const navbar = readFileSync("components/navbar.tsx", "utf8")
  const toggle = readFileSync("components/theme-toggle.tsx", "utf8")
  const layout = readFileSync("app/layout.tsx", "utf8")
  const page = readFileSync("components/demos-page.tsx", "utf8")

  assert.match(navbar, /<ThemeToggle/)
  assert.match(toggle, /localStorage\.setItem\("theme"/)
  assert.match(toggle, /classList\.toggle\("dark"/)
  assert.match(layout, /localStorage\.getItem\('theme'\)/)
  assert.doesNotMatch(page, /demos-tone-flow/)
})
