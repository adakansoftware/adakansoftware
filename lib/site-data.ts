import type { Locale } from "@/lib/i18n"
import { withLocale } from "@/lib/i18n"

export const servicesByLocale = {
  tr: [
    {
      title: "Web Tasarım",
      href: "/services/web-development",
      description: "Markanın değerini ilk ekranda hissettiren, hızlı, erişilebilir ve dönüşüm odaklı web siteleri tasarlarız.",
      tags: ["Kurumsal site", "Landing page", "E-ticaret"],
    },
    {
      title: "Marka Kimliği",
      href: "/services#brand-identity",
      description: "Logo, renk, tipografi ve görsel dilin tek bir sistem gibi çalıştığı güçlü marka kimlikleri kurarız.",
      tags: ["Logo", "Görsel sistem", "Marka rehberi"],
    },
    {
      title: "UI/UX Tasarım",
      href: "/services/ui-ux-design",
      description: "Karmaşık akışları sadeleştirir, kullanıcıların ürünü anlamasını ve tekrar kullanmasını kolaylaştırırız.",
      tags: ["SaaS", "Panel", "Mobil uygulama"],
    },
    {
      title: "Özel Yazılım",
      href: "/services/software-development",
      description: "İş süreçlerinize uygun web uygulamaları, yönetim panelleri, API entegrasyonları ve otomasyonlar geliştiririz.",
      tags: ["Web uygulaması", "API", "Otomasyon"],
    },
    {
      title: "Frontend Geliştirme",
      href: "/services/nextjs-development",
      description: "Tasarımları performanslı, responsive ve sürdürülebilir Next.js arayüzlerine dönüştürürüz.",
      tags: ["Next.js", "Animasyon", "Performans"],
    },
    {
      title: "Web Uygulaması",
      href: "/services/web-application-development",
      description: "SaaS, portal, yönetim paneli ve operasyon araçlarını güvenli, hızlı ve ölçeklenebilir web uygulamalarına dönüştürürüz.",
      tags: ["SaaS", "Portal", "Yönetim paneli"],
    },
    {
      title: "İş Otomasyonu",
      href: "/services/business-automation",
      description: "Tekrarlayan veri, onay, bildirim ve raporlama adımlarını izlenebilir yazılım akışlarıyla otomatikleştiririz.",
      tags: ["Otomasyon", "Entegrasyon", "Raporlama"],
    },
  ],
  en: [
    {
      title: "Web Design",
      href: "/services/web-development",
      description: "We design fast, accessible, conversion-focused websites that communicate your value from the first screen.",
      tags: ["Corporate site", "Landing page", "E-commerce"],
    },
    {
      title: "Brand Identity",
      href: "/services#brand-identity",
      description: "We build strong identity systems where logo, color, typography, and visual language work as one.",
      tags: ["Logo", "Visual system", "Brand guide"],
    },
    {
      title: "UI/UX Design",
      href: "/services/ui-ux-design",
      description: "We simplify complex flows and make products easier to understand, trust, and use again.",
      tags: ["SaaS", "Dashboard", "Mobile app"],
    },
    {
      title: "Custom Software",
      href: "/services/software-development",
      description: "We build web applications, admin dashboards, API integrations and automations around your business processes.",
      tags: ["Web apps", "API", "Automation"],
    },
    {
      title: "Frontend Development",
      href: "/services/nextjs-development",
      description: "We turn designs into performant, responsive, and maintainable Next.js interfaces.",
      tags: ["Next.js", "Animation", "Performance"],
    },
    {
      title: "Web Applications",
      href: "/services/web-application-development",
      description: "We turn SaaS products, portals, admin dashboards and operations tools into secure, fast and scalable web applications.",
      tags: ["SaaS", "Portal", "Admin dashboard"],
    },
    {
      title: "Business Automation",
      href: "/services/business-automation",
      description: "We automate repetitive data, approval, notification and reporting tasks with observable software workflows.",
      tags: ["Automation", "Integration", "Reporting"],
    },
  ],
} satisfies Record<Locale, Array<{ title: string; href: string; description: string; tags: string[] }>>

export const projectsByLocale = {
  tr: [
    {
      title: "Z Grup İnşaat",
      href: "/projects#z-grup-insaat",
      category: "İnşaat ve hafriyat web sitesi",
      year: "2026",
      description: "Hafriyat, temel kazısı ve nakliyat hizmetlerini; filo, proje ve teklif bağlantılarıyla sunan kurumsal web tasarımı.",
      color: "#a00b00",
      coverImage: "/projects/z-grup-insaat-cover.png",
    },
    {
      title: "Sallıhoğulları Hafriyat",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Hafriyat kurumsal web sitesi",
      year: "2026",
      description: "Adana merkezli hafriyat ve iş makinesi hizmetleri için saha güveni, hizmet kapsamı ve teklif akışını netleştiren kurumsal web deneyimi.",
      color: "#f59e0b",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
    },
  ],
  en: [
    {
      title: "Z Grup İnşaat",
      href: "/projects#z-grup-insaat",
      category: "Construction and excavation website",
      year: "2026",
      description: "A corporate website presenting excavation, foundation digging and transport services, with fleet, project and quote navigation.",
      color: "#a00b00",
      coverImage: "/projects/z-grup-insaat-cover.png",
    },
    {
      title: "Sallıhoğulları Excavation",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Construction services website",
      year: "2026",
      description: "A corporate web experience for an Adana-based excavation and machinery company, clarifying field trust, service scope, and quote flow.",
      color: "#f59e0b",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
    },
  ],
} satisfies Record<Locale, Array<{ title: string; href: string; category: string; year: string; description: string; color: string; coverImage?: string }>>

