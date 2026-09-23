import type { Locale } from "@/lib/i18n"

export const siteConfig = {
  name: "Adakan Software",
  url: "https://adakansoftware.com",
  email: "merhaba@adakan.com.tr",
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
    title: "Adakan Software | Yazılım Şirketi ve Web Tasarım Ajansı",
    description:
      "Adakan Software; özel yazılım, kurumsal web sitesi, Next.js, UI/UX, logo ve marka kimliği hizmetleri sunan İstanbul merkezli yazılım şirketidir.",
    keywords: [
      "Adakan Software",
      "yazılım şirketi",
      "yazılım firması",
      "özel yazılım geliştirme",
      "premium web tasarımı",
      "logo tasarımı",
      "marka kimliği",
      "web tasarım ajansı",
      "Next.js web sitesi",
      "UI UX tasarımı",
    ],
    openGraphDescription:
      "Özel yazılım, web tasarımı, Next.js geliştirme, UI/UX ve marka kimliği hizmetleri.",
    twitterDescription:
      "Yazılım geliştirme, kurumsal web tasarımı ve dijital ürün çözümleri.",
  },
  en: {
    title: "Adakan Software | Software Development and Web Design",
    description:
      "Adakan Software is an Istanbul software company delivering custom software, corporate websites, Next.js, UI/UX and brand identity services.",
    keywords: [
      "Adakan Software",
      "software development company",
      "custom software development",
      "premium web design",
      "logo design",
      "brand identity",
      "web design agency",
      "Next.js website",
      "UI UX design",
    ],
    openGraphDescription:
      "Premium web design, brand identity, and conversion-focused digital product experiences.",
    twitterDescription:
      "Futuristic web design, brand identity, and digital product interfaces.",
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
