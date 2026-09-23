type PublicRouteLike = {
  path: string
  metadataKey: string
}

type StructuredDataLocale = "tr" | "en"

type PageContent = {
  title: string
  description: string
}

export function createWebPageSchema({
  route: _route,
  locale,
  url,
  content,
}: {
  route: PublicRouteLike
  locale: StructuredDataLocale
  url: string
  content: PageContent
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
  }
}

export function createServiceSchema({ locale, url }: { locale: StructuredDataLocale; url: string }) {
  const serviceTypes = locale === "tr"
    ? ["Özel Yazılım Geliştirme", "Web Tasarımı ve Geliştirme", "Next.js Frontend Geliştirme", "UI/UX Tasarımı", "Marka Kimliği ve Logo Tasarımı"]
    : ["Custom Software Development", "Web Design and Development", "Next.js Frontend Development", "UI/UX Design", "Brand Identity and Logo Design"]

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: locale === "tr" ? "Yazılım Geliştirme, Web Tasarımı ve Dijital Ürün Hizmetleri" : "Software Development, Web Design and Digital Product Services",
    description: locale === "tr"
      ? "İşletmeler için özel yazılım, kurumsal web sitesi, Next.js frontend, UI/UX ve marka kimliği hizmetleri."
      : "Custom software, corporate websites, Next.js frontend, UI/UX and brand identity services for businesses.",
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
}: {
  locale: StructuredDataLocale
  url: string
  pageName: string
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
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: url,
      },
    ],
  }
}