export const demoExamplesByLocale = {
  tr: [
    {
      title: "Sallıhoğulları Hafriyat Demo",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Kurumsal demo",
      description: "Hafriyat ve iş makinesi hizmetleri için hazırlanmış canlı demo deneyimi.",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
      color: "#f59e0b",
    },
    {
      title: "Premium Ajans Landing",
      href: "/",
      category: "Landing demo",
      description: "Güçlü hero, net CTA ve hızlı güven sinyalleriyle örnek satış odaklı sayfa akışı.",
      color: "#0066ff",
    },
    {
      title: "Marka Kimliği Sunumu",
      href: "/logo",
      category: "Logo demo",
      description: "Logo, renk, tipografi ve kullanım sistemini tek anlatıda gösteren örnek kimlik akışı.",
      color: "#14b8a6",
    },
  ],
  en: [
    {
      title: "Sallıhoğulları Excavation Demo",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Corporate demo",
      description: "A live demo experience for excavation and machinery services.",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
      color: "#f59e0b",
    },
    {
      title: "Premium Agency Landing",
      href: "/",
      category: "Landing demo",
      description: "A sample conversion-focused flow with a strong hero, clear CTA, and fast trust signals.",
      color: "#0066ff",
    },
    {
      title: "Brand Identity Presentation",
      href: "/logo",
      category: "Logo demo",
      description: "A sample identity flow that presents logo, color, typography, and usage as one system.",
      color: "#14b8a6",
    },
  ],
} satisfies Record<Locale, Array<{ title: string; href: string; category: string; description: string; color: string; coverImage?: string }>>

export const logoWorksByLocale = {
  tr: [
    {
      title: "Z Grup",
      category: "Logo tasarımı",
      description: "Siyah geometrik Z formunu kırmızı bir çizgiyle birleştiren marka işareti.",
      initials: "ZG",
      logoImage: "/projects/z-grup-logo.png",
      color: "#a00b00",
    },
    {
      title: "Sallıhoğulları Hafriyat",
      category: "Hafriyat marka işareti",
      description: "İş makinesi sembolüyle S harfini birleştiren, sarı ve turuncu tonlarında hafriyat logosu.",
      initials: "SH",
      logoImage: "/projects/salihogullari-hafriyat-logo.png",
      color: "#0066ff",
    },
    {
      title: "Adakan Hafriyat",
      category: "İnşaat ve hafriyat firması logosu",
      description: "Kırmızı ve siyah renklerle oluşturulmuş geometrik sembol ve Adakan yazı karakteri.",
      initials: "AH",
      logoImage: "/projects/adakan-hafriyat-insaat-logo.png",
      color: "#14b8a6",
    },
    {
      title: "Adakan Software",
      category: "Yazılım marka kimliği",
      description: "A harfini dijital bağlantı detaylarıyla birleştiren Adakan Software marka işareti.",
      initials: "AS",
      logoImage: "/projects/adakan-software-logo.png",
      color: "#f59e0b",
    },
  ],
  en: [
    {
      title: "Z Grup",
      category: "Logo design",
      description: "A geometric black Z paired with a sweeping red accent.",
      initials: "ZG",
      logoImage: "/projects/z-grup-logo.png",
      color: "#a00b00",
    },
    {
      title: "Sallıhoğulları Hafriyat",
      category: "Excavation brand mark",
      description: "An excavation logo combining an excavator symbol with the letter S in yellow and orange.",
      initials: "SH",
      logoImage: "/projects/salihogullari-hafriyat-logo.png",
      color: "#0066ff",
    },
    {
      title: "Adakan Hafriyat",
      category: "Construction identity",
      description: "A geometric red-and-black symbol paired with the Adakan wordmark.",
      initials: "AH",
      logoImage: "/projects/adakan-hafriyat-insaat-logo.png",
      color: "#14b8a6",
    },
    {
      title: "Adakan Software",
      category: "Software brand identity",
      description: "The Adakan Software brand mark combines the letter A with digital connection details.",
      initials: "AS",
      logoImage: "/projects/adakan-software-logo.png",
      color: "#f59e0b",
    },
  ],
} satisfies Record<
  Locale,
  Array<{ title: string; category: string; description: string; initials: string; logoImage?: string; color: string }>
>

function localizeHref(href: string, locale: Locale) {
  return href.startsWith("http://") || href.startsWith("https://") ? href : withLocale(href, locale)
}

export function getServices(locale: Locale) {
  return servicesByLocale[locale].map((service) => ({
    ...service,
    href: localizeHref(service.href, locale),
  }))
}

export function getProjects(locale: Locale) {
  return projectsByLocale[locale].map((project) => ({
    ...project,
    href: localizeHref(project.href, locale),
  }))
}

export function getDemoExamples(locale: Locale) {
  return demoExamplesByLocale[locale].map((demo) => ({
    ...demo,
    href: localizeHref(demo.href, locale),
  }))
}

export function getLogoWorks(locale: Locale) {
  return logoWorksByLocale[locale]
}

export const services = getServices("tr")
export const projects = getProjects("tr")
