import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { pricing, PricingSection } from "@/components/pricing-section"
import { isLocale } from "@/lib/i18n"
import { createPageMetadata } from "@/lib/metadata"

type Props = { params: Promise<{ locale: string; category: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()
  const group = pricing[locale].groups.find(group => group.id === category)
  if (!group) notFound()
  return createPageMetadata({ locale, title: `${group.title} — ${locale === "tr" ? "Paketler ve Fiyatlar" : "Packages and Pricing"}`, description: group.description, path: `/pricing/${group.id}` })
}

export default async function LocalizedPricingCategoryPage({ params }: Props) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()
  const group = pricing[locale].groups.find(group => group.id === category)
  if (!group) notFound()
  return <><PageJsonLd locale={locale} path={`/pricing/${group.id}`} content={group} faqs={group.faqs} /><PageHeader locale={locale} title={group.title} description={group.description} /><PricingSection locale={locale} category={group.id} /></>
}
