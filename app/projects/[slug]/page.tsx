import { notFound } from "next/navigation"
import { CaseStudyPage } from "@/components/case-study-page"
import { caseStudyKeys, getCaseStudy, getCaseStudyBySlug, getCaseStudyPaths } from "@/lib/case-studies"
import { createPageMetadata } from "@/lib/metadata"

export const dynamicParams = false
export function generateStaticParams() { return caseStudyKeys.map(key => ({ slug: getCaseStudy(key, "tr").slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const study = getCaseStudyBySlug(slug, "tr"); if (!study) return {}; const paths = getCaseStudyPaths().find(item => item.key === study.key)!; return createPageMetadata({ locale: "tr", path: paths.tr, localizedPaths: { tr: paths.tr, en: paths.en }, title: study.seo.title, description: study.seo.description, keywords: study.seo.keywords }) }
export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const study = getCaseStudyBySlug(slug, "tr"); if (!study) notFound(); return <CaseStudyPage studyKey={study.key} locale="tr" /> }
