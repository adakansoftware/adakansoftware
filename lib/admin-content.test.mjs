import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { parseContentKind, parseContentPayload } from "./admin-content.ts"

test("accepts only known content kinds", () => {
  assert.equal(parseContentKind("projects"), "projects")
  assert.equal(parseContentKind("logo_works"), "logo_works")
  assert.equal(parseContentKind("projects; drop table projects"), null)
})

test("rejects content that cannot fit the publish snapshot or database sort column", () => {
  const base = {
    title_tr: "Başlık", title_en: "Title", category_tr: "Kategori", category_en: "Category",
    description_tr: "Açıklama", description_en: "Description", year: "2026", href: "/projects/example",
    initials: "AB", color: "#0066ff", published: true, archived: false, sort_order: 0,
  }
  for (const kind of ["projects", "logo_works"]) {
    for (const field of ["title_tr", "description_en", kind === "projects" ? "year" : "initials"]) {
      assert.equal(parseContentPayload(kind, { ...base, [field]: "a".repeat(20_001) }).ok, false, field)
      assert.equal(parseContentPayload(kind, { ...base, [field]: "a".repeat(20_000) }).ok, true, field)
    }
    assert.equal(parseContentPayload(kind, { ...base, sort_order: 2_147_483_648 }).ok, false)
    assert.equal(parseContentPayload(kind, { ...base, sort_order: 2_147_483_647 }).ok, true)
    const imageField = kind === "projects" ? "cover_image" : "logo_image"
    assert.equal(parseContentPayload(kind, { ...base, [imageField]: "https://example.com/" + "ü".repeat(4000) }).ok, false)
  }
})

test("requires project fields and validates image URLs", () => {
  const valid = parseContentPayload("projects", {
    title_tr: "Başlık",
    title_en: "Title",
    category_tr: "Kategori",
    category_en: "Category",
    description_tr: "Açıklama",
    description_en: "Description",
    year: "2026",
    href: "/projects/example",
    color: "#0066ff",
    cover_image: "https://images.example.com/cover.webp",
    published: true,
    archived: false,
    sort_order: 2,
  })
  assert.equal(valid.ok, true)
  if (!valid.ok) return
  assert.equal(valid.data.cover_image, "https://images.example.com/cover.webp")

  const invalid = parseContentPayload("projects", { ...valid.data, cover_image: "javascript:alert(1)" })
  assert.deepEqual(invalid, { ok: false, message: "Geçerli bir görsel URL’si girin." })
})

test("rejects unsafe project links", () => {
  const base = {
    title_tr: "Başlık",
    title_en: "Title",
    category_tr: "Kategori",
    category_en: "Category",
    description_tr: "Açıklama",
    description_en: "Description",
    year: "2026",
    color: "#0066ff",
    cover_image: null,
    published: true,
    archived: false,
    sort_order: 2,
  }

  assert.equal(parseContentPayload("projects", { ...base, href: "/projects/example" }).ok, true)
  assert.equal(parseContentPayload("projects", { ...base, href: "https://example.com" }).ok, true)
  assert.equal(parseContentPayload("projects", { ...base, href: "javascript:alert(1)" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "//evil.example" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "/\\evil.example" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "http://example.com" }).ok, false)
})

test("accepts only six-digit hexadecimal content colors", () => {
  const base = {
    title_tr: "Başlık",
    title_en: "Title",
    category_tr: "Kategori",
    category_en: "Category",
    description_tr: "Açıklama",
    description_en: "Description",
    year: "2026",
    href: "/projects/example",
    cover_image: null,
    published: true,
    archived: false,
    sort_order: 2,
  }

  assert.equal(parseContentPayload("projects", { ...base, color: "#12aBef" }).ok, true)
  assert.equal(parseContentPayload("projects", { ...base, color: "red" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, color: "#fff" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, color: "red);background:url(https://evil.invalid)" }).ok, false)
})

test("admin manager does not import the Supabase browser client", () => {
  const source = readFileSync("components/admin/admin-content-manager.tsx", "utf8")
  assert.doesNotMatch(source, /getSupabaseBrowserClient/)
})

test("package does not declare Supabase", () => {
  const packageJson = readFileSync("package.json", "utf8")
  assert.doesNotMatch(packageJson, /@supabase\/supabase-js/)
})
