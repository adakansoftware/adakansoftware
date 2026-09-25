import Link from "next/link"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { BlogArticleJsonLd } from "@/components/blog-article-json-ld"
import { CTASection } from "@/components/cta-section"
import type { BlogPost } from "@/lib/blog-posts"
import { getBlogEditorial, getRelatedBlogPosts } from "@/lib/blog-editorial"
import { withLocale, type Locale } from "@/lib/i18n"

export function BlogArticlePage({ locale, post }: { locale: Locale; post: BlogPost }) {
  const editorial = getBlogEditorial(post.key, locale)
  const relatedPosts = getRelatedBlogPosts(post.key, locale)
  const formattedDate = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${post.publishedAt}T00:00:00Z`))

  return (
    <>
      <BlogArticleJsonLd locale={locale} post={post} />
      <article className="studio-container pb-24 pt-24 md:pb-32 md:pt-32">
        <header className="mx-auto max-w-4xl border-b border-border/60 pb-12 md:pb-16">
          <Link className="studio-link" href={withLocale("/blog", locale)}>
            <ArrowLeft size={16} aria-hidden="true" />
            {locale === "tr" ? "Tüm rehberler" : "All guides"}
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl md:text-7xl">{post.title}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{post.excerpt}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{locale === "tr" ? "Hazırlayan" : "Written by"}</span>
            <Link href={editorial.author.href} className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-primary">{editorial.author.name}</Link>
            <span aria-hidden="true">·</span>
            <span>{locale === "tr" ? `Son kontrol: ${formattedDate}` : `Last reviewed: ${formattedDate}`}</span>
          </div>
        </header>

        <div className="mx-auto max-w-3xl pt-12 md:pt-16">
          {post.sections.map((section) => (
            <section key={section.heading} className="mb-14 scroll-mt-28">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{section.heading}</h2>
              <div className="mt-5 space-y-5 text-[1.05rem] leading-8 text-muted-foreground">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-6 grid gap-3 rounded-2xl border border-border/60 bg-card/35 p-5 sm:grid-cols-2 sm:p-6">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="mt-16 border-y border-border/60 py-10">
            <h2 className="text-2xl font-semibold tracking-tight">{locale === "tr" ? "Sık sorulan sorular" : "Frequently asked questions"}</h2>
            <div className="mt-6 divide-y divide-border/60">
              {post.faqs.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold marker:content-none">
                    {item.question}
                    <span className="text-xl font-normal text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="max-w-2xl pt-4 leading-7 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <aside className="mt-10 rounded-3xl border border-border/60 bg-background/45 p-7 md:p-9" aria-labelledby="editorial-basis-title">
            <p id="editorial-basis-title" className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{locale === "tr" ? "İçerik nasıl hazırlandı?" : "How this guide was prepared"}</p>
            <p className="mt-4 leading-7 text-muted-foreground">{editorial.method}</p>
            <h2 className="mt-7 text-lg font-semibold">{locale === "tr" ? "Birincil kaynaklar" : "Primary sources"}</h2>
            <ul className="mt-3 space-y-2">
              {editorial.sources.map(source => <li key={source.href}><a className="studio-link text-sm" href={source.href} target="_blank" rel="noopener noreferrer">{source.name}<ArrowRight size={14} aria-hidden="true" /></a></li>)}
            </ul>
          </aside>

          <section className="mt-10" aria-labelledby="related-guides-title">
            <h2 id="related-guides-title" className="text-2xl font-semibold tracking-tight">{locale === "tr" ? "Konuyu derinleştirin" : "Explore the topic further"}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {relatedPosts.map(related => (
                <Link key={related.key} href={withLocale(`/blog/${related.slug}`, locale)} className="group rounded-2xl border border-border/60 bg-card/30 p-5 transition-colors hover:border-primary/50">
                  <span className="text-xs font-medium tracking-wider text-primary uppercase">{related.category}</span>
                  <h3 className="mt-3 font-semibold leading-6">{related.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{related.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-primary">{locale === "tr" ? "Rehberi okuyun" : "Read the guide"}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </section>

          <aside className="mt-10 rounded-3xl border border-border/60 bg-card/40 p-7 md:p-9">
            <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{locale === "tr" ? "İlgili hizmet" : "Related service"}</p>
            <Link className="studio-link mt-4 text-base" href={withLocale(post.relatedService.href, locale)}>
              {post.relatedService.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </article>
      <CTASection locale={locale} />
    </>
  )
}
