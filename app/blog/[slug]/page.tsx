import { notFound } from "next/navigation"

import { BlogArticlePage } from "@/components/blog-article-page"
import { getBlogPostBySlug, getBlogPostPaths, getBlogPosts } from "@/lib/blog-posts"
import { createPageMetadata } from "@/lib/metadata"

export const dynamicParams = false

export function generateStaticParams() {
  return getBlogPosts("tr").map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug, "tr")
  if (!post) return {}
  const paths = getBlogPostPaths().find((item) => item.key === post.key)!
  const localizedPaths = { tr: paths.tr, en: paths.en }
  return createPageMetadata({ locale: "tr", path: paths.tr, localizedPaths, title: post.seo.title, description: post.seo.description, keywords: post.seo.keywords })
}

export default async function BlogPostRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug, "tr")
  if (!post) notFound()
  return <BlogArticlePage locale="tr" post={post} />
}

