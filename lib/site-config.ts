import { routeMetadataContent } from "./route-metadata-content"
import type { Locale } from "@/lib/i18n"

export const siteConfig = {
  name: "Adakan Software",
  url: "https://adakansoftware.com",
  email: "info@adakansoftware.com",
  location: {
    tr: "İstanbul, Türkiye",
    en: "Istanbul, Turkey",
  },
  defaultOgImage: "/og",
} as const satisfies {
  name: string
  url: string
  email: string
  location: Record<Locale, string>
  defaultOgImage: string
}

export const rootMetadataCopy = {
  tr: {
    title: `Adakan Software | ${routeMetadataContent.home.tr.title}`,
    description:
      routeMetadataContent.home.tr.description,
    keywords: [
      "Adakan Software",
      "yazılım şirketi",
      "yazılım firması",
      "özel yazılım geliştirme",
      "premium web tasarımı",
      "logo tasarımı",
      "vektörel logo",
      "web tasarım ajansı",
      "Next.js web sitesi",
      "UI UX tasarımı",
    ],
    openGraphDescription:
      routeMetadataContent.home.tr.description,
    twitterDescription:
      routeMetadataContent.home.tr.description,
  },
  en: {
    title: `Adakan Software | ${routeMetadataContent.home.en.title}`,
    description:
      routeMetadataContent.home.en.description,
    keywords: [
      "Adakan Software",
      "software development company",
      "custom software development",
      "premium web design",
      "logo design",
      "vector logo",
      "web design agency",
      "Next.js website",
      "UI UX design",
    ],
    openGraphDescription:
      routeMetadataContent.home.en.description,
    twitterDescription:
      routeMetadataContent.home.en.description,
  },
} satisfies Record<
  Locale,
  {
    title: string
    description: string
    keywords: string[]
    openGraphDescription: string
    twitterDescription: string
  }
>
