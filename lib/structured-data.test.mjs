import assert from "node:assert/strict"
import test from "node:test"

import { createBreadcrumbSchema, createServiceSchema, createWebPageSchema } from "./structured-data.ts"

const serviceRoute = { path: "/services", metadataKey: "services" }
const content = {
  title: "Premium Web Design and Brand Agency",
  description: "Premium web design, brand identity, UI/UX, and frontend development services.",
}

test("web page schema uses absolute canonical data without fabricated rating signals", () => {
  const schema = createWebPageSchema({ route: serviceRoute, locale: "en", url: "https://adakansoftware.com/en/services", content })

  assert.equal(schema["@context"], "https://schema.org")
  assert.equal(schema["@type"], "WebPage")
  assert.equal(schema.url, "https://adakansoftware.com/en/services")
  assert.equal(schema.name, content.title)
  assert.equal(schema.description, content.description)
  assert.equal("aggregateRating" in schema, false)
  assert.equal("review" in schema, false)
})

test("service schema names the software capabilities visible on the services page", () => {
  const schema = createServiceSchema({ locale: "tr", url: "https://adakansoftware.com/services" })

  assert.equal(schema["@type"], "Service")
  assert.equal(schema.provider["@id"], "https://adakansoftware.com/#organization")
  assert.deepEqual(schema.serviceType, [
    "Özel Yazılım Geliştirme",
    "Web Tasarımı ve Geliştirme",
    "Next.js Frontend Geliştirme",
    "UI/UX Tasarımı",
    "Marka Kimliği ve Logo Tasarımı",
  ])
})

test("breadcrumb schema links localized inner pages back to the localized home page", () => {
  const schema = createBreadcrumbSchema({ locale: "en", url: "https://adakansoftware.com/en/services", pageName: "Software Development Services" })

  assert.equal(schema["@type"], "BreadcrumbList")
  assert.deepEqual(schema.itemListElement.map(item => item.item), [
    "https://adakansoftware.com/en",
    "https://adakansoftware.com/en/services",
  ])
})
