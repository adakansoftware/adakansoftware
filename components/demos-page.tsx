import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { withLocale, type Locale } from "@/lib/i18n"
import { getDemoExamples } from "@/lib/site-data"

export function DemosPageContent({ locale }: { locale: Locale }) {
  const demos = getDemoExamples(locale)

  return (
    <div>
      <PageJsonLd
        locale={locale}
        path="/demos"
        items={demos.map((demo) => ({
          type: demo.href.includes("tableflow") ? "SoftwareApplication" : "WebSite",
          name: demo.title,
          description: demo.description,
          url: demo.href,
          image: demo.coverImage,
        }))}
      />
      <PageHeader
        locale={locale}
        title={locale === "tr" ? "Canlı demoları" : "Explore live"}
        gradientText={locale === "tr" ? "yakından inceleyin" : "website demos"}
        description={locale === "tr"
          ? "Farklı sektörler için tasarladığımız gerçek, çalışan web deneyimlerini yeni sekmede açıp inceleyin."
          : "Open and explore working web experiences designed for businesses across different industries."}
        primaryHref={withLocale("/contact", locale)}
        primaryLabel={locale === "tr" ? "Benzer proje başlat" : "Start a similar project"}
        secondaryHref={withLocale("/projects", locale)}
        secondaryLabel={locale === "tr" ? "Projeleri görüntüle" : "View projects"}
      />

      <section className="pb-28 md:pb-36">
        <div className="section-shell grid gap-8 md:grid-cols-2">
          {demos.map((demo, index) => (
            <article key={demo.href} className="group overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-[0_18px_70px_rgba(0,0,0,0.07)]">
              <Link href={demo.href} target="_blank" rel="noreferrer" className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                  {demo.coverImage ? (
                    <Image
                      src={demo.coverImage}
                      alt={`${demo.title} ${locale === "tr" ? "demo ekran görüntüsü" : "demo screenshot"}`}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                  ) : null}
                  <span className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {locale === "tr" ? "Canlı demo" : "Live demo"}
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">{demo.category}</p>
                  <div className="mt-3 flex items-start justify-between gap-5">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{demo.title}</h2>
                      <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{demo.description}</p>
                    </div>
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CTASection locale={locale} />
    </div>
  )
}
