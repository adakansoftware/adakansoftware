import assert from "node:assert/strict"
import test from "node:test"

import { selectHomepageProjects } from "./public-projects.ts"

const project = (title) => ({
  title,
  href: "/projects",
  category: "Web sitesi",
  year: "2026",
  description: "Proje açıklaması",
  color: "#0071e3",
})

test("homepage portfolio excludes Mira Secret regardless of casing or spacing", () => {
  const selected = selectHomepageProjects([
    project("  MIRA SECRET "),
    project("Z Grup İnşaat"),
    project("Salihoğulları Hafriyat"),
  ])

  assert.deepEqual(selected.map((item) => item.title), ["Z Grup İnşaat", "Salihoğulları Hafriyat"])
})

test("homepage portfolio keeps at most two public projects", () => {
  const selected = selectHomepageProjects([
    project("Birinci Proje"),
    project("İkinci Proje"),
    project("Üçüncü Proje"),
  ])

  assert.deepEqual(selected.map((item) => item.title), ["Birinci Proje", "İkinci Proje"])
})
