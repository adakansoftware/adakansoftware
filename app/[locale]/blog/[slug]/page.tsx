import { notFound } from "next/navigation"

import { BlogArticlePage } from "@/components/blog-article-page"
import { getBlogPostBySlug, getBlogPostPaths, getBlogPosts } from "@/lib/blog-posts"
import { createPageMetadata } from "@/lib/metadata"
import { getPrefixedRouteLocale } from "@/lib/route-locale"

export const dynamicParams = false

export function generateStaticParams() {
  return getBlogPosts("en").map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await params
  const locale = await getPrefixedRouteLocale(resolved)
  const post = getBlogPostBySlug(resolved.slug, locale)
  if (!post) return {}
  const paths = getBlogPostPaths().find((item) => item.key === post.key)!
  const localizedPaths = { tr: paths.tr, en: paths.en }
  return createPageMetadata({ locale, path: localizedPaths[locale], localizedPaths, title: post.seo.title, description: post.seo.description, keywords: post.seo.keywords, article: { publishedTime: post.publishedAt, modifiedTime: post.modifiedAt, authors: ["Adakan Software"] } })
}

export default async function LocalizedBlogPostRoute({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await params
  const locale = await getPrefixedRouteLocale(resolved)
  const post = getBlogPostBySlug(resolved.slug, locale)
  if (!post) notFound()
  return <BlogArticlePage locale={locale} post={post} />
}
