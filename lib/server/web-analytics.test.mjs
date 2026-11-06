import assert from "node:assert/strict"
import test from "node:test"

import { loadTypescript } from "../test-support/load-typescript.mjs"

test("analytics stays fully disabled without a token", () => {
  const load = loadTypescript()
  const { isWebAnalyticsEnabled, cloudflareAnalyticsToken, privacyStorageParagraphs } = load(
    "lib/server/web-analytics.ts",
  )

  assert.equal(isWebAnalyticsEnabled(), false)
  assert.equal(cloudflareAnalyticsToken, "")
  for (const locale of ["tr", "en"]) {
    const paragraphs = privacyStorageParagraphs(locale)
    assert.equal(paragraphs.length, 1)
    assert.doesNotMatch(paragraphs[0], /Web Analytics/)
    assert.match(paragraphs[0], /local storage|yerel depolama/i)
  }
})

test("analytics beacon and privacy notice activate together with a token", () => {
  const load = loadTypescript({ env: { CF_ANALYTICS_TOKEN: "test-analytics-token" } })
  const { isWebAnalyticsEnabled, cloudflareAnalyticsToken, privacyStorageParagraphs } = load(
    "lib/server/web-analytics.ts",
  )

  assert.equal(isWebAnalyticsEnabled(), true)
  assert.equal(cloudflareAnalyticsToken, "test-analytics-token")
  for (const locale of ["tr", "en"]) {
    const paragraphs = privacyStorageParagraphs(locale)
    assert.equal(paragraphs.length, 1)
    assert.match(paragraphs[0], /Cloudflare Web Analytics/)
    assert.match(paragraphs[0], /local storage|yerel depolama/i)
    assert.doesNotMatch(paragraphs[0], /üçüncü taraf analiz|third-party analytics/i)
  }
})
