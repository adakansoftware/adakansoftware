import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { createMailtoHref } from "@/lib/contact-links"
import type { Locale } from "@/lib/i18n"
import { careersPageContent, blogPageContent, legalPageContent } from "@/lib/static-page-content"
import { siteConfig } from "@/lib/site-config"
import { getBlogPosts } from "@/lib/blog-posts"
import { withLocale } from "@/lib/i18n"

export function BlogPageContent({ locale }: { locale: Locale }) {
  const copy = blogPageContent[locale]
  const posts = getBlogPosts(locale)

  return (
    <>
      <PageJsonLd
        locale={locale}
        path="/blog"
        items={posts.map((post) => ({
          type: "BlogPosting",
          name: post.title,
          description: post.excerpt,
          url: withLocale(`/blog/${post.slug}`, locale),
        }))}
      />
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.key} className="rounded-3xl border border-border/60 bg-card/40 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.05)] md:p-9">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                <span>{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">{post.title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{post.excerpt}</p>
              <Link className="studio-link mt-7" href={withLocale(`/blog/${post.slug}`, locale)}>
                {locale === "tr" ? "Rehberi okuyun" : "Read the guide"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}

export function CareersPageContent({ locale }: { locale: Locale }) {
  const copy = careersPageContent[locale]
  const values =
    locale === "tr"
      ? [
          {
            icon: "⚡",
            title: "Hız değil, doğruluk",
            body: "Hızlı üretmekten çok doğru üretmeyi önemseriz. Kaliteyi fırsata feda etmeyiz.",
          },
          {
            icon: "🎯",
            title: "Odak",
            body: "Az müşteri, derin iş. Aynı anda çok şey değil, biri için en iyisini yapıyoruz.",
          },
          {
            icon: "🧩",
            title: "Tasarım + Kod",
            body: "İkisi ayrı değil bizim için. Tasarımcılar kod okur, geliştiriciler tasarımı sorgular.",
          },
        ]
      : [
          {
            icon: "⚡",
            title: "Right, not fast",
            body: "We care more about doing it correctly than quickly. Quality is not traded for speed.",
          },
          {
            icon: "🎯",
            title: "Focus",
            body: "Few clients, deep work. We do one thing at its best rather than many things at once.",
          },
          {
            icon: "🧩",
            title: "Design + Code",
            body: "Not separate disciplines here. Designers read code, developers question design decisions.",
          },
        ]
  const subject = locale === "tr" ? "Portfolyo başvurusu" : "Portfolio application"

  return (
    <>
      <PageJsonLd locale={locale} path="/careers" />
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-md">
                <span className="text-3xl" aria-hidden="true">
                  {item.icon}
                </span>
                <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
            <h2 className="text-2xl font-bold">{locale === "tr" ? "Şu an aktif ilan yok" : "No active listings right now"}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {locale === "tr"
                ? "Fakat güçlü bir portfolyoyla ulaşabilirsin. Tasarım, frontend ve marka stratejisi alanlarındaki çalışmaları her zaman görmek isteriz. Başvurular değerlendirilir, sana dönüş yaparız."
                : "But you can always reach out with a strong portfolio. We are always happy to see work in design, frontend, and brand strategy. Applications are reviewed and we follow up."}
            </p>
            <a
              href={createMailtoHref(siteConfig.email, subject)}
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {locale === "tr" ? "Portfolyonu gönder" : "Send your portfolio"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </a>
          </div>
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}

export function LegalPageContent({
  locale,
  type,
}: {
  locale: Locale
  type: "privacy" | "terms"
}) {
  const copy = legalPageContent[type][locale]

  return (
    <>
      <PageJsonLd locale={locale} path={`/${type}`} />
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-6 text-muted-foreground">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}
