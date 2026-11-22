import type { Locale } from "./i18n.ts"

export const vanServiceContent = {
  tr: {
    path: "/van-yazilim-firmasi",
    seo: { title: "Van Yazılım Firması ve Web Tasarım", description: "Van'daki işletmelere özel yazılım, web tasarım, CRM ve iş otomasyonu. İstanbul merkezli Adakan Software ile uzaktan geliştirme, fiyat ve bakım kapsamını inceleyin.", keywords: ["Van yazılım şirketi", "Van yazılım firması", "Van yazılımcı", "Van web tasarım", "Van özel yazılım"] },
    title: "Van yazılım hizmetleri",
    accent: "özel yazılım ve web tasarım",
    description: "Adakan Software, Van'daki işletmelere özel yazılım, web sitesi ve iş otomasyonu geliştirir. İstanbul merkezli ekibimizle müşteri takibi, teklif ve sipariş süreçlerinizi uzaktan planlayıp hayata geçirin.",
    services: [
      { title: "Özel yazılım geliştirme", description: "Müşteri, teklif ve sipariş kayıtlarını tek akışta yönetin. İlk sürümün ekranları ve kullanıcı yetkileri işinize göre belirlenir.", href: "/services/software-development" },
      { title: "CRM ve yönetim panelleri", description: "Excel ve mesajlarda kalan müşteri takibini web uygulamasına taşıyın. Veri aktarımı ve raporlar teklif öncesinde kapsamlandırılır.", href: "/services/web-application-development" },
      { title: "Van web tasarım hizmeti", description: "Hizmetlerinizi anlatan, mobil uyumlu kurumsal web sitesi. İletişim akışı, içerik ve dil seçenekleri birlikte planlanır.", href: "/services/web-development" },
      { title: "Next.js web geliştirme", description: "Yeni bir web projesi veya mevcut uygulamanın geliştirilmesi için performans, bakım ve yayın ihtiyaçlarını değerlendirin.", href: "/services/nextjs-development" },
      { title: "Arayüz ve kullanıcı deneyimi", description: "Müşteri formları ve personel ekranlarını kullanacak kişilere göre tasarlayın. Geliştirme öncesi önizleme üzerinden değerlendirin.", href: "/services/ui-ux-design" },
      { title: "İş otomasyonu", description: "Tekrarlanan veri girişlerini ve durum takibini azaltacak akışlar. Dış sistem bağlantıları mevcut API olanaklarına göre planlanır.", href: "/services/business-automation" },
    ],
    sections: [
      { heading: "Van’da yazılımcı ararken ihtiyacınızı nasıl tarif edersiniz?", paragraphs: ["Siparişler mesajlarda, müşteri bilgileri farklı dosyalarda, teklifler ayrı tablolarda kalıyorsa ilk adım tüm sistemi değiştirmek değildir. Mevcut süreci birlikte inceler; hangi bilginin kim tarafından girileceğini ve hangi rapora ihtiyaç duyulduğunu belirleriz.", "İlk sürümü müşteri takibi, teklif yönetimi veya sipariş ekranı gibi sınırlı bir akışla planlayabiliriz. Mevcut verilerin formatı, aktarım kapsamı ve dış sistem bağlantıları teklif öncesinde değerlendirilir."] },
      { heading: "Web sitesi mi, yönetim yazılımı mı?", paragraphs: ["Hizmetlerinizi tanıtmak ve talep toplamak için mobil uyumlu bir web sitesi yeterli olabilir. Teklif durumunu takip etmek, ekip üyelerine farklı yetkiler vermek veya düzenli rapor almak gerekiyorsa yönetim paneli ya da özel yazılım kapsamı belirlenir.", "Van'daki müşterilere ve şehir dışından gelen taleplere aynı siteden ulaşmak isteyen işletmeler için hizmet sayfaları ve iletişim akışı planlanır. Yurt dışına hizmet veriyorsanız TR/EN sayfa yapısı proje kapsamına eklenebilir; çeviri ve içerik sorumlulukları baştan netleştirilir."] },
      { heading: "Van'dan uzaktan proje yürütmek", paragraphs: ["İstanbul merkezli ekibimizle proje görüşmelerini çevrim içi yürütüyoruz. İlk görüşmeye mevcut web adresinizi, kullandığınız tabloları ve çözmek istediğiniz üç ana sorunu getirmeniz kapsamı belirlemeyi kolaylaştırır. Gerçek müşteri verisi yerine anonim örnekler kullanabilirsiniz.", "Tasarım ve çalışan sürümler paylaşılan önizleme üzerinden değerlendirilir. Geri bildirimler yazılı toplanır; onaylanan kapsam, teslim ölçütleri ve değişiklik talepleri ayrı takip edilir."], bullets: ["Çevrim içi ihtiyaç görüşmesi", "Yazılı kapsam ve teslim ölçütleri", "Önizleme üzerinden onay", "Yayın ve hesap devri planı"] },
      { heading: "Bütçe ve yayın sonrası sorumluluklar", paragraphs: ["Web sitesi paketleri tek seferlik proje bedeliyle sunulur. SEO kapsamı pakete göre değişir; içerik, alan adı ve hosting müşteriye aittir. Özel entegrasyonlar ve yönetim yazılımları ayrıca kapsamlandırılır.", "CRM ve diğer yazılım ürünlerinde kurulum ile aylık bakım ayrı değerlendirilir. Veri aktarımı, kullanıcı rolleri ve eğitim kurulum kapsamında; barındırma, yedekleme ve hata düzeltme aylık bakım kapsamında ele alınır. Yeni özellikler ayrıca tekliflendirilir."] },
    ],
    faqs: [
      { question: "Van'da yazılımcı seçerken teklifte nelere bakmalıyım?", answer: "Yalnızca toplam fiyatı karşılaştırmayın. Kullanıcı rolleri, ekranlar, entegrasyonlar, veri aktarımı, kaynak kod ve hesap teslimi, test ölçütleri ve bakım sorumluluğu yazılı olsun. Örnek bir iş akışı paylaşın; teklifin bu akışı hangi teslimlerle çözdüğünü sorun." },
      { question: "Van'daki projeleri nasıl yürütüyorsunuz?", answer: "Adakan Software İstanbul merkezlidir. Van'daki işletmelere çevrim içi görüşmeler, paylaşılan önizlemeler ve yazılı teslim planıyla hizmet verir." },
      { question: "Web sitesi fiyatlarını nereden görebilirim?", answer: "Web sitesi paketleri fiyat sayfasında ayrı listelenir. Sayfa sayısı, yönetim paneli, dil ve SEO kapsamını karşılaştırabilirsiniz. Özel yazılımın fiyatı iş akışları ve entegrasyonlar belirlendikten sonra teklif edilir." },
      { question: "Mevcut Excel kayıtları yazılıma aktarılabilir mi?", answer: "Dosya yapısı, veri kalitesi ve hedef sistem incelendikten sonra aktarım planlanabilir. Temizleme, eşleştirme ve örnek aktarımın kapsamı teklif aşamasında yazılır." },
      { question: "Yayın sonrasında destek nasıl işler?", answer: "Web projelerinde ilk ay hata düzeltme dahildir; yeni özellikler buna dahil değildir. Yazılım ürünlerinde barındırma, yedekleme ve hata düzeltme için aylık bakım kapsamı ayrıca belirlenir." },
    ],
    relatedLinks: [{ label: "İstanbul yazılım şirketi", href: "/istanbul-yazilim-sirketi" }, { label: "Web sitesi paketleri", href: "/pricing/web" }, { label: "Yazılım ürünleri", href: "/pricing/yazilim" }, { label: "Proje örnekleri", href: "/projects" }, { label: "Projenizi anlatın", href: "/contact" }],
  },
  en: {
    path: "/van-software-company",
    seo: { title: "Software Development and Web Design for Van", description: "Custom software, websites and workflow automation for businesses in Van, Turkey. Work remotely with Adakan Software on scope, delivery and ongoing maintenance.", keywords: ["Van software development", "Van Turkey web design", "custom business software"] },
    title: "Software company for Van",
    accent: "custom software and websites",
    description: "Bring customer records, quotes and daily operations into a clearer workflow. Work remotely with Istanbul-based Adakan Software from discovery through launch.",
    services: [
      { title: "Custom software development", description: "Manage customers, quotes and orders in one workflow. Define the first release around the screens and permissions your team needs.", href: "/services/software-development" },
      { title: "CRM and admin panels", description: "Move customer tracking from spreadsheets and messages into a web application. Agree on migration and reporting scope before development.", href: "/services/web-application-development" },
      { title: "Web design for Van", description: "A responsive business website explaining your services. Plan enquiry forms, content and language options together.", href: "/services/web-development" },
      { title: "Next.js web development", description: "Review performance, maintenance and launch requirements for a new website or improvements to an existing application.", href: "/services/nextjs-development" },
      { title: "Interface and user experience", description: "Design customer forms and staff screens around the people using them. Review previews before development begins.", href: "/services/ui-ux-design" },
      { title: "Workflow automation", description: "Reduce repeated data entry and manual status tracking. External connections are scoped against the APIs available in your existing systems.", href: "/services/business-automation" },
    ],
    sections: [
      { heading: "Hiring a software developer for your business in Van", paragraphs: ["If orders live in messages, customer records in separate files and quotes in spreadsheets, replacing everything is not necessarily the first step. We review who enters each record, who needs access and which reports support everyday decisions.", "A first release can focus on customer tracking, quote management or an order interface. Existing data formats, migration scope and external system connections are reviewed before a proposal is prepared."] },
      { heading: "A public website or internal business software?", paragraphs: ["A responsive website may be enough to explain your services and collect enquiries. Tracking quote status, assigning staff permissions or producing recurring reports calls for an admin panel or a separate software scope.", "For businesses serving Van and customers elsewhere, service pages and enquiry forms can support both audiences. Turkish and English pages can be included for international customers, with translation and content responsibilities agreed in advance."] },
      { heading: "Working remotely from Van", paragraphs: ["Our team is based in Istanbul. Discovery and reviews take place online. Bring your current website, sample spreadsheets and three operational problems to the first discussion; anonymised examples are sufficient for initial scoping.", "Designs and working releases are reviewed through shared previews. Feedback is recorded in writing, with acceptance criteria and changes tracked against the agreed scope."], bullets: ["Online discovery meeting", "Written scope and acceptance criteria", "Reviews through shared previews", "Launch and account handover plan"] },
      { heading: "Budget and responsibilities after launch", paragraphs: ["Website packages have a one-time project price. SEO deliverables depend on the package, while content, domain and hosting remain the client's responsibility. Custom integrations and business software are scoped separately.", "Software products separate setup from monthly maintenance. Setup covers agreed data migration, roles and training; monthly maintenance covers hosting, backups and bug fixes. Additional features require a separate estimate."] },
    ],
    faqs: [
      { question: "What should I check when choosing a software developer in Van?", answer: "Compare more than the total price. Ask for written scope covering roles, screens, integrations, data migration, code and account handover, acceptance tests and maintenance responsibilities. Share a sample workflow and ask which deliverables address it." },
      { question: "How do you deliver projects for businesses in Van?", answer: "Adakan Software is based in Istanbul. We serve businesses in Van through online meetings, shared previews and a written delivery plan." },
      { question: "Where can I compare website prices?", answer: "The website pricing page lists packages separately, including page scope, admin features, languages and SEO deliverables. Custom software is quoted after workflows and integrations are defined." },
      { question: "Can existing spreadsheet records be migrated?", answer: "Migration depends on file structure, data quality and the target system. Data cleaning, field mapping and sample imports are scoped before work begins." },
      { question: "How does support work after launch?", answer: "Website projects include first-month bug fixes, excluding new features. Software products have a separately agreed monthly maintenance scope for hosting, backups and bug fixes." },
    ],
    relatedLinks: [{ label: "Istanbul software company", href: "/istanbul-software-company" }, { label: "Website packages", href: "/pricing/web" }, { label: "Software products", href: "/pricing/yazilim" }, { label: "Project examples", href: "/projects" }, { label: "Discuss your project", href: "/contact" }],
  },
} satisfies Record<Locale, object>
