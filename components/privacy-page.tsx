import Link from "next/link"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import type { Locale } from "@/lib/i18n"
import { privacyPageContent, type PrivacyPageCopy } from "@/lib/privacy-content"

export function PrivacyPage({ locale }: { locale: Locale }) {
  const copy: PrivacyPageCopy = privacyPageContent[locale]

  return (
    <>
      <PageJsonLd locale={locale} path="/privacy" />
      <PageHeader locale={locale} {...copy} />
      <article className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-8">
          <p className="text-sm font-medium text-muted-foreground">{copy.effectiveDate}</p>
          {copy.sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`privacy-${section.id}`}
              className="space-y-4 rounded-3xl border border-border/60 bg-card/30 p-6 md:p-8"
            >
              <h2 id={`privacy-${section.id}`} className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-7 text-muted-foreground">
                  {paragraph.includes("kvkk@adakansoftware.com") ? (
                    <>
                      {paragraph.split("kvkk@adakansoftware.com")[0]}
                      <Link className="underline underline-offset-4 hover:text-foreground" href="mailto:kvkk@adakansoftware.com">
                        kvkk@adakansoftware.com
                      </Link>
                      {paragraph.split("kvkk@adakansoftware.com").slice(1).join("kvkk@adakansoftware.com")}
                    </>
                  ) : paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground marker:text-accent">
                  {section.bullets.map((item) => <li key={item} className="pl-1 leading-7">{item}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
      <CTASection locale={locale} />
    </>
  )
}
