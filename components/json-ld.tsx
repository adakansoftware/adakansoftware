import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"
import { serializeJsonLd } from "@/lib/json-ld"

export function JsonLd({ locale }: { locale: Locale }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: `${siteConfig.url}/adakan-logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    image: `${siteConfig.url}/og`,
    description:
      locale === "tr"
        ? "Büyümek isteyen markalar için stratejik web siteleri, marka kimlikleri ve dijital ürün arayüzleri üreten tasarım ve yazılım stüdyosu."
        : "A design and software studio creating strategic websites, brand identities, and digital product interfaces for growing brands.",
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
    sameAs: [
      "https://www.linkedin.com/company/adakan-software/",
      "https://twitter.com/adakansoftware",
      "https://github.com/adakansoftware",
      "https://www.instagram.com/adakansoftware",
    ],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: ["tr-TR", "en-US"],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(website) }} />
    </>
  )
}
