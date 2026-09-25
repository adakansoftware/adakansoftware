import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"
import { serializeJsonLd } from "@/lib/json-ld"
import { createOrganizationSchema, createWebsiteSchema } from "@/lib/structured-data"
import { NonceScript } from "@/components/nonce-script"

export function JsonLd({ locale }: { locale: Locale }) {
  const organization = createOrganizationSchema({
    locale,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: `${siteConfig.url}/adakan-logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/adakan-software/",
      "https://x.com/adakansoftware",
      "https://github.com/adakansoftware",
      "https://www.instagram.com/adakansoftware",
    ],
  })

  const website = createWebsiteSchema({ name: siteConfig.name, url: siteConfig.url })

  return (
    <>
      <NonceScript type="application/ld+json" content={serializeJsonLd(organization)} />
      <NonceScript type="application/ld+json" content={serializeJsonLd(website)} />
    </>
  )
}
