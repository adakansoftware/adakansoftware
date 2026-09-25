import type { Locale } from "@/lib/i18n"

export type RouteMetadataKey =
  | "home"
  | "about"
  | "approach"
  | "blog"
  | "careers"
  | "contact"
  | "demos"
  | "logo"
  | "privacy"
  | "pricing"
  | "projects"
  | "services"
  | "terms"
  | "testimonials"

type MetadataContent = {
  title: string
  description: string
  keywords?: string[]
}

export const routeMetadataContent: Record<RouteMetadataKey, Record<Locale, MetadataContent>> = {
  home: {
    tr: {
      title: "Yazılım Şirketi ve Web Tasarım Ajansı",
      description:
        "Özel yazılım, kurumsal web sitesi, Next.js geliştirme, UI/UX, logo ve marka kimliği hizmetleri sunan İstanbul merkezli yazılım şirketi.",
      keywords: ["yazılım şirketi", "yazılım firması", "özel yazılım geliştirme", "web tasarım ajansı", "kurumsal web sitesi", "Next.js geliştirme", "UI UX tasarımı", "İstanbul yazılım şirketi"],
    },
    en: {
      title: "Software Development and Web Design Agency",
      description:
        "Istanbul software company delivering custom software, corporate websites, Next.js development, UI/UX, logo design and brand identity.",
      keywords: ["software development company", "custom software development", "web design agency", "corporate website", "Next.js development", "UI UX design", "Istanbul software company"],
    },
  },
  about: {
    tr: {
      title: "Yazılım ve Tasarım Stüdyosu Hakkında",
      description: "İstanbul merkezli yazılım ve tasarım stüdyomuz; strateji, UI/UX, web geliştirme ve marka kimliğini tek ekipte birleştirir.",
      keywords: ["yazılım stüdyosu", "İstanbul yazılım firması", "dijital ürün ajansı", "web geliştirme ekibi"],
    },
    en: {
      title: "About Our Software and Design Studio",
      description: "Our Istanbul software and design studio brings strategy, UI/UX, web development and brand identity together in one team.",
      keywords: ["software studio", "Istanbul software company", "digital product agency", "web development team"],
    },
  },
  approach: {
    tr: {
      title: "Yazılım Projelerinde Çalışma Yaklaşımımız",
      description: "Önce strateji, sonra zanaat. Adakan Software tasarım kararlarını marka, kullanıcı ve sürdürülebilirlik odağında kurar.",
    },
    en: {
      title: "Our Software Project Approach",
      description: "Strategy first, craft second. Adakan Software builds design decisions around brand, users, and long-term sustainability.",
    },
  },
  blog: {
    tr: {
      title: "Yazılım ve Web Geliştirme Rehberleri",
      description: "Özel yazılım, web uygulaması, kurumsal web sitesi, Next.js, teknik SEO ve performans hakkında uygulamaya dönük kapsamlı rehberler.",
      keywords: ["yazılım rehberi", "özel yazılım", "web uygulaması", "Next.js SEO", "kurumsal web sitesi"],
    },
    en: {
      title: "Software and Web Development Guides",
      description: "Practical guides to custom software, web applications, corporate websites, Next.js, technical SEO and web performance.",
      keywords: ["software development guides", "custom software", "web application", "Next.js SEO", "corporate website"],
    },
  },
  careers: {
    tr: {
      title: "Kariyer",
      description: "Adakan Software ile tasarım, marka ve dijital ürün geliştirme odağında çalışma fırsatlarını keşfedin.",
    },
    en: {
      title: "Careers",
      description: "Explore opportunities to work with Adakan Software on design, brand, and digital product delivery.",
    },
  },
  contact: {
    tr: {
      title: "Yazılım ve Web Projesi İçin İletişim",
      description: "Özel yazılım, kurumsal web sitesi, UI/UX veya marka kimliği projenizin kapsamını ve teklif sürecini birlikte netleştirelim.",
      keywords: ["yazılım projesi teklifi", "web sitesi teklifi", "yazılım firması iletişim", "web tasarım ajansı İstanbul"],
    },
    en: {
      title: "Contact for Software and Web Projects",
      description: "Get in touch with Adakan Software about your new website, brand identity, or digital product project.",
      keywords: ["software project quote", "website quote", "software company contact", "Istanbul web design agency"],
    },
  },
  demos: {
    tr: {
      title: "Canlı Web Sitesi Demoları",
      description: "Adakan Software tarafından tasarlanan diş kliniği, kurumsal hizmet ve farklı sektörlere yönelik canlı web sitesi demolarını inceleyin.",
      keywords: ["web sitesi demo", "kurumsal web sitesi örnekleri", "diş kliniği web sitesi", "Next.js demo", "web tasarım örnekleri"],
    },
    en: {
      title: "Live Website Demos",
      description: "Explore live website demos designed by Adakan Software for dental clinics, corporate services, and businesses across different industries.",
      keywords: ["website demos", "corporate website examples", "dental clinic website", "Next.js demos", "web design examples"],
    },
  },
  logo: {
    tr: {
      title: "Logo ve Kurumsal Kimlik Tasarımı",
      description: "Adakan Software logo tasarımı, marka işareti ve kurumsal kimlik sistemleri için premium görsel kimlik çözümleri sunar.",
      keywords: ["logo tasarımı", "marka kimliği", "kurumsal kimlik", "premium logo"],
    },
    en: {
      title: "Logo and Brand Identity Design",
      description: "Adakan Software creates premium logo design, brand marks, and visual identity systems for ambitious brands.",
      keywords: ["logo design", "brand identity", "visual identity", "premium logo"],
    },
  },
  privacy: {
    tr: {
      title: "Gizlilik",
      description: "Adakan Software web sitesinde paylaşılan iletişim bilgilerinin nasıl işlendiğine dair özet gizlilik bilgileri.",
    },
    en: {
      title: "Privacy",
      description: "Information about Adakan Software privacy practices, data use, and communication processes.",
    },
  },
  pricing: {
    tr: {
      title: "Yazılım ve Web Tasarım Fiyatları",
      description: "Kurumsal web sitesi, özel yazılım, UI/UX, frontend geliştirme, logo ve marka kimliği projeleri için başlangıç fiyatlarını inceleyin.",
      keywords: ["yazılım fiyatları", "web tasarım fiyatları", "kurumsal web sitesi fiyatı", "özel yazılım maliyeti", "UI UX fiyatları"],
    },
    en: {
      title: "Software and Web Design Pricing",
      description: "Starting price ranges for web, brand identity, and digital product projects.",
      keywords: ["software development pricing", "web design pricing", "corporate website cost", "custom software cost", "UI UX pricing"],
    },
  },
  projects: {
    tr: {
      title: "Yazılım ve Web Tasarım Projeleri",
      description: "Kurumsal web sitesi, Next.js geliştirme, UI/UX, logo ve marka kimliği alanlarındaki seçili projelerimizi ve canlı işleri inceleyin.",
      keywords: ["yazılım projeleri", "web tasarım örnekleri", "Next.js projeleri", "kurumsal web sitesi örnekleri", "UI UX portfolyo"],
    },
    en: {
      title: "Software and Web Design Projects",
      description: "Selected examples of web design, brand identity, and digital product development work.",
      keywords: ["software projects", "web design portfolio", "Next.js projects", "corporate website examples", "UI UX portfolio"],
    },
  },
  services: {
    tr: {
      title: "Yazılım Geliştirme ve Web Tasarım Hizmetleri",
      description: "Özel yazılım, kurumsal web tasarımı, Next.js frontend, UI/UX, mobil arayüz, SEO altyapısı, logo ve marka kimliği hizmetleri.",
      keywords: ["özel yazılım geliştirme", "web yazılım hizmetleri", "kurumsal web tasarım", "Next.js geliştirme", "frontend geliştirme", "UI UX tasarım", "mobil uygulama arayüzü"],
    },
    en: {
      title: "Software Development and Web Design Services",
      description: "Premium web design, brand identity, UI/UX, and frontend development services.",
      keywords: ["custom software development", "web development services", "corporate web design", "Next.js development", "frontend development", "UI UX design"],
    },
  },
  terms: {
    tr: {
      title: "Kullanım Şartları",
      description: "Adakan Software web sitesinin genel kullanım şartlarına dair özet bilgiler.",
    },
    en: {
      title: "Terms",
      description: "Adakan Software website terms, service scope, and limitations of responsibility.",
    },
  },
  testimonials: {
    tr: {
      title: "Referans Çalışmalar",
      description: "Adakan Software web sitesi ve marka kimliği çalışmalarını inceleyin.",
    },
    en: {
      title: "Selected Work",
      description: "Explore website and brand identity projects by Adakan Software.",
    },
  },
}
