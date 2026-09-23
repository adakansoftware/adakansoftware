import type { Locale } from "@/lib/i18n"

export const heroContent = {
  tr: {
    lines: ["Markanı", "dijitalde", "büyüt"] as [string, string, string],
    description:
      "Web siteleri, marka kimlikleri ve kullanıcı deneyimleri tasarlıyoruz. Her ekran; güven, hız ve satış için birlikte çalışır.",
    primary: "Projeye Başla",
    secondary: "Projeleri Gör",
    scroll: "Kaydır",
    proofPoints: ["Strateji", "Web tasarım", "Marka kimliği", "Ürün arayüzü"],
  },
  en: {
    lines: ["Grow", "digital", "brands"] as [string, string, string],
    description:
      "We design websites, brand identities, and user experiences. Every screen works together for trust, speed, and conversion.",
    primary: "Start a Project",
    secondary: "View Projects",
    scroll: "Scroll",
    proofPoints: ["Strategy", "Web design", "Brand identity", "Product UI"],
  },
} satisfies Record<
  Locale,
  {
    lines: [string, string, string]
    description: string
    primary: string
    secondary: string
    scroll: string
    proofPoints: string[]
  }
>

export const ctaContent = {
  tr: {
    title: "Markanı",
    gradient: "daha güçlü anlatalım",
    description:
      "Yeni web siteniz, marka kimliğiniz veya dijital ürününüz için net kapsam, doğru öncelik ve güçlü bir uygulama planı çıkaralım.",
    cta: "Görüşmeye Başla",
    stats: [
      { value: "4", label: "Ana hizmet alanı" },
      { value: "2-6", label: "Haftalık teslim planı" },
      { value: "100%", label: "Responsive yaklaşım" },
      { value: "TR/EN", label: "Çift dil hazırlığı" },
    ],
  },
  en: {
    title: "Let's tell",
    gradient: "your brand stronger",
    description:
      "For your new website, brand identity, or digital product, let's define the scope, priorities, and a strong execution plan.",
    cta: "Start the Conversation",
    stats: [
      { value: "4", label: "Core service areas" },
      { value: "2-6", label: "Week delivery plan" },
      { value: "100%", label: "Responsive approach" },
      { value: "TR/EN", label: "Bilingual readiness" },
    ],
  },
} satisfies Record<
  Locale,
  {
    title: string
    gradient: string
    description: string
    cta: string
    stats: Array<{ value: string; label: string }>
  }
>

export const servicesSectionContent = {
  tr: {
    title: "Net hedef,",
    gradient: "ölçülebilir etki",
    description:
      "Güzel görünen işler yapmanın ötesine geçiyoruz: konumlandırma, deneyim ve teknik uygulama aynı hedefe bağlanıyor.",
  },
  en: {
    title: "Clear goals,",
    gradient: "measurable impact",
    description:
      "We go beyond good-looking work: positioning, experience, and technical execution all connect to the same business goal.",
  },
} satisfies Record<Locale, { title: string; gradient: string; description: string }>

export const projectsSectionContent = {
  tr: {
    title: "Görünür sonuç",
    gradient: "üreten işler",
    all: "Tüm Projeleri Gör",
  },
  en: {
    title: "Work that creates",
    gradient: "visible results",
    all: "View All Projects",
  },
} satisfies Record<Locale, { title: string; gradient: string; all: string }>

export const philosophySectionContent = {
  tr: {
    background: "YAKLAŞIM",
    title: "Harika tasarım",
    mutedTitle: "sessizce güven verir.",
    description:
      "Parlak efektlerin arkasına saklanmayan, markanın değerini netleştiren ve kullanıcıyı doğru aksiyona taşıyan deneyimler tasarlıyoruz.",
    items: [
      {
        number: "01",
        title: "Önce strateji",
        description:
          "Her ekranın neyi anlatacağını, hangi itirazı azaltacağını ve hangi aksiyonu güçlendireceğini en başta netleştiririz.",
      },
      {
        number: "02",
        title: "Sonra zanaat",
        description:
          "Tipografi, boşluk, hareket ve mikro etkileşimleri yalnızca estetik için değil, algıyı ve kullanımı iyileştirmek için kurarız.",
      },
      {
        number: "03",
        title: "En sonda sürdürülebilirlik",
        description:
          "Teslim edilen işin hızlı, yönetilebilir ve geliştirilebilir kalmasına önem veririz. İyi tasarım, yayına çıktıktan sonra da çalışır.",
      },
    ],
  },
  en: {
    background: "APPROACH",
    title: "Great design",
    mutedTitle: "quietly builds trust.",
    description:
      "We design experiences that clarify brand value and guide users toward the right action, without hiding behind shiny effects.",
    items: [
      {
        number: "01",
        title: "Strategy first",
        description:
          "We clarify what each screen should communicate, which objection it should reduce, and which action it should support.",
      },
      {
        number: "02",
        title: "Craft second",
        description:
          "Typography, spacing, motion, and micro-interactions are used to improve perception and usability, not decoration alone.",
      },
      {
        number: "03",
        title: "Sustainability last",
        description:
          "We care that the delivered work remains fast, manageable, and extensible after launch. Good design keeps working.",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    background: string
    title: string
    mutedTitle: string
    description: string
    items: Array<{ number: string; title: string; description: string }>
  }
>
