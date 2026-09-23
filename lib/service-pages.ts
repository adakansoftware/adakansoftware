import type { Locale } from "@/lib/i18n"

export const servicePageSlugs = [
  "software-development",
  "web-development",
  "nextjs-development",
  "web-application-development",
  "business-automation",
  "ui-ux-design",
] as const
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
  faqTitle: string
  faqs: Array<{ question: string; answer: string }>
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
      faqTitle: "Özel yazılım hakkında sık sorulanlar",
      faqs: [
        { question: "Özel yazılım geliştirme maliyeti nasıl belirlenir?", answer: "Maliyet; kullanıcı rolleri, ekran ve entegrasyon sayısı, veri yapısı, güvenlik gereksinimleri ve yayın takvimine göre belirlenir. Keşif görüşmesinden sonra kapsamı ve bütçe aralığını yazılı olarak paylaşırız." },
        { question: "Özel yazılım projesi ne kadar sürer?", answer: "Takvim ürünün kapsamına bağlıdır. Önce temel iş akışını çalışan bir sürüme dönüştürür, ardından öncelikli özellikleri planlı teslimlere böleriz." },
        { question: "Yayın sonrası bakım ve geliştirme desteği veriyor musunuz?", answer: "Evet. Hata takibi, güvenlik güncellemeleri, performans iyileştirmeleri ve yeni özellik geliştirme için projeye uygun bakım planı sunarız." },
      ],
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
      faqTitle: "Custom software frequently asked questions",
      faqs: [
        { question: "How is custom software development priced?", answer: "Pricing depends on user roles, screens, integrations, data structure, security requirements and delivery schedule. We provide a written scope and budget range after discovery." },
        { question: "How long does a custom software project take?", answer: "The schedule depends on scope. We first turn the core workflow into a working release, then organize priority features into planned delivery stages." },
        { question: "Do you provide maintenance after launch?", answer: "Yes. We offer project-specific maintenance for issue monitoring, security updates, performance improvements and continued feature development." },
      ],
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
      faqTitle: "Kurumsal web sitesi hakkında sık sorulanlar",
      faqs: [
        { question: "Kurumsal web sitesi paketine neler dahil?", answer: "Sayfa mimarisi, içerik akışı, responsive arayüz, frontend geliştirme, temel teknik SEO, analitik kurulumu ve yayına alma desteği proje kapsamına dahildir." },
        { question: "Web sitesi SEO uyumlu hazırlanıyor mu?", answer: "Evet. Anlamsal HTML, hızlı sayfa yapısı, mobil uyumluluk, metadata, canonical, sitemap ve yapılandırılmış veri gibi teknik SEO temellerini kurarız." },
        { question: "Site içeriklerini sonradan kendimiz güncelleyebilir miyiz?", answer: "İhtiyaca göre yönetim paneli veya içerik yönetim sistemi kurabiliriz. Teslimde içerik güncelleme akışını ve yetkileri net biçimde dokümante ederiz." },
      ],
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
      faqTitle: "Corporate website frequently asked questions",
      faqs: [
        { question: "What is included in a corporate website project?", answer: "The scope covers information architecture, content flow, responsive interface design, frontend development, technical SEO foundations, analytics setup and launch support." },
        { question: "Will the website be SEO-ready?", answer: "Yes. We implement semantic HTML, fast page delivery, mobile compatibility, metadata, canonicals, sitemaps and relevant structured data." },
        { question: "Can our team update the website content?", answer: "We can add an admin panel or content management system when required. The delivery includes clear documentation for content workflows and access roles." },
      ],
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
      faqTitle: "Next.js geliştirme hakkında sık sorulanlar",
      faqs: [
        { question: "Mevcut React projesini Next.js'e taşıyabilir misiniz?", answer: "Evet. Mevcut kodu, veri akışlarını ve bağımlılıkları inceler; geçişi sayfa sayfa planlayarak arama görünürlüğünü ve çalışan özellikleri koruruz." },
        { question: "Next.js SEO için neden avantajlı?", answer: "Sunucu tarafı üretim, metadata yönetimi, hızlı yönlendirme ve görsel optimizasyonu sayesinde arama motorlarının içeriği daha güvenilir biçimde taramasına yardımcı olur." },
        { question: "Next.js projesini nerede yayınlıyorsunuz?", answer: "Projenin gereksinimine göre Cloudflare veya Vercel üzerinde yayınlarız; alan adı, önbellek, güvenlik başlıkları ve izleme ayarlarını birlikte kurarız." },
      ],
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
      faqTitle: "Next.js development frequently asked questions",
      faqs: [
        { question: "Can you migrate an existing React project to Next.js?", answer: "Yes. We review the current code, data flows and dependencies, then plan a staged migration that preserves working features and organic search visibility." },
        { question: "Why is Next.js useful for SEO?", answer: "Server rendering, metadata management, fast navigation and image optimization help search engines crawl and understand page content more reliably." },
        { question: "Where do you deploy Next.js projects?", answer: "We deploy to Cloudflare or Vercel according to project needs and configure domains, caching, security headers and monitoring as part of launch." },
      ],
    },
  },
  "web-application-development": {
    tr: {
      path: "/services/web-application-development",
      seo: {
        title: "Web Uygulaması Geliştirme Şirketi",
        description: "SaaS, müşteri portalı, yönetim paneli ve operasyon araçları için güvenli, hızlı ve ölçeklenebilir web uygulamaları geliştiriyoruz.",
      },
      keywords: ["web uygulaması geliştirme", "web uygulama şirketi", "SaaS geliştirme", "müşteri portalı", "yönetim paneli yazılımı", "React web uygulaması"],
      title: "İş akışınıza uygun",
      accent: "web uygulamaları",
      description: "Tarayıcıda çalışan, ekiplerin ve müşterilerin günlük işlemlerini hızlandıran güvenli web uygulamaları tasarlayıp geliştiriyoruz.",
      overviewTitle: "Web uygulaması geliştirme nedir?",
      overview: "Web uygulaması; kullanıcı girişi, veri yönetimi, raporlama, ödeme, bildirim veya entegrasyon gibi etkileşimli işlevleri tarayıcı üzerinden sunan yazılımdır. Ürünü gerçek kullanıcı rolleri ve operasyon adımları etrafında kurgular, teknik mimariyi büyümeye uygun biçimde kurarız.",
      capabilitiesTitle: "Geliştirdiğimiz web uygulamaları",
      capabilities: ["SaaS ürünleri ve abonelik sistemleri", "Müşteri ve bayi portalları", "Yönetim, raporlama ve operasyon panelleri", "Rezervasyon, sipariş ve başvuru sistemleri"],
      deliverablesTitle: "Uygulama geliştirme kapsamı",
      deliverables: ["Ürün keşfi ve kullanıcı rolleri", "Bilgi mimarisi ve çalışan prototip", "Frontend, backend ve veri katmanı", "Test, güvenlik, yayın ve izleme"],
      faqTitle: "Web uygulaması hakkında sık sorulanlar",
      faqs: [
        { question: "Web sitesi ile web uygulaması arasındaki fark nedir?", answer: "Web sitesi çoğunlukla bilgi sunar; web uygulaması kullanıcı girişi, veri işlemleri, kişiselleştirme ve iş akışları gibi etkileşimli özellikler içerir." },
        { question: "Web uygulaması mobil cihazlarda çalışır mı?", answer: "Evet. Arayüzü responsive tasarlar, temel iş akışlarını telefon, tablet ve masaüstünde kullanılabilir olacak şekilde geliştiririz." },
        { question: "Mevcut sistemlerle entegrasyon yapılabilir mi?", answer: "API sunan muhasebe, ödeme, CRM, e-posta ve operasyon sistemleriyle entegrasyon planlayabilir; veri akışını güvenli ve izlenebilir biçimde kurabiliriz." },
      ],
    },
    en: {
      path: "/services/web-application-development",
      seo: {
        title: "Web Application Development Company",
        description: "We build secure, fast and scalable web applications for SaaS products, customer portals, admin dashboards and operational tools.",
      },
      keywords: ["web application development", "web app development company", "SaaS development", "customer portal", "admin dashboard development", "React web application"],
      title: "Web applications",
      accent: "built around real workflows",
      description: "We design and build secure browser-based products that make everyday work faster for teams and customers.",
      overviewTitle: "What is web application development?",
      overview: "A web application delivers interactive functions such as authentication, data management, reporting, payments, notifications or integrations through a browser. We shape the product around real user roles and operational steps, with an architecture designed for growth.",
      capabilitiesTitle: "Web applications we build",
      capabilities: ["SaaS products and subscription systems", "Customer and partner portals", "Admin, reporting and operations dashboards", "Booking, ordering and application systems"],
      deliverablesTitle: "Application development scope",
      deliverables: ["Product discovery and user roles", "Information architecture and working prototype", "Frontend, backend and data layer", "Testing, security, deployment and monitoring"],
      faqTitle: "Web application frequently asked questions",
      faqs: [
        { question: "What is the difference between a website and a web application?", answer: "A website mainly presents information, while a web application includes interactive functions such as user accounts, data operations, personalization and business workflows." },
        { question: "Will the web application work on mobile devices?", answer: "Yes. We design responsive interfaces and make core workflows usable across phones, tablets and desktop screens." },
        { question: "Can the application integrate with our existing systems?", answer: "We can connect systems that provide APIs, including accounting, payment, CRM, email and operations tools, with secure and observable data flows." },
      ],
    },
  },
  "business-automation": {
    tr: {
      path: "/services/business-automation",
      seo: {
        title: "İş Süreçleri Otomasyonu Çözümleri",
        description: "Tekrarlayan operasyonları, veri aktarımını, bildirimleri ve raporlamayı özel yazılım ve API entegrasyonlarıyla otomatikleştiriyoruz.",
      },
      keywords: ["iş süreçleri otomasyonu", "iş akışı otomasyonu", "operasyon otomasyonu", "API entegrasyonu", "raporlama otomasyonu", "özel otomasyon yazılımı"],
      title: "Tekrarlayan işleri azaltan",
      accent: "iş otomasyonu",
      description: "Manuel veri girişi, takip, bildirim ve raporlama adımlarını güvenilir yazılım akışlarına dönüştürüyoruz.",
      overviewTitle: "İş süreçleri otomasyonu ne sağlar?",
      overview: "İş süreçleri otomasyonu, ekiplerin sürekli tekrarladığı kurallı adımları yazılımla yürütür. Önce mevcut süreci ve hata noktalarını haritalar, sonra veri kaynaklarını ve onay adımlarını birleştiren izlenebilir bir akış kurarız. Amaç yalnızca hız değil, tutarlı veri ve daha az operasyon yüküdür.",
      capabilitiesTitle: "Otomasyon alanları",
      capabilities: ["Form, talep ve onay akışları", "CRM, muhasebe ve operasyon entegrasyonları", "E-posta, WhatsApp ve sistem bildirimleri", "Periyodik raporlama ve veri senkronizasyonu"],
      deliverablesTitle: "Otomasyon projesi kapsamı",
      deliverables: ["Süreç ve darboğaz analizi", "Entegrasyon ve veri akışı tasarımı", "Yönetim ekranı ve hata izleme", "Test, devreye alma ve ekip dokümantasyonu"],
      faqTitle: "İş otomasyonu hakkında sık sorulanlar",
      faqs: [
        { question: "Hangi işler otomasyona uygundur?", answer: "Belirli kurallarla tekrarlanan veri girişi, dosya aktarımı, bildirim, onay, raporlama ve sistemler arası eşitleme işleri iyi otomasyon adaylarıdır." },
        { question: "Kullandığımız mevcut programlar değişmek zorunda mı?", answer: "Her zaman değil. Mevcut araçlar API veya güvenli veri aktarımı destekliyorsa aralarında bağlantı kurarak süreci iyileştirebiliriz." },
        { question: "Otomasyon hata verdiğinde nasıl takip edilir?", answer: "Kritik adımlara kayıt, durum ve uyarı mekanizmaları ekleriz. Böylece başarısız işlemler görünür olur ve gerektiğinde güvenli biçimde yeniden çalıştırılabilir." },
      ],
    },
    en: {
      path: "/services/business-automation",
      seo: {
        title: "Business Process Automation Services",
        description: "We automate repetitive operations, data transfers, notifications and reporting with custom software and reliable API integrations.",
      },
      keywords: ["business process automation", "workflow automation", "operations automation", "API integration", "reporting automation", "custom automation software"],
      title: "Business automation",
      accent: "that removes repetitive work",
      description: "We turn manual data entry, tracking, notification and reporting steps into reliable software workflows.",
      overviewTitle: "What does business process automation improve?",
      overview: "Business process automation uses software to run repetitive, rules-based tasks. We map the current process and failure points, then connect data sources and approval steps in an observable workflow. The goal is consistent data and lower operational load as well as speed.",
      capabilitiesTitle: "Automation opportunities",
      capabilities: ["Forms, requests and approval workflows", "CRM, accounting and operations integrations", "Email, WhatsApp and system notifications", "Scheduled reporting and data synchronization"],
      deliverablesTitle: "Automation project scope",
      deliverables: ["Process and bottleneck analysis", "Integration and data-flow design", "Admin interface and issue monitoring", "Testing, rollout and team documentation"],
      faqTitle: "Business automation frequently asked questions",
      faqs: [
        { question: "Which tasks are suitable for automation?", answer: "Rules-based data entry, file transfers, notifications, approvals, reporting and synchronization between systems are strong automation candidates." },
        { question: "Do we need to replace our current software?", answer: "Not always. If the existing tools support APIs or secure data exchange, we can connect them and improve the workflow around them." },
        { question: "How are automation failures monitored?", answer: "We add logging, status and alert mechanisms to critical steps so failed operations are visible and can be retried safely when required." },
      ],
    },
  },
  "ui-ux-design": {
    tr: {
      path: "/services/ui-ux-design",
      seo: {
        title: "UI/UX Tasarım ve Ürün Arayüzü",
        description: "SaaS, web uygulaması ve mobil ürünler için kullanıcı akışları, wireframe, prototip, arayüz tasarımı ve tasarım sistemi hazırlıyoruz.",
      },
      keywords: ["UI UX tasarım", "ürün tasarımı", "SaaS arayüz tasarımı", "mobil uygulama tasarımı", "wireframe", "tasarım sistemi"],
      title: "Karmaşık ürünler için",
      accent: "sade UI/UX tasarımı",
      description: "Kullanıcının ne yapacağını hızlıca anladığı, ekiplerin tutarlı biçimde geliştirebildiği dijital ürün arayüzleri tasarlıyoruz.",
      overviewTitle: "UI/UX tasarım süreci nasıl ilerler?",
      overview: "UI/UX tasarımı, yalnızca ekranların görünümünü değil; kullanıcının hedefe ulaşmak için izlediği adımları, bilgi yapısını ve geri bildirimleri düzenler. İş hedefini ve kullanıcı rollerini netleştirir, akışları wireframe ile test eder, ardından ölçeklenebilir bir görsel sistem kurarız.",
      capabilitiesTitle: "Tasarladığımız deneyimler",
      capabilities: ["SaaS ve yönetim paneli arayüzleri", "Web ve mobil uygulama akışları", "Wireframe ve tıklanabilir prototipler", "Tasarım sistemi ve bileşen kütüphanesi"],
      deliverablesTitle: "UI/UX teslim kapsamı",
      deliverables: ["Kullanıcı rolleri ve deneyim haritası", "Bilgi mimarisi ve temel akışlar", "Responsive arayüz ve prototip", "Bileşenler, durumlar ve geliştirici notları"],
      faqTitle: "UI/UX tasarım hakkında sık sorulanlar",
      faqs: [
        { question: "UI ve UX arasındaki fark nedir?", answer: "UX ürünün akışını, bilgi yapısını ve kullanım kolaylığını; UI ise bu deneyimin görsel arayüzünü, bileşenlerini ve etkileşim dilini tanımlar." },
        { question: "Sadece tasarım teslimi yapıyor musunuz?", answer: "Evet. Tasarımı, prototipi, bileşen durumlarını ve geliştirici notlarını teslim edebiliriz. İstenirse frontend geliştirmeyi de aynı ekipte sürdürebiliriz." },
        { question: "Mevcut ürün arayüzünü iyileştirebilir misiniz?", answer: "Evet. Mevcut akışları, tutarsızlıkları ve kullanıcı sürtünmelerini inceler; öncelikli ekranlardan başlayarak uygulanabilir bir iyileştirme planı hazırlarız." },
      ],
    },
    en: {
      path: "/services/ui-ux-design",
      seo: {
        title: "UI/UX Design and Product Interfaces",
        description: "We create user flows, wireframes, prototypes, interface design and design systems for SaaS, web applications and mobile products.",
      },
      keywords: ["UI UX design", "product design", "SaaS interface design", "mobile app design", "wireframe", "design system"],
      title: "Clear UI/UX design",
      accent: "for complex products",
      description: "We design digital product interfaces that users understand quickly and product teams can build consistently.",
      overviewTitle: "How does the UI/UX design process work?",
      overview: "UI/UX design organizes more than visual appearance. It defines the steps users take, the information structure and the feedback they receive. We clarify business goals and user roles, test flows through wireframes, then establish a visual system that can scale with the product.",
      capabilitiesTitle: "Experiences we design",
      capabilities: ["SaaS and admin dashboard interfaces", "Web and mobile application flows", "Wireframes and clickable prototypes", "Design systems and component libraries"],
      deliverablesTitle: "UI/UX delivery scope",
      deliverables: ["User roles and experience map", "Information architecture and core flows", "Responsive interface and prototype", "Components, states and developer notes"],
      faqTitle: "UI/UX design frequently asked questions",
      faqs: [
        { question: "What is the difference between UI and UX?", answer: "UX defines product flow, information structure and usability, while UI defines the visual interface, components and interaction language that deliver that experience." },
        { question: "Can you deliver design without development?", answer: "Yes. We can deliver the interface, prototype, component states and developer notes. Frontend development can also continue with the same team when required." },
        { question: "Can you improve an existing product interface?", answer: "Yes. We review current flows, inconsistencies and user friction, then prepare an actionable improvement plan starting with priority screens." },
      ],
    },
  },
}

export function isServicePageSlug(value: string): value is ServicePageSlug {
  return servicePageSlugs.includes(value as ServicePageSlug)
}

export function getServicePage(slug: string, locale: Locale) {
  return isServicePageSlug(slug) ? pages[slug][locale] : undefined
}
