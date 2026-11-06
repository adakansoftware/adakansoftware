import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

export const blogPageContent = {
  tr: {
    title: "Yazılımı daha doğru",
    gradientText: "planlamak için rehberler",
    description: "Özel yazılım, web uygulamaları, kurumsal web siteleri, Next.js, SEO ve performans kararlarını açık biçimde anlatan uygulamalı rehberler.",
    secondaryHref: "/services",
    secondaryLabel: "Hizmetleri Gör",
  },
  en: {
    title: "Practical guides for",
    gradientText: "better software decisions",
    description: "Clear guides to custom software, web applications, corporate websites, Next.js, SEO and performance decisions.",
    primaryHref: "/en/contact",
    primaryLabel: "Contact Us",
    secondaryHref: "/en/services",
    secondaryLabel: "View Services",
  },
} as const satisfies Record<
  Locale,
  {
    title: string
    gradientText: string
    description: string
    primaryHref?: string
    primaryLabel?: string
    secondaryHref: string
    secondaryLabel: string
  }
>

export const careersPageContent = {
  tr: {
    title: "İyi iş üretmeyi seven",
    gradientText: "insanlarla çalışırız",
    description:
      "Şu an aktif ilan paylaşmıyoruz; fakat tasarım, frontend ve marka stratejisi alanlarında güçlü portfolyoları her zaman görmek isteriz.",
    primaryHref: `mailto:${siteConfig.email}`,
    primaryLabel: "Portfolyo Gönder",
    secondaryHref: "/about",
    secondaryLabel: "Bizi Tanı",
    sectionTitle: "Portfolyo paylaşımı",
    sectionDescription:
      "Kısa bir tanıtım, seçilmiş işleriniz ve hangi rolde değer katmak istediğiniz yeterli.",
    steps: [
      {
        title: "Gönder",
        description: "Kısa bir tanıtım ve seçilmiş işler yeterli. CV şart değil; işin kendisi konuşur.",
      },
      {
        title: "İnceleme",
        description: "Başvuruları bir hafta içinde gözden geçirir, sonuçtan bağımsız yanıt veririz.",
      },
      {
        title: "Konuşma",
        description: "Uzun mülakat listeleri yok. İşler, beklentiler ve çalışma şekli üzerinden sohbet ederiz.",
      },
      {
        title: "Deneme işi",
        description: "Küçük ücretli bir işle başlarız. İki taraf da uygunsa yoluna devam ederiz.",
      },
    ],
  },
  en: {
    title: "We work with people",
    gradientText: "who care about craft",
    description:
      "We are not sharing active openings right now, but we are always happy to see strong portfolios in design, frontend, and brand strategy.",
    primaryHref: `mailto:${siteConfig.email}`,
    primaryLabel: "Send Portfolio",
    secondaryHref: "/en/about",
    secondaryLabel: "Meet Us",
    sectionTitle: "Portfolio submissions",
    sectionDescription:
      "A short introduction, selected work, and the role where you want to contribute are enough.",
    steps: [
      {
        title: "Send",
        description: "A short introduction and selected work are enough. No CV required; the work speaks for itself.",
      },
      {
        title: "Review",
        description: "We review submissions within a week and reply either way.",
      },
      {
        title: "Conversation",
        description: "No long interview loops. We talk through your work, expectations, and how we work.",
      },
      {
        title: "Trial project",
        description: "We start with a small paid project. If it works for both sides, we continue.",
      },
    ],
  },
} as const satisfies Record<
  Locale,
  {
    title: string
    gradientText: string
    description: string
    primaryHref: string
    primaryLabel: string
    secondaryHref: string
    secondaryLabel: string
    sectionTitle: string
    sectionDescription: string
    steps: Array<{ title: string; description: string }>
  }
>

export const legalPageContent = {
  privacy: {
    tr: {
      title: "Veri kullanımında",
      gradientText: "şeffaf yaklaşım",
      description: "Bu sayfa, web sitesi üzerinden paylaşılan iletişim bilgilerinin nasıl ele alındığını özetler.",
      primaryHref: "/contact",
      primaryLabel: "İletişime Geç",
      paragraphs: [
        "İletişim amacıyla paylaştığınız bilgiler yalnızca talebinize yanıt vermek ve proje görüşmesini yürütmek için kullanılır.",
        "Bilgileriniz üçüncü taraflarla satış veya reklam amacıyla paylaşılmaz. Resmi yükümlülükler dışında kişisel verileriniz korunur.",
        `Herhangi bir silme veya güncelleme talebi için ${siteConfig.email} adresinden iletişime geçebilirsiniz.`,
      ],
    },
    en: {
      title: "A transparent",
      gradientText: "data approach",
      description: "This page summarizes how contact information shared through the website is handled.",
      primaryHref: "/en/contact",
      primaryLabel: "Contact Us",
      paragraphs: [
        "Information you share for contact purposes is used only to respond to your request and conduct project communication.",
        "Your information is not shared with third parties for sales or advertising purposes. Personal data is protected except for legal obligations.",
        `For deletion or update requests, you can contact us at ${siteConfig.email}.`,
      ],
    },
  },
  terms: {
    tr: {
      title: "Web sitesini",
      gradientText: "doğru kullanım",
      description: "Bu sayfa, Adakan Software web sitesinin genel kullanım şartlarını özetler.",
      primaryHref: "/contact",
      primaryLabel: "Soru Sor",
      paragraphs: [
        "Bu web sitesindeki metin, görsel ve marka öğeleri Adakan Software'e aittir veya tanıtım amacıyla kullanılır.",
        "Site içeriği izinsiz kopyalanamaz, çoğaltılamaz veya yanıltıcı şekilde kullanılamaz.",
        "Proje kapsamı, teklif ve teslim koşulları her müşteri için ayrıca yazılı olarak belirlenir.",
      ],
    },
    en: {
      title: "Using the website",
      gradientText: "properly",
      description: "This page summarizes the general terms for using the Adakan Software website.",
      primaryHref: "/en/contact",
      primaryLabel: "Ask a Question",
      paragraphs: [
        "The text, visuals, and brand elements on this website belong to Adakan Software or are used for promotional purposes.",
        "Site content may not be copied, reproduced, or used in a misleading way without permission.",
        "Project scope, pricing, and delivery terms are defined separately in writing for each client.",
      ],
    },
  },
} as const
