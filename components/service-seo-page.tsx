import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { withLocale, type Locale } from "@/lib/i18n"
import type { ServicePageSlug } from "@/lib/service-pages"
import { getServicePage } from "@/lib/service-pages"

export function ServiceSeoPage({ slug, locale }: { slug: ServicePageSlug; locale: Locale }) {
  const page = getServicePage(slug, locale)!

  return (
    <>
      <PageJsonLd locale={locale} path={page.path} content={page.seo} serviceTypes={page.keywords} faqs={page.faqs} />
      <PageHeader
        locale={locale}
        title={page.title}
        gradientText={page.accent}
        description={page.description}
        primaryHref={withLocale("/contact", locale)}
        primaryLabel={locale === "tr" ? "Projeyi konuşalım" : "Discuss your project"}
        secondaryHref={withLocale("/projects", locale)}
        secondaryLabel={locale === "tr" ? "Projeleri incele" : "Explore projects"}
      />
      <section className="section-shell pb-24 md:pb-32">
        <div className="section-frame grid gap-10 px-6 py-10 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-14">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{page.overviewTitle}</h2>
            <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">{page.overview}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-background/55 p-6">
            <h2 className="text-xl font-bold">{page.capabilitiesTitle}</h2>
            <ul className="mt-5 space-y-4">
              {page.capabilities.map(item => <li key={item} className="flex gap-3 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-border/50 bg-card/25 p-6 md:p-10">
          <h2 className="text-2xl font-bold">{page.deliverablesTitle}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.deliverables.map((item, index) => <div key={item} className="rounded-xl border border-border/40 bg-background/45 p-5"><span className="font-mono text-xs text-primary">0{index + 1}</span><p className="mt-3 text-sm leading-6">{item}</p></div>)}
          </div>
          <Link className="studio-link mt-8" href={withLocale("/services", locale)}>{locale === "tr" ? "Tüm hizmetleri görün" : "View all services"}<ArrowRight size={16} /></Link>
        </div>
        <div className="mt-16 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{page.faqTitle}</h2>
          <div className="mt-7 divide-y divide-border/60 border-y border-border/60">
            {page.faqs.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold marker:content-none">
                  {item.question}
                  <span className="text-xl font-normal text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-3xl pt-4 leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}
