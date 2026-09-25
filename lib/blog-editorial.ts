import { getBlogPosts, type BlogPostKey } from "./blog-posts.ts"
import type { Locale } from "./i18n.ts"

type EditorialSource = { name: string; href: string }

const relatedKeys: Record<BlogPostKey, BlogPostKey[]> = {
  "custom-software-guide": ["website-vs-web-app", "corporate-website-cost"],
  "corporate-website-cost": ["website-vs-web-app", "nextjs-seo-performance"],
  "nextjs-seo-performance": ["corporate-website-cost", "custom-software-guide"],
  "website-vs-web-app": ["custom-software-guide", "corporate-website-cost"],
}

const sourceUrls = {
  helpfulContent: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
  crawlableLinks: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
  javascriptSeo: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
  nextMetadata: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata",
  owaspAsvs: "https://owasp.org/projects/asvs",
  mdnPwa: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps",
} as const

const sources: Record<BlogPostKey, Record<Locale, EditorialSource[]>> = {
  "custom-software-guide": {
    tr: [{ name: "OWASP Uygulama Güvenliği Doğrulama Standardı", href: sourceUrls.owaspAsvs }, { name: "MDN: Progressive web uygulamaları", href: sourceUrls.mdnPwa }],
    en: [{ name: "OWASP Application Security Verification Standard", href: sourceUrls.owaspAsvs }, { name: "MDN: Progressive web apps", href: sourceUrls.mdnPwa }],
  },
  "corporate-website-cost": {
    tr: [{ name: "Google: Faydalı ve güvenilir içerik oluşturma", href: sourceUrls.helpfulContent }, { name: "Google: Taranabilir bağlantı uygulamaları", href: sourceUrls.crawlableLinks }],
    en: [{ name: "Google: Creating helpful, reliable content", href: sourceUrls.helpfulContent }, { name: "Google: Crawlable link best practices", href: sourceUrls.crawlableLinks }],
  },
  "nextjs-seo-performance": {
    tr: [{ name: "Next.js: generateMetadata dokümantasyonu", href: sourceUrls.nextMetadata }, { name: "Google: JavaScript SEO temelleri", href: sourceUrls.javascriptSeo }],
    en: [{ name: "Next.js: generateMetadata documentation", href: sourceUrls.nextMetadata }, { name: "Google: JavaScript SEO basics", href: sourceUrls.javascriptSeo }],
  },
  "website-vs-web-app": {
    tr: [{ name: "MDN: Progressive web uygulamaları", href: sourceUrls.mdnPwa }, { name: "OWASP Uygulama Güvenliği Doğrulama Standardı", href: sourceUrls.owaspAsvs }],
    en: [{ name: "MDN: Progressive web apps", href: sourceUrls.mdnPwa }, { name: "OWASP Application Security Verification Standard", href: sourceUrls.owaspAsvs }],
  },
}

export function getBlogEditorial(key: BlogPostKey, locale: Locale) {
  return {
    author: { name: "Adakan Software", href: locale === "tr" ? "/about" : "/en/about" },
    method: locale === "tr"
      ? "Bu rehber, Adakan Software’in yazılım ve web proje teslim yaklaşımı temel alınarak; birincil teknik dokümantasyon kontrol edilip karar noktaları uygulamaya dönük biçimde sadeleştirilerek hazırlanmıştır. İçerik reklam yerleşimi veya sponsor yönlendirmesi içermez."
      : "This guide is based on Adakan Software’s software and web delivery approach. Primary technical documentation was checked and the main decision points were translated into practical guidance. The content contains no paid placement or sponsored recommendation.",
    sources: sources[key][locale],
  }
}

export function getRelatedBlogPosts(key: BlogPostKey, locale: Locale) {
  const related = new Set(relatedKeys[key])
  return getBlogPosts(locale).filter(post => related.has(post.key))
}
