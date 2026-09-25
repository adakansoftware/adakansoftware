import assert from "node:assert/strict"
import test from "node:test"

import { createArticleSchema, createBreadcrumbSchema, createCreativeWorkSchema, createFaqSchema, createItemListSchema, createOrganizationSchema, createServiceSchema, createWebPageSchema, createWebsiteSchema } from "./structured-data.ts"

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

test("collection pages connect their WebPage node to the visible item list", () => {
  const url = "https://adakansoftware.com/projects"
  const schema = createWebPageSchema({
    route: { path: "/projects", metadataKey: "projects" },
    locale: "tr",
    url,
    content: { title: "Yazılım Projeleri", description: "Seçili yazılım ve web tasarım projeleri." },
    mainEntityId: `${url}#item-list`,
  })

  assert.deepEqual(schema.mainEntity, { "@id": `${url}#item-list` })
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

test("FAQ schema mirrors visible service questions and answers", () => {
  const faqs = [
    { question: "Proje ne kadar sürer?", answer: "Kapsama göre net bir takvim hazırlanır." },
    { question: "Bakım desteği var mı?", answer: "Yayın sonrası bakım planı sunulur." },
  ]
  const schema = createFaqSchema({ url: "https://adakansoftware.com/services/software-development", faqs })

  assert.equal(schema["@type"], "FAQPage")
  assert.equal(schema["@id"], "https://adakansoftware.com/services/software-development#faq")
  assert.deepEqual(schema.mainEntity.map(item => [item.name, item.acceptedAnswer.text]), faqs.map(item => [item.question, item.answer]))
})

test("item list schema describes visible portfolio entries with absolute assets", () => {
  const schema = createItemListSchema({
    url: "https://adakansoftware.com/demos",
    name: "Canlı Web Sitesi Demoları",
    items: [
      {
        type: "WebSite",
        name: "Adakan Diş Kliniği Demo",
        description: "Modern diş kliniği web sitesi demosu.",
        url: "https://dental-demo-by-adakansoftware.vercel.app/",
        image: "https://adakansoftware.com/demos/adakan-dental-clinic.png",
      },
    ],
  })

  assert.equal(schema["@type"], "ItemList")
  assert.equal(schema["@id"], "https://adakansoftware.com/demos#item-list")
  assert.equal(schema.numberOfItems, 1)
  assert.deepEqual(schema.itemListElement[0], {
    "@type": "ListItem",
    position: 1,
    item: {
      "@type": "WebSite",
      name: "Adakan Diş Kliniği Demo",
      description: "Modern diş kliniği web sitesi demosu.",
      url: "https://dental-demo-by-adakansoftware.vercel.app/",
      image: "https://adakansoftware.com/demos/adakan-dental-clinic.png",
    },
  })
})

test("organization and website schemas establish one consistent Adakan entity", () => {
  const organization = createOrganizationSchema({
    locale: "tr",
    name: "Adakan Software",
    url: "https://adakansoftware.com",
    email: "merhaba@adakan.com.tr",
    logo: "https://adakansoftware.com/adakan-logo.png",
    sameAs: ["https://github.com/adakansoftware"],
  })
  const website = createWebsiteSchema({ name: "Adakan Software", url: "https://adakansoftware.com" })

  assert.equal(organization["@id"], "https://adakansoftware.com/#organization")
  assert.deepEqual(organization.alternateName, ["Adakan", "Adakan Yazılım"])
  assert.deepEqual(organization.address, {
    "@type": "PostalAddress",
    addressLocality: "İstanbul",
    addressCountry: "TR",
  })
  assert.equal(organization.contactPoint.url, "https://adakansoftware.com/contact")
  assert.equal(organization.logo, "https://adakansoftware.com/adakan-logo.png")
  assert.equal(website.publisher["@id"], organization["@id"])
  assert.deepEqual(website.inLanguage, ["tr-TR", "en-US"])
})

test("article schema identifies the visible guide and Adakan Software publisher", () => {
  const url = "https://adakansoftware.com/blog/ozel-yazilim-gelistirme-rehberi"
  const schema = createArticleSchema({
    locale: "tr",
    url,
    headline: "Özel yazılım geliştirme: ihtiyaçtan çalışan ürüne",
    description: "Özel yazılım için kapsamlı karar rehberi.",
    publishedAt: "2026-09-25",
    modifiedAt: "2026-09-25",
    image: "https://adakansoftware.com/og?page=ozel-yazilim-gelistirme-rehberi&locale=tr",
  })

  assert.equal(schema["@type"], "BlogPosting")
  assert.equal(schema["@id"], `${url}#article`)
  assert.deepEqual(schema.mainEntityOfPage, { "@id": `${url}#webpage` })
  assert.equal(schema.inLanguage, "tr-TR")
  assert.equal(schema.datePublished, "2026-09-25")
  assert.equal(schema.dateModified, "2026-09-25")
  assert.equal(schema.author["@id"], "https://adakansoftware.com/#organization")
  assert.equal(schema.publisher["@id"], "https://adakansoftware.com/#organization")
  assert.equal(schema.image, "https://adakansoftware.com/og?page=ozel-yazilim-gelistirme-rehberi&locale=tr")
})

test("creative work schema connects a case study to the visible project and creator", () => {
  const url = "https://adakansoftware.com/projects/z-grup-insaat"
  const schema = createCreativeWorkSchema({
    locale: "tr",
    url,
    name: "Z Grup İnşaat web sitesi",
    description: "Hafriyat hizmetleri için kurumsal web sitesi çalışması.",
    image: "https://adakansoftware.com/projects/z-grup-insaat-cover.png",
    liveUrl: "https://zgrupinsaat.vercel.app/",
  })

  assert.equal(schema["@type"], "CreativeWork")
  assert.equal(schema["@id"], `${url}#project`)
  assert.equal(schema.creator["@id"], "https://adakansoftware.com/#organization")
  assert.equal(schema.mainEntityOfPage["@id"], `${url}#webpage`)
  assert.equal(schema.sameAs, "https://zgrupinsaat.vercel.app/")
})
