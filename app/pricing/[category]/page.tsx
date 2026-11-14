import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { pricing, PricingSection } from "@/components/pricing-section"
import { createPageMetadata } from "@/lib/metadata"

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  const group = pricing.tr.groups.find(group => group.id === category)
  if (!group) notFound()
  return createPageMetadata({ locale: "tr", title: `${group.title} — Paketler ve Fiyatlar`, description: group.description, path: `/pricing/${group.id}` })
}

export default async function PricingCategoryPage({ params }: Props) {
  const { category } = await params
  const group = pricing.tr.groups.find(group => group.id === category)
  if (!group) notFound()
  return <><PageJsonLd locale="tr" path={`/pricing/${group.id}`} content={group} faqs={group.faqs} /><PageHeader locale="tr" title={group.title} description={group.description} /><PricingSection locale="tr" category={group.id} /></>
}
