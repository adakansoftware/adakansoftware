import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { pricing, PricingSection } from "@/components/pricing-section"
import { isLocale } from "@/lib/i18n"
import { createRouteMetadata } from "@/lib/metadata"

type Props = { params: Promise<{ locale: string; category: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()
  const group = pricing[locale].groups.find(group => group.id === category)
  if (!group) notFound()
  return createRouteMetadata(group.id === "logo" ? "pricingLogo" : group.id === "web" ? "pricingWeb" : "pricingSoftware", locale, `/pricing/${group.id}`)
}

export default async function LocalizedPricingCategoryPage({ params }: Props) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()
  const group = pricing[locale].groups.find(group => group.id === category)
  if (!group) notFound()
  return <><PageJsonLd locale={locale} path={`/pricing/${group.id}`} content={group} faqs={group.faqs} /><PageHeader locale={locale} title={group.title} description={group.description} /><PricingSection locale={locale} category={group.id} /></>
}

export function generateStaticParams() {
  return pricing.en.groups.map(group => ({ category: group.id }))
}
