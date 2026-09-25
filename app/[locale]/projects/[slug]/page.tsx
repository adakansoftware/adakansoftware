import { notFound } from "next/navigation"
import { CaseStudyPage } from "@/components/case-study-page"
import { caseStudyKeys, getCaseStudy, getCaseStudyBySlug, getCaseStudyPaths } from "@/lib/case-studies"
import { createPageMetadata } from "@/lib/metadata"
import { getPrefixedRouteLocale } from "@/lib/route-locale"

export const dynamicParams = false
export function generateStaticParams() { return caseStudyKeys.map(key => ({ slug: getCaseStudy(key, "en").slug })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) { const resolved = await params; const locale = await getPrefixedRouteLocale(resolved); const study = getCaseStudyBySlug(resolved.slug, locale); if (!study) return {}; const paths = getCaseStudyPaths().find(item => item.key === study.key)!; return createPageMetadata({ locale, path: paths.tr, localizedPaths: { tr: paths.tr, en: paths.en }, title: study.seo.title, description: study.seo.description, keywords: study.seo.keywords }) }
export default async function LocalizedProjectCaseStudy({ params }: { params: Promise<{ locale: string; slug: string }> }) { const resolved = await params; const locale = await getPrefixedRouteLocale(resolved); const study = getCaseStudyBySlug(resolved.slug, locale); if (!study) notFound(); return <CaseStudyPage studyKey={study.key} locale={locale} /> }
