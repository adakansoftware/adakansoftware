import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { serializeJsonLd } from "@/lib/json-ld"
import type { Locale } from "@/lib/i18n"
import { withLocale } from "@/lib/i18n"
import type { CaseStudyKey } from "@/lib/case-studies"
import { getCaseStudy, getCaseStudyPaths } from "@/lib/case-studies"
import { siteConfig } from "@/lib/site-config"
import { createBreadcrumbSchema, createCreativeWorkSchema, createFaqSchema, createWebPageSchema } from "@/lib/structured-data"

export function CaseStudyPage({ studyKey, locale }: { studyKey: CaseStudyKey; locale: Locale }) {
  const study = getCaseStudy(studyKey, locale)
  const pathInfo = getCaseStudyPaths().find(item => item.key === studyKey)!
  const path = locale === "tr" ? pathInfo.tr : `/en${pathInfo.en}`
  const url = new URL(path, siteConfig.url).href
  const image = new URL(study.coverImage, siteConfig.url).href
  const projectsUrl = new URL(withLocale("/projects", locale), siteConfig.url).href
  const webPage = createWebPageSchema({ route: { path, metadataKey: "projects" }, locale, url, content: study.seo, mainEntityId: `${url}#project` })
  const schemas = [
    webPage,
    createCreativeWorkSchema({ locale, url, name: study.title, description: study.summary, image, liveUrl: study.liveUrl }),
    createBreadcrumbSchema({ locale, url, pageName: study.title, parents: [{ name: locale === "tr" ? "Projeler" : "Projects", url: projectsUrl }] }),
    createFaqSchema({ url, faqs: study.faqs }),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }} />
      <main>
        <section className="section-shell pb-16 pt-28 md:pb-24 md:pt-36">
          <Link href={withLocale("/projects", locale)} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />{locale === "tr" ? "Tüm projeler" : "All projects"}
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{study.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">{study.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{study.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-card/30 p-6">
              <div><p className="text-xs uppercase tracking-widest text-muted-foreground">{locale === "tr" ? "Sektör" : "Sector"}</p><p className="mt-2 text-sm font-semibold">{study.sector}</p></div>
              <div><p className="text-xs uppercase tracking-widest text-muted-foreground">{locale === "tr" ? "Yıl" : "Year"}</p><p className="mt-2 text-sm font-semibold">{study.year}</p></div>
              <Link href={study.liveUrl} target="_blank" rel="noreferrer" className="col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80">
                {locale === "tr" ? "Canlı siteyi aç" : "Open live website"}<ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell pb-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border/50 bg-card/40">
            <Image src={study.coverImage} alt={`${study.title} ${locale === "tr" ? "ekran görüntüsü" : "screenshot"}`} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
          </div>
        </section>

        <section className="section-shell pb-24 md:pb-32">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {study.deliverables.map(item => <div key={item} className="flex gap-3 rounded-2xl border border-border/50 bg-card/25 p-5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-sm">{item}</span></div>)}
          </div>
          <div className="mx-auto mt-20 max-w-4xl space-y-16">
            {study.sections.map(section => (
              <section key={section.heading}>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{section.heading}</h2>
                <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
                {section.bullets ? <ul className="mt-6 grid gap-3 sm:grid-cols-2">{section.bullets.map(item => <li key={item} className="rounded-xl border border-border/40 bg-background/40 p-4 text-sm">{item}</li>)}</ul> : null}
              </section>
            ))}
            <section>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{locale === "tr" ? "Proje hakkında sık sorulanlar" : "Project frequently asked questions"}</h2>
              <div className="mt-7 divide-y divide-border/60 border-y border-border/60">
                {study.faqs.map(item => <details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none justify-between gap-6 font-semibold">{item.question}<span className="text-xl text-primary transition-transform group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-4 leading-7 text-muted-foreground">{item.answer}</p></details>)}
              </div>
            </section>
          </div>
        </section>
      </main>
      <CTASection locale={locale} />
    </>
  )
}
