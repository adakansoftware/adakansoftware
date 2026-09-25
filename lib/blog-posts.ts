import type { Locale } from "@/lib/i18n"

export const blogPostKeys = [
  "custom-software-guide",
  "corporate-website-cost",
  "nextjs-seo-performance",
  "website-vs-web-app",
] as const

export type BlogPostKey = (typeof blogPostKeys)[number]

type BlogSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BlogPost = {
  key: BlogPostKey
  slug: string
  category: string
  title: string
  excerpt: string
  seo: { title: string; description: string; keywords: string[] }
  publishedAt: string
  modifiedAt: string
  readingTime: string
  sections: BlogSection[]
  faqs: Array<{ question: string; answer: string }>
  relatedService: { href: string; label: string }
}

const releaseDate = "2026-09-25"

const posts = {
  "custom-software-guide": {
    tr: {
      slug: "ozel-yazilim-gelistirme-rehberi",
      category: "Özel yazılım",
      title: "Özel yazılım geliştirme: ihtiyaçtan çalışan ürüne",
      excerpt: "Özel yazılımın ne zaman doğru yatırım olduğunu, kapsamın nasıl belirlendiğini ve sürdürülebilir bir ürünün nasıl kurulduğunu anlatan karar rehberi.",
      seo: {
        title: "Özel Yazılım Geliştirme Rehberi",
        description: "Özel yazılım nedir, maliyet ve süre nasıl belirlenir? Analizden yayına doğru ekip, kapsam, güvenlik ve bakım kararlarını inceleyin.",
        keywords: ["özel yazılım geliştirme", "yazılım şirketi", "web uygulaması", "yazılım projesi", "özel yazılım maliyeti"],
      },
      readingTime: "8 dakika",
      sections: [
        {
          heading: "Özel yazılım ne zaman anlamlıdır?",
          paragraphs: [
            "Özel yazılım, bir işletmenin kendine özgü operasyonunu hazır araçların sınırlarına uydurmak yerine sistemi gerçek iş akışına göre kurar. Tekrarlanan veri girişi, dağınık tablolar, farklı platformlarda kalan müşteri bilgileri veya manuel onay zincirleri büyümeyi yavaşlatıyorsa özel çözüm anlamlı hale gelir. Amaç yalnızca yeni ekranlar üretmek değil, işi daha izlenebilir ve ölçülebilir bir yapıya taşımaktır.",
            "Her ihtiyaç özel geliştirme gerektirmez. Standart muhasebe, e-posta veya dosya paylaşımı gibi alanlarda olgun ürünler daha ekonomik olabilir. Karar verirken hazır aracın lisans maliyetini değil; eksik entegrasyonların, tekrar eden emeğin, veri hatalarının ve kaçan fırsatların toplam maliyetini değerlendirmek gerekir. Özel yazılım bu toplam yükü belirgin biçimde azaltabiliyorsa yatırıma dönüşür.",
          ],
          bullets: ["Tekrarlanan ve kurallı operasyonlar", "Birden fazla sistem arasında veri aktarımı", "Role göre değişen yönetim ve onay akışları", "İşletmeye özgü raporlama ihtiyacı"],
        },
        {
          heading: "Kapsam doğru nasıl belirlenir?",
          paragraphs: [
            "Sağlıklı bir proje özellik listesiyle değil, çözülmesi gereken iş problemiyle başlar. Kullanıcı rolleri, bugün izlenen adımlar, kullanılan veri kaynakları ve hatanın en pahalı olduğu noktalar birlikte haritalanır. Bu çalışma ilk sürümün hangi iş sonucunu üretmesi gerektiğini gösterir. Böylece güzel görünen ancak kullanılmayan özellikler yerine günlük işi gerçekten taşıyan çekirdek akış kurulur.",
            "İlk sürümde her ihtiyacı aynı anda çözmek hem teslim süresini hem de riski büyütür. Önceliklendirme; iş değeri, kullanım sıklığı, teknik bağımlılık ve hata etkisi üzerinden yapılmalıdır. Çalışan bir temel sürüm gerçek kullanıcılarla doğrulandıktan sonra raporlama, otomasyon ve yeni entegrasyonlar ölçülen ihtiyaca göre eklenebilir. Bu yaklaşım bütçeyi kontrol altında tutar ve yanlış varsayımları erken ortaya çıkarır.",
          ],
          bullets: ["Hedef ve başarı ölçütü", "Kullanıcı rolleri ve yetkiler", "Çekirdek iş akışı", "Entegrasyon ve veri gereksinimleri", "İlk sürüm dışında bırakılanlar"],
        },
        {
          heading: "Teknik kalite hangi kararlara bağlıdır?",
          paragraphs: [
            "Sürdürülebilir bir sistem yalnızca kullanılan teknolojiyle açıklanamaz. Yetkilendirme, veri doğrulama, hata kaydı, yedekleme yaklaşımı ve dağıtım süreci en baştan tasarlanmalıdır. Arayüz, API ve veri katmanı arasındaki sınırlar net olduğunda yeni özellik eklemek kolaylaşır. Kod incelemesi ve otomatik kontroller ise küçük değişikliklerin mevcut akışları bozma riskini azaltır.",
            "Performans da sonradan eklenen bir hız çalışması değildir. Gereksiz veri istekleri, ağır istemci paketleri ve kötü sorgular kullanıcı sayısı arttıkça maliyeti büyütür. Kritik ekranların hedef süreleri belirlenmeli, gerçek kullanım verileri izlenmeli ve darboğazlar tahmin yerine ölçümle çözülmelidir. Güvenlik ve performans kararlarının proje başında görünür olması bakım maliyetini doğrudan düşürür.",
          ],
          bullets: ["Rol tabanlı erişim", "Sunucu tarafı veri doğrulama", "İzlenebilir hata kayıtları", "Test ve güvenli dağıtım", "Performans bütçeleri"],
        },
        {
          heading: "Doğru yazılım ekibi nasıl seçilir?",
          paragraphs: [
            "Bir ekibin yalnızca önceki ekranlarına değil, belirsizliği nasıl yönettiğine bakın. İyi ekip keşif sırasında zor sorular sorar, varsayımları yazılı hale getirir ve kapsam dışını açıkça belirtir. Teklifte teslimatlar, sorumluluklar, kabul ölçütleri ve yayın sonrası destek yer almalıdır. Her şeyi kısa sürede yapma sözü yerine, riskleri ve bağımlılıkları açıklayan plan daha güvenilir bir işaret verir.",
            "Teslim sonrasında kodun, alan adlarının, servis hesaplarının ve dokümantasyonun kime ait olduğu baştan net olmalıdır. Bakım anlaşması; hata düzeltme, güvenlik güncellemesi ve yeni özellik geliştirmeyi birbirinden ayırmalıdır. Ürünün günlük kullanımından gelen geri bildirim düzenli değerlendirildiğinde yazılım tek seferlik proje olmaktan çıkar ve işletmeyle birlikte gelişen bir altyapıya dönüşür.",
          ],
          bullets: ["Yazılı kapsam ve kabul ölçütleri", "Düzenli çalışan sürüm gösterimi", "Hesap ve kod sahipliği", "Yayın ve geri dönüş planı", "Bakım kapsamının açıklığı"],
        },
      ],
      faqs: [
        { question: "Özel yazılım geliştirme ne kadar sürer?", answer: "Süre; kullanıcı rolleri, ekranlar, entegrasyonlar ve veri yapısına bağlıdır. En güvenli yaklaşım çekirdek akışı önce çalışan bir sürüme dönüştürüp sonraki özellikleri ölçülen ihtiyaca göre planlamaktır." },
        { question: "Hazır yazılım mı, özel yazılım mı seçilmeli?", answer: "Hazır ürün iş akışının büyük kısmını karşılıyor ve güvenli entegrasyon sunuyorsa önce onu değerlendirmek mantıklıdır. İşletmeye özgü süreçler sürekli manuel çalışma ve veri kaybı üretiyorsa özel yazılım daha uygun olabilir." },
        { question: "Yazılım yayınlandıktan sonra bakım gerekir mi?", answer: "Evet. Bağımlılık ve güvenlik güncellemeleri, hata takibi, yedekleme kontrolleri ve değişen iş ihtiyaçları için düzenli bakım planı gerekir." },
      ],
      relatedService: { href: "/services/software-development", label: "Özel yazılım geliştirme hizmetini inceleyin" },
    },
    en: {
      slug: "custom-software-development-guide",
      category: "Custom software",
      title: "Custom software development: from need to working product",
      excerpt: "A practical guide to deciding when custom software is worth the investment and how to scope, build, and maintain it responsibly.",
      seo: {
        title: "Custom Software Development Guide",
        description: "Learn when custom software makes sense and how scope, cost, security, delivery and maintenance decisions shape a reliable product.",
        keywords: ["custom software development", "software development company", "web application", "software project", "custom software cost"],
      },
      readingTime: "8 min read",
      sections: [
        {
          heading: "When does custom software make sense?",
          paragraphs: [
            "Custom software fits a real operating model instead of forcing a business into the limits of a generic tool. It becomes relevant when repeated data entry, disconnected spreadsheets, fragmented customer records, or manual approval chains slow down delivery. The goal is not to add more screens. It is to make the work traceable, consistent, and easier to measure across the team.",
            "Not every requirement deserves a custom build. Mature products are usually better for standard accounting, email, and file sharing. The useful comparison includes more than subscription fees: measure the labor spent moving data, the cost of mistakes, missing integrations, and opportunities lost because information arrives late. A custom system earns its place when it can reduce that combined burden in a meaningful way.",
          ],
          bullets: ["Repeated rules-based operations", "Data moving between several systems", "Role-specific approval flows", "Business-specific reporting"],
        },
        {
          heading: "How should the scope be defined?",
          paragraphs: [
            "A sound project starts with the business problem rather than a feature wish list. Map the user roles, current steps, data sources, and the points where failure is most expensive. This reveals the outcome the first release must deliver. The core workflow can then support real daily work instead of collecting attractive features that people rarely use.",
            "Trying to solve every requirement in the first release increases time, cost, and uncertainty. Prioritize by business value, frequency, technical dependency, and the impact of failure. Once a focused release is used by real people, reporting, automation, and integrations can follow observed needs. This keeps the budget visible and exposes incorrect assumptions before they become expensive architecture.",
          ],
          bullets: ["Goal and success measure", "User roles and permissions", "Core workflow", "Integrations and data", "Explicitly excluded work"],
        },
        {
          heading: "What determines technical quality?",
          paragraphs: [
            "A maintainable system is not defined by its framework alone. Authorization, data validation, error reporting, backups, and deployment need deliberate decisions from the start. Clear boundaries between interface, API, and data layers make future changes safer. Reviews and automated checks reduce the chance that a small feature silently damages an established workflow.",
            "Performance is also a design constraint rather than a final clean-up task. Unnecessary requests, oversized client bundles, and inefficient queries become more expensive as usage grows. Set targets for critical screens, observe real behavior, and fix bottlenecks with measurements. Early visibility into security and performance decisions lowers operating and maintenance costs over the product's life.",
          ],
          bullets: ["Role-based access", "Server-side validation", "Observable error handling", "Tests and safe deployment", "Performance budgets"],
        },
        {
          heading: "How do you choose a software partner?",
          paragraphs: [
            "Look beyond screenshots and ask how the team handles uncertainty. A capable partner asks difficult questions during discovery, records assumptions, and clearly names what is outside the scope. The proposal should describe deliverables, responsibilities, acceptance criteria, and post-launch support. A plan that explains risks and dependencies is more useful than a promise to build everything immediately.",
            "Ownership of source code, domains, service accounts, and documentation should be clear before work begins. Maintenance should separate defect resolution, security updates, and new feature development. When feedback from daily use is reviewed regularly, the system stops being a one-off delivery and becomes infrastructure that can improve with the business.",
          ],
          bullets: ["Written scope and acceptance criteria", "Frequent working demonstrations", "Clear account and code ownership", "Release and rollback plan", "Defined maintenance boundaries"],
        },
      ],
      faqs: [
        { question: "How long does custom software development take?", answer: "Timing depends on user roles, screens, integrations, and data complexity. A safer approach delivers the core workflow first and plans later capabilities around evidence from real use." },
        { question: "Should we buy existing software or build custom software?", answer: "Use an established product when it covers the workflow and supports secure integration. A custom build becomes more reasonable when unique processes keep creating manual work, data gaps, or operational risk." },
        { question: "Does custom software need maintenance after launch?", answer: "Yes. Dependencies, security updates, error monitoring, backup checks, and changing business requirements all need an ongoing maintenance process." },
      ],
      relatedService: { href: "/services/software-development", label: "Explore custom software development" },
    },
  },
  "corporate-website-cost": {
    tr: {
      slug: "kurumsal-web-sitesi-maliyeti",
      category: "Kurumsal web sitesi",
      title: "Kurumsal web sitesi maliyetini belirleyen gerçek unsurlar",
      excerpt: "Web sitesi tekliflerini sağlıklı karşılaştırmak için kapsam, içerik, tasarım, teknik kalite ve yayın sonrası işletme maliyetlerini birlikte değerlendirin.",
      seo: {
        title: "Kurumsal Web Sitesi Maliyeti ve Kapsamı",
        description: "Kurumsal web sitesi maliyetini tasarım, içerik, geliştirme, SEO, performans ve bakım açısından belirleyen unsurları öğrenin.",
        keywords: ["kurumsal web sitesi maliyeti", "web tasarım fiyatları", "web sitesi yaptırma", "kurumsal web tasarım", "SEO uyumlu web sitesi"],
      },
      readingTime: "7 dakika",
      sections: [
        {
          heading: "Fiyat neden yalnızca sayfa sayısına bağlı değildir?",
          paragraphs: [
            "Kurumsal bir web sitesinin maliyeti menüde görünen sayfaların toplamından ibaret değildir. Benzer sayıda sayfaya sahip iki projeden biri hazır içerikle ilerlerken diğeri mesaj mimarisi, fotoğraf seçimi, çok dil, form akışları ve özel entegrasyon gerektirebilir. Gerçek kapsam; her sayfanın hangi iş hedefini desteklediği, hangi içeriğin üretileceği ve hangi sistemlerle konuşacağı üzerinden belirlenir.",
            "Teklifleri karşılaştırırken sadece toplam rakama bakmak yanıltıcıdır. Strateji, içerik girişi, responsive tasarım, erişilebilirlik, analitik kurulum, yönlendirmeler ve yayın desteği kalemlerinin dahil olup olmadığını sorun. Düşük başlangıç bedeli; eksik içerik, yavaş sayfalar veya yayın sonrasında ayrı ayrı ücretlendirilen işler nedeniyle toplamda daha yüksek maliyet yaratabilir.",
          ],
          bullets: ["İçerik ve mesaj mimarisi", "Özgün arayüz kapsamı", "Çok dil ve entegrasyonlar", "Taşıma ve yönlendirme", "Yayın sonrası destek"],
        },
        {
          heading: "Tasarım ve içerik bütçeyi nasıl değiştirir?",
          paragraphs: [
            "İyi tasarım marka renklerini bir şablona yerleştirmekten fazlasıdır. Ziyaretçinin hangi soruyla geldiğini, hangi kanıta ihtiyaç duyduğunu ve hangi aksiyona yönelmesi gerektiğini düzenler. Tasarım sistemi; tipografi, boşluk, buton, form ve içerik bileşenlerini tutarlı hale getirir. Bu çalışma ilk yatırımın bir parçasıdır ancak sonraki sayfaların daha hızlı ve tutarlı üretilmesini sağlar.",
            "İçerik hazır değilse proje takvimi çoğu zaman koddan önce durur. Hizmet açıklamaları, vaka anlatıları, sık sorular ve görsel kaynaklar proje başında sahiplenilmelidir. Arama motorları için yazılan metin ile kullanıcı için yazılan metni ayırmak doğru değildir; iyi içerik aranan soruyu net cevaplar, kanıt gösterir ve sonraki adımı açıklar. Anahtar kelime tekrarına dayanan metin güveni azaltır.",
          ],
          bullets: ["Bilgi mimarisi", "Markaya özel tasarım sistemi", "Metin yazımı ve düzenleme", "Fotoğraf ve görsel hazırlığı", "Dönüşüm akışları"],
        },
        {
          heading: "Teknik altyapıda hangi kalemler önemlidir?",
          paragraphs: [
            "Teknik kalite ziyaretçinin doğrudan görmediği ancak deneyimi belirleyen işleri kapsar. Sunucu tarafında doğru başlıkların üretilmesi, mobil görsellerin boyutlandırılması, formların güvenli işlenmesi, hata sayfaları, yönlendirmeler ve analitik ölçüm bunların arasındadır. Sağlam altyapı, arama motorunun içeriği taramasını kolaylaştırırken kullanıcıların yavaşlık veya kırık akış nedeniyle ayrılmasını azaltır.",
            "Alan adı, barındırma ve üçüncü taraf servisleri düzenli işletme maliyeti oluşturur. İhtiyaçtan büyük altyapı gereksiz gider, en ucuz altyapı ise trafik veya form güvenilirliği arttığında sorun yaratabilir. Yedekleme, erişim yetkileri, güncelleme sorumluluğu ve hata izleme teklif aşamasında konuşulmalıdır. Site yayına alındığında bu hesapların işletmeye devredilmesi uzun vadeli kontrol sağlar.",
          ],
          bullets: ["Performans ve Core Web Vitals", "Teknik SEO ve sitemap", "Form güvenliği", "Analitik ve dönüşüm ölçümü", "Barındırma ve izleme"],
        },
        {
          heading: "Sağlıklı teklif nasıl değerlendirilir?",
          paragraphs: [
            "İyi teklif teslim edilecek ekranları, içerik sorumluluklarını, revizyon sınırlarını, teknik entegrasyonları ve kabul koşullarını açıkça yazar. Takvimin hangi girdilere bağlı olduğu belirtilir. Tasarım onayı, geliştirme, içerik girişi, test ve yayın aşamaları ayrı görüldüğünde gecikmenin nereden kaynaklandığı anlaşılır ve tarafların sorumluluğu net kalır.",
            "Web sitesi tek seferlik görsel dosya değil, yaşayan bir yayın sistemidir. Ekibin yeni içerik ekleyebilmesi, ölçüm sonuçlarını izleyebilmesi ve ihtiyaç olduğunda bileşenleri genişletebilmesi gerekir. Kararı en düşük rakama göre değil; hedefi anlama, kapsam açıklığı, teknik sahiplik ve yayın sonrası sürdürülebilirlik üzerinden vermek daha sağlıklı sonuç üretir.",
          ],
          bullets: ["Net teslim listesi", "Sorumluluk ve bağımlılıklar", "Revizyon ve kabul süreci", "Hesap sahipliği", "Bakım ve geliştirme modeli"],
        },
      ],
      faqs: [
        { question: "Kurumsal web sitesi fiyatı nasıl hesaplanır?", answer: "Fiyat; içerik miktarı, özgün tasarım kapsamı, dil sayısı, entegrasyonlar, yönetim ihtiyacı, teknik SEO ve yayın desteğine göre hesaplanır. Sağlıklı teklif bu kalemleri ayrı ve açık biçimde gösterir." },
        { question: "Web sitesi için ayrıca bakım bütçesi gerekir mi?", answer: "Alan adı ve barındırmanın yanında güvenlik güncellemeleri, hata izleme, içerik desteği ve yeni geliştirmeler için ihtiyaca uygun bir bakım bütçesi planlanmalıdır." },
        { question: "SEO çalışması web sitesi fiyatına dahil midir?", answer: "Teknik SEO temeli geliştirme kapsamına dahil edilebilir; sürekli içerik üretimi, otorite çalışmaları ve Search Console takibi ise ayrı, devam eden bir süreçtir. Teklifte sınırların yazılı olması gerekir." },
      ],
      relatedService: { href: "/services/web-development", label: "Kurumsal web geliştirme hizmetini inceleyin" },
    },
    en: {
      slug: "corporate-website-cost-and-scope",
      category: "Corporate websites",
      title: "What really determines the cost of a corporate website?",
      excerpt: "Compare website proposals through scope, content, design, technical quality, ownership, and ongoing operating cost rather than page count alone.",
      seo: {
        title: "Corporate Website Cost and Scope Guide",
        description: "Understand how strategy, content, design, development, SEO, performance and maintenance shape the real cost of a corporate website.",
        keywords: ["corporate website cost", "web design pricing", "business website", "corporate web design", "SEO friendly website"],
      },
      readingTime: "7 min read",
      sections: [
        {
          heading: "Why is price not just a page count?",
          paragraphs: [
            "The cost of a corporate website is not the number of links in its navigation. Two sites with similar page counts can have very different requirements: one may arrive with finished content while another needs message architecture, image direction, multiple languages, form journeys, and integrations. Real scope comes from the role each page plays, the content that must be produced, and the systems it needs to connect with.",
            "Comparing proposals only by the final number hides important gaps. Ask whether strategy, content entry, responsive design, accessibility, analytics, redirects, and launch support are included. A low initial fee can become the more expensive option when content is missing, pages are slow, or essential launch work appears later as separate charges.",
          ],
          bullets: ["Content and message architecture", "Original interface scope", "Languages and integrations", "Migration and redirects", "Post-launch support"],
        },
        {
          heading: "How do design and content affect the budget?",
          paragraphs: [
            "Good design does more than place brand colors into a template. It organizes the visitor's question, the proof they need, and the action they should take. A design system makes typography, spacing, buttons, forms, and content components consistent. That work is part of the initial investment, but it also makes future pages faster and more reliable to produce.",
            "Projects often wait for content before they wait for code. Service explanations, case studies, frequently asked questions, and image sources need an owner at the start. Writing for users and writing for search are not separate activities: useful content answers a real query, provides evidence, and explains the next step. Repeating keywords without adding meaning weakens trust and readability.",
          ],
          bullets: ["Information architecture", "Brand-specific design system", "Copywriting and editing", "Photography and image preparation", "Conversion journeys"],
        },
        {
          heading: "Which technical items matter?",
          paragraphs: [
            "Technical quality includes work visitors may not notice directly but will experience. Server-rendered metadata, responsive image sizing, secure form handling, error pages, redirects, and analytics all matter. A solid foundation helps search engines crawl the content and reduces the chance that people leave because a page is slow or a key journey is broken.",
            "Domains, hosting, and external services create recurring operating costs. Oversized infrastructure wastes money, while the cheapest option may fail as traffic or form volume grows. Backups, access control, update responsibility, and error monitoring should be discussed during the proposal. Transferring the accounts to the business at launch protects long-term control.",
          ],
          bullets: ["Performance and Core Web Vitals", "Technical SEO and sitemap", "Secure forms", "Analytics and conversion measurement", "Hosting and monitoring"],
        },
        {
          heading: "How should a proposal be evaluated?",
          paragraphs: [
            "A useful proposal states the screens to be delivered, content responsibilities, revision boundaries, integrations, and acceptance conditions. It explains which inputs affect the timeline. When design approval, development, content entry, testing, and launch are visible stages, both sides can understand delays and keep responsibilities clear.",
            "A website is a living publishing system rather than a one-off visual file. Your team should be able to add content, review measurements, and extend components when the business changes. Choose based on understanding of the goal, clarity of scope, technical ownership, and long-term maintainability instead of the lowest initial number alone.",
          ],
          bullets: ["Explicit deliverables", "Responsibilities and dependencies", "Revision and acceptance process", "Account ownership", "Maintenance and growth model"],
        },
      ],
      faqs: [
        { question: "How is a corporate website price calculated?", answer: "Pricing depends on content volume, original design scope, languages, integrations, editing needs, technical SEO, and launch support. A useful proposal separates these items clearly." },
        { question: "Does a website need a maintenance budget?", answer: "Yes. In addition to domain and hosting, plan for security updates, monitoring, content support, and future development according to the site's role in the business." },
        { question: "Is SEO included in website development?", answer: "A technical SEO foundation can be part of development. Ongoing content, authority building, and Search Console analysis are continuing activities and should have clearly defined boundaries." },
      ],
      relatedService: { href: "/services/web-development", label: "Explore corporate web development" },
    },
  },
  "nextjs-seo-performance": {
    tr: {
      slug: "nextjs-seo-performans-rehberi",
      category: "Next.js",
      title: "Next.js ile SEO ve performansı birlikte kurmak",
      excerpt: "Render yaklaşımı, metadata, Core Web Vitals, görseller ve JavaScript bütçesi üzerinden hızlı ve taranabilir Next.js siteleri için teknik rehber.",
      seo: {
        title: "Next.js SEO ve Performans Rehberi",
        description: "Next.js projelerinde metadata, render stratejisi, Core Web Vitals, görsel optimizasyonu ve yapılandırılmış veriyi doğru kurun.",
        keywords: ["Next.js SEO", "Next.js performans", "Core Web Vitals", "Next.js geliştirme", "teknik SEO"],
      },
      readingTime: "9 dakika",
      sections: [
        {
          heading: "Render stratejisi neden SEO kararının parçasıdır?",
          paragraphs: [
            "Next.js tek başına yüksek sıralama sağlamaz; içeriğin nasıl üretildiği ve kullanıcıya nasıl ulaştığı önemlidir. Kalıcı pazarlama sayfaları statik üretime uygunsa hızlı ve önbelleklenebilir çıktı sunar. Kullanıcıya veya isteğe göre değişen sayfalar sunucu tarafında üretilebilir. Her şeyi istemci tarafında çalıştırmak ilk içeriği geciktirebilir ve gereksiz JavaScript yükü oluşturabilir.",
            "Strateji sayfa bazında seçilmelidir. Ürün kataloğu güncellenme sıklığına göre yeniden doğrulanabilirken yönetim paneli arama motoruna kapalı kalabilir. Canonical URL, dil varyasyonları ve sitemap yalnızca sayfa var olduğu için doğru hale gelmez; rotaların gerçek içerik envanteriyle aynı kaynaktan üretilmesi gerekir. Böylece yeni sayfa eklenirken SEO kayıtları unutulmaz.",
          ],
          bullets: ["Statik üretim için kalıcı içerikler", "Sunucu render için istek bazlı veri", "İstemci bileşenini etkileşime sınırlama", "Noindex ile özel alanları ayırma"],
        },
        {
          heading: "Metadata ve yapılandırılmış veri nasıl yönetilir?",
          paragraphs: [
            "Her indexlenebilir sayfa benzersiz başlık, açıklama ve kendi canonical adresini üretmelidir. Çok dilli projelerde her sürüm kendisini ve karşı dildeki eşini hreflang ile göstermelidir. Open Graph görseli paylaşım deneyimini iyileştirir; ancak arama sonucundaki başlığı garanti etmez. Metadata görünen içerikle aynı arama niyetini taşımalı ve sayfada bulunmayan vaatler eklememelidir.",
            "Yapılandırılmış veri arama motoruna içeriğin türünü açıklar. Kurum, hizmet, makale, breadcrumb ve görünür sık sorular uygun olduğunda JSON-LD ile işaretlenebilir. Şemaya sahte puan, görünmeyen soru veya doğrulanamayan işletme bilgisi eklemek kısa yol değildir. Aynı kurum için sabit kimlik kullanmak; sayfa, hizmet ve yayıncı düğümlerinin tutarlı bir bilgi grafiği kurmasına yardımcı olur.",
          ],
          bullets: ["Benzersiz title ve description", "Kendi kendine canonical", "Karşılıklı hreflang", "İçerikle eşleşen JSON-LD", "Taranabilir sosyal görsel"],
        },
        {
          heading: "Core Web Vitals nasıl korunur?",
          paragraphs: [
            "Largest Contentful Paint için ana içerik ve görsel gecikmeden ulaşmalıdır. Hero görselinin doğru boyutlandırılması, gereksiz üçüncü taraf betiklerinin ertelenmesi ve kritik fontların kontrollü yüklenmesi etkili olur. Cumulative Layout Shift için görsel boyutları ayrılmalı, sonradan gelen banner ve font değişimleri alanı zıplatmamalıdır. Interaction to Next Paint ise uzun ana iş parçacığı görevlerinden etkilenir.",
            "Laboratuvar ölçümleri geliştirme sırasında hızlı geri bildirim verir, gerçek kullanıcı verileri ise cihaz ve ağ çeşitliliğini gösterir. Tek bir Lighthouse puanını hedeflemek yerine ana sayfa, hizmet sayfası ve form gibi önemli şablonları ayrı izlemek gerekir. Performans bütçesi JavaScript, görsel ve font büyüklüğünü sınırlar; yeni özelliklerin sayfayı sessizce ağırlaştırmasını engeller.",
          ],
          bullets: ["Ana görsel için doğru öncelik", "Boyutu belli medya alanları", "Sınırlı istemci JavaScript'i", "Gerçek kullanıcı ölçümü", "Şablon bazlı performans bütçesi"],
        },
        {
          heading: "Yayın öncesi hangi kontroller yapılmalı?",
          paragraphs: [
            "Üretim derlemesi başarılı olsa bile SEO çıktısı doğrulanmalıdır. Sayfa kaynağında title, description, canonical, hreflang ve JSON-LD bulunmalı; robots ve sitemap üretim alan adını göstermelidir. Kırık bağlantılar, yanlış yönlendirmeler ve 200 durumuyla dönen sahte hata sayfaları tarama kalitesini düşürür. Mobil gezinme ve klavye kullanımı da gerçek kullanıcı deneyiminin parçasıdır.",
            "Yayın sonrasında Search Console ile sitemap gönderilir, önemli URL'ler denetlenir ve indeksleme sorunları izlenir. Arama performansı yalnızca teknik hatalara bakılarak anlaşılmaz; sorgular, gösterimler, tıklamalar ve sayfadaki dönüşümler birlikte değerlendirilmelidir. Teknik temel hatasız olduğunda büyümenin ana kaynağı yararlı içerik, gerçek referanslar ve zaman içinde oluşan marka otoritesidir.",
          ],
          bullets: ["Üretim HTML kontrolü", "Robots ve sitemap doğrulaması", "Kırık link ve durum kodları", "Mobil kullanılabilirlik", "Search Console takibi"],
        },
      ],
      faqs: [
        { question: "Next.js kullanmak SEO'yu otomatik olarak iyileştirir mi?", answer: "Hayır. Next.js doğru render, metadata ve performans araçlarını sunar; sonuç bu araçların içerik ve rota yapısıyla doğru uygulanmasına bağlıdır." },
        { question: "Next.js sitesinde her sayfa statik mi olmalı?", answer: "Hayır. Kalıcı içerikler statik üretime uygundur; isteğe göre değişen veya kişisel veri kullanan sayfalar sunucu tarafında üretilebilir. Seçim sayfanın veri ve güncellik ihtiyacına göre yapılmalıdır." },
        { question: "Core Web Vitals doğrudan sıralamayı garanti eder mi?", answer: "Hayır. İyi sayfa deneyimi önemlidir ancak içerik kalitesi, arama niyeti ve otoriteyle birlikte değerlendirilir. Performans tek başına sıralama garantisi değildir." },
      ],
      relatedService: { href: "/services/nextjs-development", label: "Next.js geliştirme hizmetini inceleyin" },
    },
    en: {
      slug: "nextjs-seo-performance-guide",
      category: "Next.js",
      title: "Building SEO and performance together with Next.js",
      excerpt: "A technical guide to rendering, metadata, Core Web Vitals, images, and JavaScript budgets for fast, crawlable Next.js websites.",
      seo: {
        title: "Next.js SEO and Performance Guide",
        description: "Build stronger Next.js SEO with correct rendering, metadata, structured data, Core Web Vitals, image optimization and release checks.",
        keywords: ["Next.js SEO", "Next.js performance", "Core Web Vitals", "Next.js development", "technical SEO"],
      },
      readingTime: "9 min read",
      sections: [
        {
          heading: "Why is rendering part of the SEO decision?",
          paragraphs: [
            "Next.js does not create rankings by itself; the way content is produced and delivered still matters. Stable marketing pages can often be generated statically for fast, cacheable output. Pages that depend on a request or changing data can render on the server. Moving everything to the client may delay meaningful content and ship JavaScript that the visitor never needed.",
            "Choose the strategy per page. A product catalog may revalidate around its update cycle, while an administration screen should remain outside search. Canonicals, language variants, and sitemaps do not become correct just because a route exists. Generate them from the same content inventory so that publishing a new page also updates its discovery and localization signals.",
          ],
          bullets: ["Static output for stable content", "Server rendering for request-time data", "Client components limited to interaction", "Noindex boundaries for private areas"],
        },
        {
          heading: "How should metadata and structured data work?",
          paragraphs: [
            "Every indexable page needs a unique title, description, and self-referencing canonical. On multilingual sites, each version should identify itself and its equivalent with reciprocal hreflang links. Open Graph images improve sharing but do not guarantee a particular search appearance. Metadata should match the visible search intent and avoid promises the page does not support.",
            "Structured data clarifies the type and relationships of content. Organization, Service, Article, Breadcrumb, and visible FAQ data can be represented with JSON-LD when appropriate. Fabricated ratings, hidden questions, or unverifiable business claims are not optimization. Stable entity identifiers help pages, services, authors, and publishers form a consistent graph.",
          ],
          bullets: ["Unique titles and descriptions", "Self-referencing canonicals", "Reciprocal hreflang", "JSON-LD matching visible content", "Crawlable social images"],
        },
        {
          heading: "How do you protect Core Web Vitals?",
          paragraphs: [
            "Largest Contentful Paint depends on delivering the main content and visual without avoidable delay. Correct hero image sizing, controlled font loading, and delayed third-party scripts can help. Cumulative Layout Shift improves when media dimensions reserve space and late banners do not push the page around. Interaction to Next Paint is sensitive to long work on the browser's main thread.",
            "Lab tools provide quick feedback during development, while field data represents real devices and networks. Avoid chasing one Lighthouse score; observe important templates such as the home page, service pages, and forms separately. A performance budget limits JavaScript, images, and fonts so that new features cannot silently make the experience heavier.",
          ],
          bullets: ["Correct priority for the main image", "Reserved media dimensions", "Limited client JavaScript", "Real-user measurement", "Template-level performance budgets"],
        },
        {
          heading: "What should be checked before launch?",
          paragraphs: [
            "A successful production build is not the final SEO check. Inspect the rendered source for title, description, canonical, hreflang, and JSON-LD. Robots and sitemap output must use the production domain. Broken links, incorrect redirects, and error pages returning a successful status reduce crawl quality. Mobile navigation and keyboard access are also part of the real page experience.",
            "After launch, submit the sitemap in Search Console, inspect important URLs, and monitor indexing. Search performance needs queries, impressions, clicks, and on-site conversions to be read together. Once technical barriers are removed, useful content, real references, and brand authority built over time become the main drivers of sustainable growth.",
          ],
          bullets: ["Rendered production HTML", "Robots and sitemap validation", "Links and status codes", "Mobile usability", "Search Console monitoring"],
        },
      ],
      faqs: [
        { question: "Does Next.js automatically improve SEO?", answer: "No. Next.js provides rendering, metadata, and performance tools; results depend on applying them correctly to the content and route architecture." },
        { question: "Should every Next.js page be static?", answer: "No. Stable content is a good fit for static generation, while request-specific or private data may need server rendering. Choose based on the page's data and freshness requirements." },
        { question: "Do Core Web Vitals guarantee rankings?", answer: "No. Page experience matters, but it is considered alongside content quality, intent, and authority. Performance alone cannot guarantee a ranking." },
      ],
      relatedService: { href: "/services/nextjs-development", label: "Explore Next.js development" },
    },
  },
  "website-vs-web-app": {
    tr: {
      slug: "web-sitesi-ve-web-uygulamasi-farki",
      category: "Dijital ürün",
      title: "Web sitesi ve web uygulaması arasındaki fark",
      excerpt: "İçerik sunan web sitesi ile kullanıcı işlemlerini yöneten web uygulamasını amaç, kapsam, teknoloji, güvenlik ve bütçe açısından karşılaştırın.",
      seo: {
        title: "Web Sitesi ve Web Uygulaması Farkı",
        description: "Web sitesi ile web uygulaması arasındaki farkları; kullanıcı işlemleri, veri, güvenlik, geliştirme süreci ve maliyet üzerinden karşılaştırın.",
        keywords: ["web sitesi ve web uygulaması farkı", "web uygulaması nedir", "kurumsal web sitesi", "web uygulama geliştirme", "SaaS geliştirme"],
      },
      readingTime: "7 dakika",
      sections: [
        {
          heading: "Temel fark: içerik mi, işlem mi?",
          paragraphs: [
            "Kurumsal web sitesi bir markayı, hizmeti veya bilgiyi anlaşılır biçimde sunar. Ziyaretçinin içeriği keşfetmesi, güven oluşturması ve iletişim ya da teklif gibi bir aksiyona geçmesi hedeflenir. Yönetim tarafı çoğunlukla sayfa ve içerik güncellemelerine odaklanır. Formlar ve basit hesaplamalar bulunabilir; ancak ürünün ana değeri bilgi sunumu ve iletişimdir.",
            "Web uygulamasında kullanıcı sistem içinde iş yapar. Hesap açar, veri oluşturur, sipariş yönetir, rapor alır, ödeme yapar veya ekip arkadaşlarıyla aynı süreci yürütür. Rol, yetki, durum değişikliği ve kalıcı veri ürünün temelidir. Bu nedenle arayüz tasarımı kadar iş kuralları, güvenlik, veri modeli ve hata senaryoları da kapsamın merkezinde yer alır.",
          ],
          bullets: ["Web sitesi: anlatım ve dönüşüm", "Web uygulaması: işlem ve veri", "Ortak alan: erişilebilir, hızlı arayüz", "Farklı alan: yetki ve iş kuralları"],
        },
        {
          heading: "Kapsam ve ekip nasıl değişir?",
          paragraphs: [
            "Web sitesi projelerinde strateji, bilgi mimarisi, içerik, görsel yön, responsive tasarım ve teknik SEO önemli ağırlık taşır. İçerik modeli ve yayın süreci doğru kurulduğunda pazarlama ekibi yeni sayfaları yönetebilir. Geliştirme karmaşıklığı entegrasyonlara göre artsa da kullanıcı rolleri ve veri işlemleri genellikle sınırlıdır.",
            "Web uygulaması ise ürün keşfi, kullanıcı akışları, veri modeli, API, kimlik doğrulama, yetkilendirme, test ve operasyon izleme gerektirir. Tasarım kararları gerçek görev tamamlama süreleri ve hata riski üzerinden değerlendirilir. Ürün yöneticisi, tasarımcı ve geliştiricinin aynı iş kuralları üzerinde anlaşması önemlidir; küçük bir belirsizlik birçok ekranı etkileyebilir.",
          ],
          bullets: ["Web sitesi için içerik ve marka odağı", "Web uygulaması için ürün ve operasyon odağı", "Entegrasyonların kapsam etkisi", "Test ve izleme gereksinimi"],
        },
        {
          heading: "Güvenlik ve bakım neden farklıdır?",
          paragraphs: [
            "Web sitesinde güvenli form işleme, içerik yönetimi erişimi, bağımlılık güncellemeleri ve barındırma güvenliği temel ihtiyaçlardır. Kişisel veri toplanıyorsa saklama süresi ve erişim sınırları açık olmalıdır. Saldırı yüzeyi çoğunlukla daha küçüktür; yine de güncellenmeyen eklentiler, açık yönetim panelleri veya kontrolsüz formlar ciddi risk yaratabilir.",
            "Web uygulaması kullanıcı hesapları ve iş verisi taşıdığı için ayrıntılı yetkilendirme, oturum güvenliği, denetim kayıtları, yedekleme ve veri bütünlüğü ister. Bakım yalnızca arayüz güncellemesi değildir; altyapı, veritabanı, entegrasyonlar ve güvenlik olayları izlenir. Yeni özelliklerin mevcut veriye etkisi göç planlarıyla yönetilmelidir.",
          ],
          bullets: ["Kimlik doğrulama ve oturum", "Rol ve kaynak bazlı yetki", "Denetim kayıtları", "Yedekleme ve geri dönüş", "Veri göçleri"],
        },
        {
          heading: "Hangi çözüme ihtiyacınız olduğunu nasıl anlarsınız?",
          paragraphs: [
            "Ana hedef hizmetlerinizi anlatmak, organik görünürlük kazanmak ve nitelikli talep toplamaksa kurumsal web sitesi doğru başlangıçtır. Kullanıcıların giriş yapıp veri yönettiği, ekibin operasyon yürüttüğü veya müşteriye özel çıktı üreten bir sistem gerekiyorsa web uygulaması kapsamına yaklaşırsınız. Bazı projeler pazarlama sitesi ve uygulamayı ayrı yüzler olarak birlikte barındırır.",
            "Kararı teknoloji adıyla değil, yapılacak işlerle verin. Kullanıcı kimdir, hangi veriyi görür, hangi işlemi tamamlar, hata olursa ne olur ve başarı nasıl ölçülür sorularını yazın. Bu cevaplar içerik sistemi mi yoksa ürün mimarisi mi gerektiğini gösterir. Sınır doğru çizildiğinde teklifleri karşılaştırmak ve ilk sürümü planlamak kolaylaşır.",
          ],
          bullets: ["Kullanıcı girişi gerekiyor mu?", "Kalıcı iş verisi tutuluyor mu?", "Rol ve onay akışı var mı?", "Sistem sonuç veya rapor üretiyor mu?", "Ana hedef bilgi ve talep toplamak mı?"],
        },
      ],
      faqs: [
        { question: "E-ticaret sitesi web uygulaması mıdır?", answer: "Ürün, sepet, ödeme, kullanıcı hesabı ve sipariş yönetimi içerdiği için e-ticaret sistemi web uygulaması özellikleri taşır; aynı zamanda arama görünürlüğü için güçlü içerik sayfalarına ihtiyaç duyar." },
        { question: "Kurumsal web sitesi sonradan uygulamaya dönüşebilir mi?", answer: "Evet, ancak veri modeli, kullanıcı rolleri ve altyapı gereksinimleri değişeceği için bu yalnızca birkaç ekran eklemek olmayabilir. Gelecek planı baştan bilmek mimari kararları iyileştirir." },
        { question: "Web uygulaması için mobil uygulama da gerekir mi?", answer: "Her zaman gerekmez. Responsive bir web uygulaması birçok kullanım senaryosunu karşılayabilir. Donanım entegrasyonu, yoğun çevrimdışı kullanım veya mağaza dağıtımı gerekiyorsa mobil uygulama ayrıca değerlendirilir." },
      ],
      relatedService: { href: "/services/web-application-development", label: "Web uygulaması geliştirme hizmetini inceleyin" },
    },
    en: {
      slug: "website-vs-web-application",
      category: "Digital products",
      title: "The difference between a website and a web application",
      excerpt: "Compare content-led websites and transactional web applications across purpose, scope, technology, security, maintenance, and budget.",
      seo: {
        title: "Website vs Web Application: Key Differences",
        description: "Compare websites and web applications through user actions, data, security, development scope, maintenance and business goals.",
        keywords: ["website vs web application", "what is a web application", "corporate website", "web application development", "SaaS development"],
      },
      readingTime: "7 min read",
      sections: [
        {
          heading: "The basic difference: content or transactions?",
          paragraphs: [
            "A corporate website presents a brand, service, or body of information clearly. Visitors explore content, build confidence, and move toward an action such as an inquiry or quote. Administration usually focuses on publishing pages and updating content. Forms and simple calculators may exist, but the central value is communication and discovery.",
            "In a web application, people perform work inside the system. They create accounts, manage data, place orders, produce reports, make payments, or run a shared workflow. Roles, permissions, state changes, and persistent data are central to the product. Business rules, security, data design, and failure scenarios therefore matter as much as the interface.",
          ],
          bullets: ["Website: communication and conversion", "Web application: transactions and data", "Shared need: accessible, fast interfaces", "Distinct need: permissions and business rules"],
        },
        {
          heading: "How do scope and team needs change?",
          paragraphs: [
            "Website projects emphasize strategy, information architecture, content, visual direction, responsive design, and technical SEO. With the right content model, a marketing team can manage new pages after launch. Integrations may add complexity, but user roles and data operations are usually limited compared with a software product.",
            "A web application needs product discovery, user journeys, data modeling, APIs, authentication, authorization, testing, and operational monitoring. Design decisions are evaluated through task completion and error risk. Product, design, and engineering need a shared understanding of business rules because one ambiguous rule can affect many screens and data states.",
          ],
          bullets: ["Content and brand focus for websites", "Product and operations focus for applications", "Integration impact on scope", "Testing and monitoring needs"],
        },
        {
          heading: "Why are security and maintenance different?",
          paragraphs: [
            "A website still needs secure form handling, protected content administration, dependency updates, and sound hosting. If it collects personal information, retention and access boundaries should be clear. The attack surface may be smaller, but abandoned plugins, exposed admin tools, and uncontrolled forms can create serious risk.",
            "A web application holds accounts and business data, so it needs detailed authorization, secure sessions, audit records, backups, and data-integrity controls. Maintenance includes infrastructure, databases, integrations, and security events as well as the interface. New features may also require planned migrations so existing records remain correct.",
          ],
          bullets: ["Authentication and sessions", "Role and resource authorization", "Audit records", "Backups and recovery", "Data migrations"],
        },
        {
          heading: "How do you know which one you need?",
          paragraphs: [
            "If the main goal is to explain services, gain organic visibility, and collect qualified inquiries, a corporate website is the right starting point. If users need to sign in, manage records, run operations, or receive personalized output, the scope is moving toward a web application. Some businesses use both: a public marketing site and a separate application experience.",
            "Choose from the work to be done rather than a technology label. Write down who the user is, what data they see, which task they complete, what happens when it fails, and how success is measured. Those answers reveal whether you need a publishing system or a product architecture. A clear boundary makes proposals easier to compare and the first release easier to plan.",
          ],
          bullets: ["Is sign-in required?", "Is persistent business data stored?", "Are roles and approvals involved?", "Does the system generate results or reports?", "Is the main goal information and inquiries?"],
        },
      ],
      faqs: [
        { question: "Is an ecommerce site a web application?", answer: "With products, carts, payments, accounts, and order management, ecommerce has web-application characteristics. It also needs strong public content for search visibility." },
        { question: "Can a corporate website become an application later?", answer: "Yes, but adding data models, roles, and application infrastructure may be more than adding a few screens. Knowing the future direction early improves architecture decisions." },
        { question: "Does a web application also need a mobile app?", answer: "Not always. A responsive web application covers many scenarios. Native mobile becomes more relevant for device integrations, heavy offline use, or app-store distribution." },
      ],
      relatedService: { href: "/services/web-application-development", label: "Explore web application development" },
    },
  },
} as const satisfies Record<BlogPostKey, Record<Locale, Omit<BlogPost, "key" | "publishedAt" | "modifiedAt">>>

export function getBlogPosts(locale: Locale): BlogPost[] {
  return blogPostKeys.map((key) => ({
    key,
    ...posts[key][locale],
    publishedAt: releaseDate,
    modifiedAt: releaseDate,
  }))
}

export function getBlogPostBySlug(slug: string, locale: Locale): BlogPost | undefined {
  return getBlogPosts(locale).find((post) => post.slug === slug)
}

export function getBlogPostPaths() {
  return blogPostKeys.map((key) => ({
    key,
    tr: `/blog/${posts[key].tr.slug}`,
    en: `/blog/${posts[key].en.slug}`,
    lastModified: releaseDate,
  }))
}

