import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { URL } from "node:url"

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8")

test("live project indicators use the shared blue brand status", () => {
  const badge = read("../components/live-status-badge.tsx")
  const listing = read("../components/project-listing-cards.tsx")
  const homeProjects = read("../components/projects-section.tsx")

  assert.match(badge, /text-accent/)
  assert.match(badge, /bg-accent/)
  assert.doesNotMatch(badge, /emerald|green/)
  assert.match(listing, /<LiveStatusBadge locale=\{locale\}/)
  assert.match(homeProjects, /<LiveStatusBadge locale=\{locale\}/)
})

test("route loading boundaries share a branded progress treatment", () => {
  const loader = read("../components/page-loading.tsx")
  const rootLoading = read("../app/loading.tsx")
  const localeLoading = read("../app/[locale]/loading.tsx")

  assert.match(rootLoading, /<PageLoading/)
  assert.match(localeLoading, /<PageLoading/)
  assert.match(loader, /loading-progress/)
  assert.match(loader, /favicon-v3\.svg/)
  assert.doesNotMatch(loader, /animate-spin|emerald|green/)
})
