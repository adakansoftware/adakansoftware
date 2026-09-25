import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

test("logo artwork uses theme-aware surfaces without changing brand colors", () => {
  const card = readFileSync("components/portfolio-logo-card.tsx", "utf8")

  assert.match(card, /bg-white[^"\n]*dark:bg-\[#8f949c\]/)
  assert.doesNotMatch(card, /useMutedCard/)
  assert.match(card, /bg-secondary\/50[^"\n]*dark:bg-white\/\[0\.04\]/)
  assert.doesNotMatch(card, /dark:invert/)
  assert.doesNotMatch(card, /dark:hue-rotate-180/)
  assert.doesNotMatch(card, /dark:drop-shadow-/)
})

test("Adakan Software logo card uses the existing vector artwork", () => {
  const data = readFileSync("lib/site-data.ts", "utf8")

  assert.match(data, /title: "Adakan Software"[\s\S]*?logoImage: "\/favicon-v3\.svg"/)
})

test("Adakan Hafriyat logo card uses the supplied vector artwork", () => {
  const data = readFileSync("lib/site-data.ts", "utf8")

  assert.match(data, /title: "Adakan Hafriyat"[\s\S]*?logoImage: "\/projects\/adakan-hafriyat-logo\.svg"/)
  assert.ok(existsSync("public/projects/adakan-hafriyat-logo.svg"))
})

test("Z Grup logo card uses the supplied vector artwork", () => {
  const data = readFileSync("lib/site-data.ts", "utf8")

  assert.match(data, /title: "Z Grup"[\s\S]*?logoImage: "\/projects\/z-grup-logo\.svg"/)
  assert.ok(existsSync("public/projects/z-grup-logo.svg"))
})

test("Salihoğulları logo card uses the supplied vector artwork", () => {
  const data = readFileSync("lib/site-data.ts", "utf8")

  assert.match(data, /title: "Salihoğulları Hafriyat"[\s\S]*?logoImage: "\/projects\/salihogullari-hafriyat-logo\.svg"/)
  assert.ok(existsSync("public/projects/salihogullari-hafriyat-logo.svg"))
})
