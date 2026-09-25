import type { Locale } from "./i18n.ts"

type LocalSoftwarePage = {
  path: string
  seo: { title: string; description: string; keywords: string[] }
  title: string
  accent: string
  description: string
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>
  services: Array<{ title: string; description: string; href: string }>
  process: Array<{ title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  relatedLinks: Array<{ label: string; href: string }>
}

const pages: Record<Locale, LocalSoftwarePage> = {
  tr: {
    path: "/istanbul-yazilim-sirketi",
    seo: { title: "İstanbul Yazılım Şirketi ve Web Tasarım", description: "İstanbul merkezli Adakan Software; özel yazılım, web uygulaması, kurumsal web sitesi, Next.js, UI/UX ve iş otomasyonu hizmetleri sunar.", keywords: ["İstanbul yazılım şirketi", "İstanbul yazılım firması", "özel yazılım İstanbul", "İstanbul web tasarım", "web uygulaması geliştirme", "Next.js ajansı"] },
    title: "İstanbul'da işinize göre",
    accent: "yazılım ve web çözümleri",
    description: "Adakan Software, İstanbul merkezli işletmeler ve uzaktan çalışan ekipler için özel yazılım, web uygulaması ve kurumsal web sitesi tasarlayıp geliştirir.",
    sections: [
      { heading: "Hazır kalıba değil, gerçek ihtiyaca göre", paragraphs: ["Bir yazılım ortağı seçerken ilk soru hangi teknolojinin kullanılacağı değil, hangi iş probleminin çözüleceğidir. Operasyon, satış, raporlama veya müşteri deneyimindeki darboğazları birlikte belirler; ilk sürümün hedefini bu probleme göre kurarız.", "Kapsamı yazılı teslimatlar, kullanıcı rolleri, entegrasyonlar ve kabul ölçütleri üzerinden netleştiririz. Bu yaklaşım bütçeyi görünür tutar ve projenin gereksiz özelliklerle büyümesini önler."] },
      { heading: "İstanbul'dan Türkiye'ye ve uzaktan ekiplere", paragraphs: ["İstanbul'daki projelerde ihtiyaç halinde yüz yüze keşif yapılabilir; planlama, tasarım incelemeleri ve sürüm takibi dijital araçlarla da yürütülür. Konumdan bağımsız çalışma yapısı kararların ve teslimlerin yazılı kalmasını sağlar.", "Yerel görünürlük için yalnızca şehir adı eklemeyiz. Hizmet kapsamını, proje sürecini ve kullanıcıların gerçekten sorduğu soruları açık içerikle anlatırız."], bullets: ["Yazılı proje kapsamı", "Düzenli çalışan sürüm paylaşımı", "Kod ve hesap sahipliğinin açıklığı", "Yayın sonrası bakım seçenekleri"] },
      { heading: "Teknik kalite ve arama görünürlüğü birlikte", paragraphs: ["Hızlı bir arayüz, anlaşılır içerik ve sağlam teknik altyapı aynı ürünün parçalarıdır. Semantik HTML, mobil uyum, erişilebilir etkileşimler, güvenli veri doğrulama ve ölçülebilir performans hedefleri geliştirme sürecine baştan dahil edilir.", "SEO çalışması; taranabilir sayfa yapısı, doğru canonical ve dil alternatifleri, yapılandırılmış veri, sitemap ve gerçek arama niyetine cevap veren özgün içerik üzerine kurulur. Sıralama garantisi verilmez; arama motorlarının anlayabileceği güçlü ve dürüst bir temel oluşturulur."] },
      { heading: "Doğru yazılım şirketini seçme kontrolü", paragraphs: ["Teklifleri yalnızca toplam fiyat üzerinden karşılaştırmak eksik kalır. Kapsam dışı maddeler, teslim ölçütleri, bakım sorumluluğu, servis hesaplarının mülkiyeti ve değişiklik süreci birlikte değerlendirilmelidir.", "İyi bir ekip belirsiz noktaları saklamaz; riskleri, bağımlılıkları ve alternatifleri açıklar. Proje başlamadan önce gerçek hedefi ve ilk sürüm sınırını birlikte netleştirmek uzun vadeli maliyeti azaltır."], bullets: ["Benzer problem çözme deneyimi", "Şeffaf kapsam ve takvim", "Güvenlik ve yedekleme yaklaşımı", "Yayın sonrası destek modeli"] },
    ],
    services: [
      { title: "Özel yazılım geliştirme", description: "Operasyon, yönetim paneli, API ve otomasyon ihtiyaçlarına göre geliştirilen sistemler.", href: "/services/software-development" },
      { title: "Web uygulaması", description: "SaaS, portal ve iş araçları için güvenli ve ölçeklenebilir web uygulamaları.", href: "/services/web-application-development" },
      { title: "Kurumsal web sitesi", description: "Markayı anlatan, hızlı, mobil uyumlu ve teknik SEO temeli güçlü web siteleri.", href: "/services/web-development" },
      { title: "Next.js geliştirme", description: "Sürdürülebilir bileşen mimarisi ve performans odaklı frontend geliştirme.", href: "/services/nextjs-development" },
      { title: "UI/UX tasarımı", description: "Karmaşık iş akışlarını anlaşılır ekranlara ve kullanılabilir ürün deneyimine dönüştürme.", href: "/services/ui-ux-design" },
      { title: "İş otomasyonu", description: "Tekrarlayan veri, onay, bildirim ve raporlama adımlarını otomatikleştirme.", href: "/services/business-automation" },
    ],
    process: [
      { title: "Keşif", description: "Hedef, kullanıcı, mevcut süreç ve başarı ölçütleri belirlenir." },
      { title: "Kapsam", description: "İlk sürüm, teslimatlar, takvim ve teknik sınırlar yazılı hale gelir." },
      { title: "Tasarım ve geliştirme", description: "Akışlar çalışan sürümlere dönüşür ve düzenli olarak gözden geçirilir." },
      { title: "Yayın ve bakım", description: "Kontroller tamamlanır; izleme, bakım ve sonraki adımlar planlanır." },
    ],
    faqs: [
      { question: "İstanbul'da özel yazılım geliştirme maliyeti nasıl belirlenir?", answer: "Maliyet kullanıcı rolleri, ekranlar, veri modeli, entegrasyonlar, güvenlik gereksinimleri ve teslim takvimine göre hesaplanır. Keşif sonrasında kapsam ve bütçe aralığı yazılı paylaşılır." },
      { question: "Yüz yüze çalışmak zorunlu mu?", answer: "Hayır. Keşif ve kritik toplantılar ihtiyaca göre yüz yüze veya çevrim içi yapılabilir. Proje kararları ve teslimler dijital olarak izlenebilir tutulur." },
      { question: "Web sitesi SEO çalışması içeriyor mu?", answer: "Projeye göre teknik SEO temeli; metadata, canonical, sitemap, yapılandırılmış veri, semantik içerik ve performans kontrollerini içerir. Organik sıralama içerik kalitesi, rekabet ve zaman gibi dış etkenlere de bağlıdır." },
      { question: "Yayın sonrası destek veriliyor mu?", answer: "Evet. Hata takibi, güvenlik ve bağımlılık güncellemeleri, performans iyileştirmeleri ve yeni özellikler için ihtiyaca uygun bakım kapsamı hazırlanır." },
    ],
    relatedLinks: [{ label: "Projeleri inceleyin", href: "/projects" }, { label: "Yazılım rehberlerini okuyun", href: "/blog" }, { label: "Projenizi anlatın", href: "/contact" }],
  },
  en: {
    path: "/istanbul-software-company",
    seo: { title: "Istanbul Software Company and Web Design", description: "Istanbul-based Adakan Software delivers custom software, web applications, corporate websites, Next.js development, UI/UX and business automation.", keywords: ["Istanbul software company", "software development company Istanbul", "custom software Istanbul", "Istanbul web design", "web application development", "Next.js agency"] },
    title: "Software and web solutions",
    accent: "built in Istanbul around your work",
    description: "Adakan Software designs and develops custom software, web applications and corporate websites for Istanbul businesses and distributed teams.",
    sections: [
      { heading: "Built for a real need", paragraphs: ["The first question is not which technology to use, but which business problem needs to be solved. We map bottlenecks in operations, sales, reporting or customer experience and define the first release around that outcome.", "Scope is documented through deliverables, user roles, integrations and acceptance criteria. This keeps the budget visible and prevents a project from expanding through low-value features."] },
      { heading: "From Istanbul to distributed teams", paragraphs: ["Projects in Istanbul can include in-person discovery when useful, while planning, design reviews and release tracking also work through digital tools. A location-independent process keeps decisions and deliverables documented.", "Local visibility needs useful content rather than repeated place names. We explain the real service scope, project process and questions buyers need answered."], bullets: ["Written project scope", "Regular working releases", "Clear code and account ownership", "Post-launch maintenance options"] },
      { heading: "Technical quality and search visibility", paragraphs: ["Fast interfaces, clear content and reliable engineering belong to one product. Semantic HTML, responsive behavior, accessible interactions, server-side validation and measurable performance targets are considered from the beginning.", "SEO work combines crawlable architecture, correct canonicals and language alternatives, structured data, sitemaps and original content that answers real search intent. Rankings cannot be guaranteed; the goal is a strong, honest foundation search engines can understand."] },
      { heading: "How to assess a software company", paragraphs: ["Comparing proposals by total price alone hides important differences. Review exclusions, acceptance criteria, maintenance responsibilities, service account ownership and the change process together.", "A reliable team explains uncertainty, dependencies and alternatives. Defining the first release and its outcome before development reduces long-term cost."], bullets: ["Relevant problem-solving experience", "Transparent scope and schedule", "Security and backup approach", "Post-launch support model"] },
    ],
    services: [
      { title: "Custom software development", description: "Systems shaped around operations, admin dashboards, APIs and automation.", href: "/services/software-development" },
      { title: "Web application development", description: "Secure and scalable SaaS products, portals and internal tools.", href: "/services/web-application-development" },
      { title: "Corporate websites", description: "Fast, responsive websites with clear messaging and a technical SEO foundation.", href: "/services/web-development" },
      { title: "Next.js development", description: "Maintainable component architecture and performance-focused frontend delivery.", href: "/services/nextjs-development" },
      { title: "UI/UX design", description: "Turning complex workflows into clear interfaces and usable product experiences.", href: "/services/ui-ux-design" },
      { title: "Business automation", description: "Automating repeated data, approval, notification and reporting work.", href: "/services/business-automation" },
    ],
    process: [
      { title: "Discovery", description: "Goals, users, current process and success measures are defined." },
      { title: "Scope", description: "The first release, deliverables, schedule and technical boundaries are documented." },
      { title: "Design and development", description: "Flows become working releases and are reviewed regularly." },
      { title: "Launch and maintenance", description: "Checks are completed and monitoring, support and next steps are planned." },
    ],
    faqs: [
      { question: "How is custom software priced in Istanbul?", answer: "Pricing depends on user roles, screens, data models, integrations, security requirements and schedule. A written scope and budget range follows discovery." },
      { question: "Is in-person work required?", answer: "No. Discovery and critical meetings can be in person or remote. Decisions and deliverables remain digitally traceable." },
      { question: "Does a website project include SEO?", answer: "Depending on scope, the technical foundation includes metadata, canonicals, sitemap, structured data, semantic content and performance checks. Organic ranking also depends on content quality, competition and time." },
      { question: "Is post-launch support available?", answer: "Yes. Maintenance can cover issue monitoring, security and dependency updates, performance improvements and continued feature development." },
    ],
    relatedLinks: [{ label: "Explore projects", href: "/projects" }, { label: "Read software guides", href: "/blog" }, { label: "Tell us about your project", href: "/contact" }],
  },
}

export function getLocalSoftwarePage(locale: Locale) { return pages[locale] }
