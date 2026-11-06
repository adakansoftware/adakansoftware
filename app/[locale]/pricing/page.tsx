import { notFound } from "next/navigation"

import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { PricingSection } from "@/components/pricing-section"
import { isLocale } from "@/lib/i18n"
import { createRouteMetadata } from "@/lib/metadata"
import { getPricingPageContent } from "@/lib/page-content"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return createRouteMetadata("pricing", locale, "/pricing")
}

export default async function LocalizedPricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const header = getPricingPageContent(locale)
  return <><PageJsonLd locale={locale} path="/pricing" /><PageHeader locale={locale} title={header.title} gradientText={header.gradientText} description={header.description} /><PricingSection locale={locale} /></>
}
