type PublicRouteLike = {
  path: string
  metadataKey: string
}

type StructuredDataLocale = "tr" | "en"

type PageContent = {
  title: string
  description: string
}

type FaqItem = { question: string; answer: string }

export type StructuredDataItem = {
  type: "BlogPosting" | "CreativeWork" | "ImageObject" | "SoftwareApplication" | "WebSite"
  name: string
  description: string
  url?: string
  image?: string
}

export function createOrganizationSchema({
  locale,
  name,
  url,
  email,
  logo,
  sameAs,
}: {
  locale: StructuredDataLocale
  name: string
  url: string
  email: string
  logo: string
  sameAs: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name,
    alternateName: ["Adakan", "Adakan Yazılım"],
    url,
    email,
    logo,
    image: `${url}/og`,
    description: locale === "tr"
      ? "İşletmeler için özel yazılım, web uygulaması, kurumsal web sitesi, Next.js, UI/UX ve marka kimliği hizmetleri sunan İstanbul merkezli yazılım şirketi."
      : "An Istanbul software company delivering custom software, web applications, corporate websites, Next.js, UI/UX and brand identity services.",
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "tr" ? "İstanbul" : "Istanbul",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email,
      url: `${url}/contact`,
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    knowsAbout: [
      "Custom Software Development",
      "Web Application Development",
      "Corporate Web Design",
      "Next.js Development",
      "Frontend Development",
      "UI/UX Design",
      "Logo Design",
      "Brand Identity",
    ],
    sameAs,
  }
}

export function createWebsiteSchema({ name, url }: { name: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name,
    alternateName: "Adakan",
    publisher: { "@id": `${url}/#organization` },
    inLanguage: ["tr-TR", "en-US"],
  }
}

export function createArticleSchema({
  locale,
  url,
  headline,
  description,
  publishedAt,
  modifiedAt,
  image,
}: {
  locale: StructuredDataLocale
  url: string
  headline: string
  description: string
  publishedAt: string
  modifiedAt: string
  image: string
}) {
  const origin = new URL(url).origin

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline,
    description,
    image,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": `${origin}/#website` },
    author: { "@id": `${origin}/#organization` },
    publisher: { "@id": `${origin}/#organization` },
  }
}

export function createWebPageSchema({
  route: _route,
  locale,
  url,
  content,
  mainEntityId,
}: {
  route: PublicRouteLike
  locale: StructuredDataLocale
  url: string
  content: PageContent
  mainEntityId?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: content.title,
    description: content.description,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    isPartOf: { "@id": `${new URL(url).origin}/#website` },
    about: { "@id": `${new URL(url).origin}/#organization` },
    ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
  }
}

export function createServiceSchema({ locale, url, name, description, serviceTypes: providedServiceTypes }: { locale: StructuredDataLocale; url: string; name?: string; description?: string; serviceTypes?: string[] }) {
  const serviceTypes = providedServiceTypes ?? (locale === "tr"
    ? ["Özel Yazılım Geliştirme", "Web Tasarımı ve Geliştirme", "Next.js Frontend Geliştirme", "UI/UX Tasarımı", "Marka Kimliği ve Logo Tasarımı"]
    : ["Custom Software Development", "Web Design and Development", "Next.js Frontend Development", "UI/UX Design", "Brand Identity and Logo Design"])

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: name ?? (locale === "tr" ? "Yazılım Geliştirme, Web Tasarımı ve Dijital Ürün Hizmetleri" : "Software Development, Web Design and Digital Product Services"),
    description: description ?? (locale === "tr"
      ? "İşletmeler için özel yazılım, kurumsal web sitesi, Next.js frontend, UI/UX ve marka kimliği hizmetleri."
      : "Custom software, corporate websites, Next.js frontend, UI/UX and brand identity services for businesses."),
    serviceType: serviceTypes,
    provider: { "@id": `${new URL(url).origin}/#organization` },
    areaServed: ["TR", "GB", "US", "DE"],
    url,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
  }
}

export function createBreadcrumbSchema({
  locale,
  url,
  pageName,
  parents = [],
}: {
  locale: StructuredDataLocale
  url: string
  pageName: string
  parents?: Array<{ name: string; url: string }>
}) {
  const origin = new URL(url).origin
  const homeUrl = locale === "tr" ? `${origin}/` : `${origin}/en`

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "tr" ? "Ana Sayfa" : "Home",
        item: homeUrl,
      },
      ...parents.map((parent, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: parent.name,
        item: parent.url,
      })),
      {
        "@type": "ListItem",
        position: parents.length + 2,
        name: pageName,
        item: url,
      },
    ],
  }
}

export function createFaqSchema({ url, faqs }: { url: string; faqs: FaqItem[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function createItemListSchema({
  url,
  name,
  items,
}: {
  url: string
  name: string
  items: StructuredDataItem[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#item-list`,
    url,
    name,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": item.type,
        name: item.name,
        description: item.description,
        ...(item.url ? { url: item.url } : {}),
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  }
}
