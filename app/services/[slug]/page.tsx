import { notFound } from "next/navigation"

import { ServiceSeoPage } from "@/components/service-seo-page"
import { createPageMetadata } from "@/lib/metadata"
import { getServicePage, isServicePageSlug, servicePageSlugs } from "@/lib/service-pages"

export const dynamicParams = false

export function generateStaticParams() {
  return servicePageSlugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getServicePage(slug, "tr")
  if (!page) return {}
  return createPageMetadata({ locale: "tr", path: page.path, title: page.seo.title, description: page.seo.description, keywords: page.keywords })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isServicePageSlug(slug)) notFound()
  return <ServiceSeoPage slug={slug} locale="tr" />
}
