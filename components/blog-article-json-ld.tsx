import type { Locale } from "@/lib/i18n"
import type { BlogPost } from "@/lib/blog-posts"
import { getBlogEditorial } from "@/lib/blog-editorial"
import { serializeJsonLd } from "@/lib/json-ld"
import { siteConfig } from "@/lib/site-config"
import { createArticleSchema, createBreadcrumbSchema, createFaqSchema, createWebPageSchema } from "@/lib/structured-data"

export function BlogArticleJsonLd({ locale, post }: { locale: Locale; post: BlogPost }) {
  const editorial = getBlogEditorial(post.key, locale)
  const path = `/blog/${post.slug}`
  const url = new URL(locale === "tr" ? path : `/en${path}`, siteConfig.url).href
  const imageUrl = new URL("/og", siteConfig.url)
  imageUrl.searchParams.set("page", post.slug)
  imageUrl.searchParams.set("locale", locale)
  const schemas = [
    createWebPageSchema({
      route: { path, metadataKey: "blog" },
      locale,
      url,
      content: post.seo,
      mainEntityId: `${url}#article`,
    }),
    createBreadcrumbSchema({
      locale,
      url,
      pageName: post.title,
      parents: [{ name: locale === "tr" ? "Rehberler" : "Insights", url: new URL(locale === "tr" ? "/blog" : "/en/blog", siteConfig.url).href }],
    }),
    createArticleSchema({
      locale,
      url,
      headline: post.title,
      description: post.seo.description,
      publishedAt: post.publishedAt,
      modifiedAt: post.modifiedAt,
      image: imageUrl.href,
      citations: editorial.sources.map(source => source.href),
    }),
    createFaqSchema({ url, faqs: post.faqs }),
  ]

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }} />
}
