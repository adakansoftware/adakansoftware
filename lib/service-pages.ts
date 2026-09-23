import type { Locale } from "@/lib/i18n"

export const servicePageSlugs = ["software-development", "web-development", "nextjs-development"] as const
export type ServicePageSlug = (typeof servicePageSlugs)[number]

type ServicePageCopy = {
  path: string
  seo: { title: string; description: string }
  keywords: string[]
  title: string
  accent: string
  description: string
  overviewTitle: string
  overview: string
  capabilitiesTitle: string
  capabilities: string[]
  deliverablesTitle: string
  deliverables: string[]
}

const pages: Record<ServicePageSlug, Record<Locale, ServicePageCopy>> = {
  "software-development": {
    tr: {
      path: "/services/software-development",
      seo: {
        title: "Özel Yazılım Geliştirme Şirketi",
        description: "İşletmelere özel web uygulaması, yönetim paneli, API entegrasyonu ve süreç otomasyonu geliştiren İstanbul merkezli yazılım şirketi.",
      },
      keywords: ["özel yazılım geliştirme", "yazılım şirketi", "web uygulaması", "yönetim paneli", "API entegrasyonu", "iş süreçleri otomasyonu"],
      title: "İşinize göre şekillenen",
      accent: "özel yazılım",
      description: "Hazır kalıplara sığmayan iş süreçleri için hızlı, güvenli ve sürdürülebilir web tabanlı yazılım çözümleri geliştiriyoruz.",
      overviewTitle: "Özel yazılım geliştirme nedir?",
      overview: "Özel yazılım geliştirme; operasyon, satış, raporlama veya müşteri deneyimi gibi belirli bir iş ihtiyacına göre tasarlanan dijital sistemlerin analizden yayına kadar geliştirilmesidir. Gereksiz özellikleri ayıklıyor, ekibinizin günlük akışına uyum sağlayan ölçülebilir bir ürün kuruyoruz.",
      capabilitiesTitle: "Geliştirdiğimiz çözümler",
      capabilities: ["Web uygulamaları ve SaaS ürünleri", "Yönetim ve operasyon panelleri", "API ve üçüncü taraf sistem entegrasyonları", "Tekrarlayan iş akışları için otomasyon"],
      deliverablesTitle: "Proje kapsamı",
      deliverables: ["İhtiyaç analizi ve teknik yol haritası", "UI/UX akışları ve çalışan prototip", "Güvenli frontend ve backend geliştirme", "Test, yayın ve bakım desteği"],
    },
    en: {
      path: "/services/software-development",
      seo: {
        title: "Custom Software Development Company",
        description: "Istanbul software company building custom web applications, admin dashboards, API integrations and workflow automation for growing businesses.",
      },
      keywords: ["custom software development", "software development company", "web application development", "admin dashboard", "API integration", "workflow automation"],
      title: "Custom software",
      accent: "built around your business",
      description: "We build fast, secure and maintainable web software for business processes that do not fit an off-the-shelf product.",
      overviewTitle: "What is custom software development?",
      overview: "Custom software development turns a specific operational, sales, reporting or customer experience need into a purpose-built digital system. We remove unnecessary complexity and create a measurable product that fits the way your team actually works.",
      capabilitiesTitle: "What we build",
      capabilities: ["Web applications and SaaS products", "Admin and operations dashboards", "API and third-party integrations", "Workflow automation"],
      deliverablesTitle: "Project scope",
      deliverables: ["Discovery and technical roadmap", "UI/UX flows and working prototype", "Secure frontend and backend development", "Testing, launch and maintenance support"],
    },
  },
  "web-development": {
    tr: {
      path: "/services/web-development",
      seo: {
        title: "Kurumsal Web Tasarım ve Geliştirme",
        description: "Hızlı, mobil uyumlu ve SEO temeli güçlü kurumsal web siteleri tasarlıyor; içerik, arayüz ve yazılım geliştirmeyi birlikte yürütüyoruz.",
      },
      keywords: ["kurumsal web tasarım", "web sitesi yaptırma", "web geliştirme", "SEO uyumlu web sitesi", "mobil uyumlu web sitesi", "İstanbul web tasarım"],
      title: "Markanızı anlatan",
      accent: "kurumsal web sitesi",
      description: "İçeriği kolay anlaşılır, her ekranda hızlı ve ziyaretçiyi doğru aksiyona taşıyan kurumsal web deneyimleri tasarlayıp geliştiriyoruz.",
      overviewTitle: "Web tasarım ve geliştirme birlikte",
      overview: "Kurumsal web sitesi yalnızca görsel bir vitrin değildir. Marka anlatısını, hizmetlerinizi, güven unsurlarını ve teklif akışını tek bir yapıda buluşturur. Strateji, metin, arayüz, geliştirme ve teknik SEO kararlarını aynı proje planında ele alıyoruz.",
      capabilitiesTitle: "Web sitesi türleri",
      capabilities: ["Kurumsal web siteleri", "Ürün ve hizmet landing page’leri", "Çok dilli web siteleri", "İçerik yönetimli pazarlama siteleri"],
      deliverablesTitle: "Teslim kapsamı",
      deliverables: ["Sayfa mimarisi ve içerik akışı", "Responsive UI/UX tasarımı", "Performanslı frontend geliştirme", "Teknik SEO, analitik ve yayına alma"],
    },
    en: {
      path: "/services/web-development",
      seo: {
        title: "Corporate Web Design and Development",
        description: "We design and develop fast, responsive corporate websites with a strong SEO foundation, clear content and maintainable frontend architecture.",
      },
      keywords: ["corporate web design", "web development company", "SEO friendly website", "responsive website", "business website design", "Istanbul web agency"],
      title: "A corporate website",
      accent: "that explains your value",
      description: "We design and build clear, fast websites that work on every screen and guide visitors toward the right action.",
      overviewTitle: "Web design and development together",
      overview: "A corporate website is more than a visual storefront. It connects your brand story, services, proof and enquiry journey in one system. We plan strategy, copy, interface, development and technical SEO as one coordinated project.",
      capabilitiesTitle: "Website types",
      capabilities: ["Corporate websites", "Product and service landing pages", "Multilingual websites", "Content-managed marketing sites"],
      deliverablesTitle: "What is included",
      deliverables: ["Information architecture and content flow", "Responsive UI/UX design", "Performance-focused frontend development", "Technical SEO, analytics and launch"],
    },
  },
  "nextjs-development": {
    tr: {
      path: "/services/nextjs-development",
      seo: {
        title: "Next.js Geliştirme ve Frontend Hizmeti",
        description: "Next.js ve React ile hızlı, SEO uyumlu, ölçeklenebilir kurumsal siteler ve web uygulamaları geliştiren deneyimli frontend ekibi.",
      },
      keywords: ["Next.js geliştirme", "Next.js ajansı", "React geliştirme", "frontend geliştirme", "performans optimizasyonu", "Core Web Vitals"],
      title: "Hızlı ve sürdürülebilir",
      accent: "Next.js geliştirme",
      description: "Tasarımı; performansı, erişilebilirliği ve arama görünürlüğünü koruyan üretim kalitesinde Next.js arayüzlerine dönüştürüyoruz.",
      overviewTitle: "Neden Next.js?",
      overview: "Next.js; sunucu tarafı render, modern önbellekleme, görsel optimizasyonu ve güçlü yönlendirme özellikleriyle kurumsal web siteleri ve web uygulamaları için sağlam bir React altyapısı sunar. Projeyi yalnızca çalışır halde değil, bakım ve büyüme süreçlerine hazır teslim ediyoruz.",
      capabilitiesTitle: "Teknik yetkinlikler",
      capabilities: ["Next.js App Router ve React", "Sunucu bileşenleri ve API entegrasyonları", "Core Web Vitals ve performans optimizasyonu", "Erişilebilir, responsive arayüz geliştirme"],
      deliverablesTitle: "Geliştirme standardı",
      deliverables: ["Tip güvenli TypeScript kodu", "SEO ve sosyal paylaşım metadatası", "Test ve hata izleme altyapısı", "Cloudflare veya Vercel yayını"],
    },
    en: {
      path: "/services/nextjs-development",
      seo: {
        title: "Next.js Development and Frontend Services",
        description: "Experienced frontend team building fast, SEO-ready and scalable corporate websites and web applications with Next.js and React.",
      },
      keywords: ["Next.js development", "Next.js agency", "React development", "frontend development", "performance optimization", "Core Web Vitals"],
      title: "Fast, maintainable",
      accent: "Next.js development",
      description: "We turn design into production-ready Next.js interfaces built for performance, accessibility and organic search visibility.",
      overviewTitle: "Why Next.js?",
      overview: "Next.js combines server rendering, modern caching, image optimization and robust routing for corporate websites and web applications. We deliver products that are ready for ongoing maintenance and growth, not just the first launch.",
      capabilitiesTitle: "Technical capabilities",
      capabilities: ["Next.js App Router and React", "Server components and API integrations", "Core Web Vitals and performance optimization", "Accessible, responsive frontend development"],
      deliverablesTitle: "Development standard",
      deliverables: ["Type-safe TypeScript code", "SEO and social sharing metadata", "Testing and error monitoring foundation", "Cloudflare or Vercel deployment"],
    },
  },
}

export function isServicePageSlug(value: string): value is ServicePageSlug {
  return servicePageSlugs.includes(value as ServicePageSlug)
}

export function getServicePage(slug: string, locale: Locale) {
  return isServicePageSlug(slug) ? pages[slug][locale] : undefined
}
