import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import { serializeJsonLd } from "@/lib/json-ld"
import type { Locale } from "@/lib/i18n"
import { withLocale } from "@/lib/i18n"
import { getLocalSoftwarePage } from "@/lib/local-service-page"
import { siteConfig } from "@/lib/site-config"
import { createBreadcrumbSchema, createFaqSchema, createServiceSchema, createWebPageSchema } from "@/lib/structured-data"
import { NonceScript } from "@/components/nonce-script"

export function LocalSoftwarePage({ locale }: { locale: Locale }) {
  const page = getLocalSoftwarePage(locale)
  const routePath = "/istanbul-yazilim-sirketi"
  const canonicalPath = locale === "tr" ? page.path : `/en${page.path}`
  const url = new URL(canonicalPath, siteConfig.url).href
  const service = createServiceSchema({ locale, url, name: page.seo.title, description: page.seo.description, serviceTypes: page.services.map(item => item.title) })
  const schemas = [
    createWebPageSchema({ route: { path: routePath, metadataKey: "istanbulSoftwareCompany" }, locale, url, content: page.seo, mainEntityId: service["@id"] }),
    service,
    createBreadcrumbSchema({ locale, url, pageName: page.seo.title }),
    createFaqSchema({ url, faqs: page.faqs }),
  ]

  return (
    <>
      <NonceScript type="application/ld+json" content={serializeJsonLd(schemas)} />
      <PageHeader locale={locale} title={page.title} gradientText={page.accent} description={page.description} primaryHref={withLocale("/contact", locale)} primaryLabel={locale === "tr" ? "Projeyi konuşalım" : "Discuss your project"} secondaryHref={withLocale("/projects", locale)} secondaryLabel={locale === "tr" ? "Proje örnekleri" : "Project examples"} />
      <section className="section-shell pb-24 md:pb-32">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {page.services.map(serviceItem => <Link key={serviceItem.href} href={withLocale(serviceItem.href, locale)} className="group rounded-2xl border border-border/50 bg-card/25 p-6 transition-colors hover:border-primary/50"><h2 className="text-xl font-bold">{serviceItem.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{serviceItem.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-primary">{locale === "tr" ? "Hizmeti incele" : "Explore service"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}
        </div>
        <div className="mx-auto mt-20 max-w-4xl space-y-16">
          {page.sections.map(section => <section key={section.heading}><h2 className="text-3xl font-bold tracking-tight md:text-4xl">{section.heading}</h2><div className="mt-6 space-y-5 leading-8 text-muted-foreground">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>{section.bullets ? <ul className="mt-6 grid gap-3 sm:grid-cols-2">{section.bullets.map(item => <li key={item} className="flex gap-3 rounded-xl border border-border/40 bg-background/45 p-4 text-sm"><Check className="h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul> : null}</section>)}
        </div>
        <section className="mt-20 rounded-3xl border border-border/50 bg-card/25 p-6 md:p-10"><h2 className="text-3xl font-bold">{locale === "tr" ? "Proje süreci" : "Project process"}</h2><div className="mt-7 grid gap-4 md:grid-cols-4">{page.process.map((step, index) => <div key={step.title} className="rounded-xl border border-border/40 bg-background/45 p-5"><span className="font-mono text-xs text-primary">0{index + 1}</span><h3 className="mt-3 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p></div>)}</div></section>
        <section className="mx-auto mt-20 max-w-4xl"><h2 className="text-3xl font-bold tracking-tight md:text-4xl">{locale === "tr" ? "İstanbul yazılım hizmetleri hakkında" : "About software services in Istanbul"}</h2><div className="mt-7 divide-y divide-border/60 border-y border-border/60">{page.faqs.map(item => <details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none justify-between gap-6 font-semibold">{item.question}<span className="text-xl text-primary transition-transform group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-4 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div><nav aria-label={locale === "tr" ? "İlgili sayfalar" : "Related pages"} className="mt-8 flex flex-wrap gap-3">{page.relatedLinks.map(item => <Link key={item.href} href={withLocale(item.href, locale)} className="rounded-full border border-border/60 px-5 py-2.5 text-sm transition-colors hover:border-primary/50">{item.label}</Link>)}</nav></section>
      </section>
      <CTASection locale={locale} />
    </>
  )
}
