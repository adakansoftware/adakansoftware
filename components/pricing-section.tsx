import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { withLocale, type Locale } from "@/lib/i18n"

type PricingItem = { name: string; price: string; note: string; features: string[]; featured?: boolean; href?: string; priceNote: string }
type PricingFAQ = { question: string; answer: string }
type PricingGroup = { id: "logo" | "web" | "yazilim"; title: string; description: string; cta: string; faqTitle: string; faqs: PricingFAQ[]; items: PricingItem[] }
type PricingCopy = { eyebrow: string; title: string; gradient: string; description: string; cta: string; faqTitle: string; faqs: PricingFAQ[]; items: PricingItem[]; groups: PricingGroup[] }

export const pricing: Record<Locale, PricingCopy> = {
  tr: {
    eyebrow: "Net kapsam, net yatırım",
    title: "Kapsamı belli.",
    gradient: "Başlangıcı net.",
    description: "Logo tasarımı, tek seferlik web sitesi projeleri ve kurulum + aylık bakım modeliyle yazılım ürünleri. Her hizmetin kapsamını ayrı inceleyin.",
    cta: "Paketleri incele",
    faqTitle: "Sık sorulan sorular",
    faqs: [
      { question: "Logo paketlerinde ne teslim edilir?", answer: "Yalnızca logo tasarlanır. Konsept, revizyon ve dosya kapsamı seçilen pakete göre değişir; kurumsal kimlik çalışması dahil değildir." },
      { question: "Web sitesi ödemesi ve desteği nasıl işler?", answer: "Ödeme %40 başlangıçta, %30 tasarım onayında, %30 yayında yapılır. İlk ay hata düzeltme dahildir; yeni özellikler ve isteğe bağlı aylık bakım ayrıca değerlendirilir." },
      { question: "Yazılım ürünleri nasıl fiyatlanır?", answer: "CRM, ERP Lite ve TableFlow için kurulum bedeli ve aylık bakım ayrı teklif edilir. ERP Lite yakında; TableFlow adisyon ve sipariş arayüzü pilot aşamasındadır." },
    ],
    items: [
      { name: "Logo tasarımı", price: "₺2.500’den", note: "Sadece logo", priceNote: "başlayan fiyatlarla", features: ["Temel, Standart ve Premium paketler", "Konsept ve revizyon kapsamı belli", "SVG + PNG teslimi"], href: "/pricing/logo" },
      { name: "Web siteleri", price: "₺15.000’den", note: "Tek seferlik proje", priceNote: "başlayan fiyatlarla", features: ["Başlangıç, Profesyonel, Premium", "Her pakette SEO; seviyeye göre kapsam", "2 revizyon turu ve ilk ay hata düzeltme"], featured: true, href: "/pricing/web" },
      { name: "Yazılım ürünleri", price: "Teklif alın", note: "Kurulum + aylık bakım", priceNote: "kapsama göre teklif", features: ["CRM", "ERP Lite — yakında", "TableFlow — adisyon ve sipariş arayüzü (pilot)"], href: "/pricing/yazilim" },
    ],
    groups: [
      {
        id: "logo", title: "Logo tasarımı", cta: "Logo için teklif alın", faqTitle: "Logo tasarımı hakkında",
        description: "Yalnızca logo tasarımı. Kartvizit, antetli kağıt, sosyal medya şablonu, renk/tipografi sistemi ve marka rehberi dahil değildir.",
        items: [
          { name: "Temel", price: "₺2.500’den", note: "", priceNote: "başlayan fiyatlarla", features: ["1 konsept", "2 revizyon turu", "Açık/koyu versiyon", "SVG + PNG"] },
          { name: "Standart", price: "₺4.000’den", note: "", priceNote: "başlayan fiyatlarla", features: ["2 konsept", "2 revizyon turu", "Açık/koyu versiyon ve yatay varyasyon", "SVG + PNG"] },
          { name: "Premium", price: "₺5.000’den", note: "", priceNote: "başlayan fiyatlarla", features: ["3 konsept", "3 revizyon turu", "Yatay/dikey/ikon varyasyonları", "SVG + PNG ve kaynak dosya"] },
        ],
        faqs: [
          { question: "Kaç revizyon yapılır?", answer: "Temel ve Standart paketlerde 2, Premium pakette 3 revizyon turu vardır. Her pakette seçilen tek logo tamamlanır. Geri bildirimler her turda birlikte değerlendirilir; ek turlar ayrıca teklif edilir." },
          { question: "Paketler neleri kapsamaz?", answer: "Kartvizit, antetli kağıt, sosyal medya şablonu, renk/tipografi sistemi ve marka rehberi kapsam dışıdır. Teslim, seçilen paketin logo dosyaları ve varyasyonlarıyla sınırlıdır." },
        ],
      },
      {
        id: "web", title: "Web siteleri", cta: "Web sitesi için teklif alın", faqTitle: "Web sitesi paketleri hakkında",
        description: "Aynı web sitesi hizmeti için üç bütçe ve kapsam seviyesi. Her pakette SEO bulunur; içerik yönetimi, dil sayısı, işlevler ve SEO çalışmasının kapsamı seviyeye göre değişir. Tek seferlik proje bedeli; her pakette 2 revizyon turu. İçerik, fotoğraf, alan adı ve hosting müşteriye aittir; aylık bakım opsiyoneldir.",
        items: [
          { name: "Başlangıç", price: "₺15.000’den", note: "", priceNote: "başlayan fiyatlarla", features: ["4–5 sayfa", "İletişim formu", "Responsive tasarım", "Yönetim paneli yok", "Temel SEO: sayfa başlığı, meta açıklama, sitemap ve robots.txt"] },
          { name: "Profesyonel", price: "₺25.000’den", note: "", priceNote: "başlayan fiyatlarla", features: ["Responsive içerik sayfaları", "İletişim ve teklif formu", "Yönetim paneli", "Başlangıç SEO kapsamının tamamı", "Sayfa bazlı anahtar kelime eşlemesi ve başlık hiyerarşisi", "İç bağlantılar ve uygun yapılandırılmış veri"], featured: true },
          { name: "Premium", price: "₺40.000’den", note: "", priceNote: "başlayan fiyatlarla", features: ["Profesyonel paketin tüm kapsamı", "TR/EN çift dil", "1 gelişmiş form akışı (örn. randevu talebi)", "Akışın yönetim paneline bağlanması", "Profesyonel SEO kapsamı + TR/EN dil eşlemesi (hreflang)", "Yönlendirme, canonical ve taranabilirlik denetimi"] },
        ],
        faqs: [
          { question: "Paketler neye göre ayrılıyor?", answer: "Başlangıç temel tanıtım ve iletişim ihtiyaçlarına, Profesyonel içerik yönetimi ve teklif toplamaya, Premium çift dil ve ek form akışına yöneliktir. Bunlar farklı site türleri değil, bütçe ve kapsam seviyeleridir. Premium akışının kapsamı teklif öncesinde netleştirilir; CRM, ERP ve ürün geliştirme ayrı teklif edilir." },
          { question: "SEO paketlere göre nasıl değişiyor?", answer: "Başlangıç: teslim kapsamındaki sayfaların başlıkları, meta açıklamaları, sitemap ve robots.txt. Profesyonel: bunlara ek sayfa bazlı anahtar kelime eşlemesi, başlık hiyerarşisi, iç bağlantılar ve uygun yapılandırılmış veri. Premium: tüm bunlara ek TR/EN hreflang eşlemesi ve yayın öncesi yönlendirme, canonical ve taranabilirlik denetimi. Çalışma proje teslim kapsamındadır; sürekli içerik üretimi ve aylık SEO takibi ayrıca planlanır." },
          { question: "Ödeme planı ve revizyon sınırı nedir?", answer: "Ödeme %40 başlangıç, %30 tasarım onayı, %30 yayın şeklindedir. Her web sitesi paketinde 2 revizyon turu bulunur." },
          { question: "İlk ay destek neleri kapsar?", answer: "Yayın sonrası ilk ay kapsam içi hata düzeltme dahildir; yeni özellik geliştirme dahil değildir. Aylık bakım isteğe bağlıdır." },
          { question: "İçerik ve işletim giderleri kime ait?", answer: "İçerik, fotoğraf, alan adı ve hosting müşteriye aittir. Bu kalemler web sitesi proje bedeline dahil değildir." },
        ],
      },
      {
        id: "yazilim", title: "Yazılım ürünleri", cta: "Teklif alın", faqTitle: "Yazılım ürünleri hakkında",
        description: "Kurulum bedeli + aylık bakım yapısıyla teklif edilir. Kurulum veri aktarımı, kullanıcı/rol tanımı ve eğitimi; aylık bakım barındırma, yedekleme ve hata düzeltmeyi kapsar.",
        items: [
          { name: "CRM", price: "Teklif alın", note: "Kurulum + aylık bakım", priceNote: "kapsama göre teklif", features: ["Veri aktarımı", "Kullanıcı/rol tanımı ve eğitim", "Aylık barındırma ve yedekleme", "Hata düzeltme"] },
          { name: "ERP Lite", price: "Teklif alın", note: "Yakında — demo hazır değil", priceNote: "kurulum + aylık bakım", features: ["Yakında", "Demo henüz hazır değil", "Kurulum kapsamı için ön görüşme", "Aylık bakım kapsamı için ön görüşme"] },
          { name: "TableFlow", price: "Teklif alın", note: "Adisyon ve sipariş arayüzü (pilot)", priceNote: "kurulum + aylık bakım", features: ["Adisyon ve sipariş arayüzü (pilot)", "Veri aktarımı ve kullanıcı/rol tanımı", "Eğitim", "Aylık barındırma, yedekleme ve hata düzeltme"] },
        ],
        faqs: [
          { question: "Kurulum ve aylık bakım nasıl ayrılır?", answer: "Kurulum tek seferliktir: veri aktarımı, kullanıcı/rol tanımı ve eğitim. Aylık bakım barındırma, yedekleme ve hata düzeltmeyi kapsar. İki bedel teklifte ayrı gösterilir." },
          { question: "Yeni özellikler aylık bakıma dahil mi?", answer: "Yeni özellik ve ek entegrasyonlar bakım kapsamına dahil değildir; ayrı kapsam ve teklif gerektirir." },
          { question: "Ürünlerin demo durumu nedir?", answer: "TableFlow adisyon ve sipariş arayüzü pilot aşamasındadır. ERP Lite yakında; demosu henüz hazır değildir. CRM için kapsam görüşmesiyle ilerlenir." },
        ],
      },
    ],
  },
  en: {
    eyebrow: "Clear scope, clear investment", title: "Clear scope.", gradient: "A clear starting point.",
    description: "Explore logo design, one-off website projects and software products with setup and monthly maintenance separately.",
    cta: "View packages", faqTitle: "Frequently asked questions",
    faqs: [
      { question: "What do logo packages deliver?", answer: "Logo design only. Concepts, revision rounds and files depend on the selected package; a corporate identity service is not included." },
      { question: "How do website payments and support work?", answer: "40% at the start, 30% at design approval and 30% at launch. First-month bug fixes are included; new features and optional monthly maintenance are separate." },
      { question: "How are software products priced?", answer: "CRM, ERP Lite and TableFlow have separate setup and monthly maintenance quotes. ERP Lite is coming soon; TableFlow is a bill and order interface pilot." },
    ],
    items: [
      { name: "Logo design", price: "From ₺2,500", note: "Logo only", priceNote: "starting price", features: ["Basic, Standard and Premium packages", "Defined concepts and revision rounds", "SVG + PNG delivery"], href: "/pricing/logo" },
      { name: "Websites", price: "From ₺15,000", note: "One-off project", priceNote: "starting price", features: ["Starter, Professional, Premium", "SEO in every tier, with different scope", "2 revision rounds and first-month bug fixes"], featured: true, href: "/pricing/web" },
      { name: "Software products", price: "Request a quote", note: "Setup + monthly maintenance", priceNote: "quoted by scope", features: ["CRM", "ERP Lite — coming soon", "TableFlow — bill and order interface (pilot)"], href: "/pricing/yazilim" },
    ],
    groups: [
      {
        id: "logo", title: "Logo design", cta: "Request a logo quote", faqTitle: "About logo packages",
        description: "Logo design only. Business cards, letterheads, social media templates, a color/typography system and a brand guide are not included.",
        items: [
          { name: "Basic", price: "From ₺2,500", note: "", priceNote: "starting price", features: ["1 concept", "2 revision rounds", "Light/dark versions", "SVG + PNG"] },
          { name: "Standard", price: "From ₺4,000", note: "", priceNote: "starting price", features: ["2 concepts", "2 revision rounds", "Light/dark versions and horizontal variation", "SVG + PNG"] },
          { name: "Premium", price: "From ₺5,000", note: "", priceNote: "starting price", features: ["3 concepts", "3 revision rounds", "Horizontal/vertical/icon variations", "SVG + PNG and source file"] },
        ],
        faqs: [
          { question: "How many revision rounds are included?", answer: "Basic and Standard include 2 rounds; Premium includes 3. One selected logo is finalized in each package. Feedback is consolidated in each round. Extra rounds are quoted separately." },
          { question: "What is excluded?", answer: "Business cards, letterheads, social media templates, a color/typography system and a brand guide are excluded. Delivery is limited to the selected package's logo files and variations." },
        ],
      },
      {
        id: "web", title: "Websites", cta: "Request a website quote", faqTitle: "About website packages",
        description: "Three budget and scope levels for the same website service, with SEO included in every tier. Content management, languages, functionality and SEO scope vary by tier. One-off project fees with 2 revision rounds. Content, photos, domain and hosting are supplied and paid for by the client. Monthly maintenance is optional.",
        items: [
          { name: "Starter", price: "From ₺15,000", note: "", priceNote: "starting price", features: ["4–5 pages", "Contact form", "Responsive design", "No admin panel", "Core SEO: page titles, meta descriptions, sitemap and robots.txt"] },
          { name: "Professional", price: "From ₺25,000", note: "", priceNote: "starting price", features: ["Responsive content pages", "Contact and quote request forms", "Admin panel", "All Starter SEO deliverables", "Page-level keyword mapping and heading hierarchy", "Internal links and relevant structured data"], featured: true },
          { name: "Premium", price: "From ₺40,000", note: "", priceNote: "starting price", features: ["Everything in Professional", "TR/EN bilingual content", "1 advanced form flow (e.g. a booking request)", "Flow connected to the admin panel", "Professional SEO scope + TR/EN language mapping (hreflang)", "Redirect, canonical and crawlability audit"] },
        ],
        faqs: [
          { question: "How do the tiers differ?", answer: "Starter covers essential information and contact needs; Professional adds content management and quote collection; Premium adds a second language and an extra form flow. These are budget and scope levels, not different website types. The Premium flow is scoped before the quote; CRM, ERP and product development are quoted separately." },
          { question: "How does SEO differ by tier?", answer: "Starter covers titles and meta descriptions for the included pages, a sitemap and robots.txt. Professional adds page-level keyword mapping, heading hierarchy, internal links and relevant structured data. Premium also includes TR/EN hreflang mapping and a pre-launch redirect, canonical and crawlability audit. These are project deliverables; ongoing content creation and monthly SEO monitoring are planned separately." },
          { question: "What are the payment terms and revision limits?", answer: "40% at the start, 30% at design approval and 30% at launch. Every website package includes 2 revision rounds." },
          { question: "What does first-month support cover?", answer: "In-scope bug fixes are included for the first month after launch. New features are excluded. Monthly maintenance is optional." },
          { question: "Who provides content and pays running costs?", answer: "The client provides content and photos and pays for the domain and hosting. These are not included in the website project fee." },
        ],
      },
      {
        id: "yazilim", title: "Software products", cta: "Request a quote", faqTitle: "About software products",
        description: "Quoted as setup plus monthly maintenance. Setup covers data migration, user/role configuration and training. Monthly maintenance covers hosting, backups and bug fixes.",
        items: [
          { name: "CRM", price: "Request a quote", note: "Setup + monthly maintenance", priceNote: "quoted by scope", features: ["Data migration", "User/role configuration and training", "Monthly hosting and backups", "Bug fixes"] },
          { name: "ERP Lite", price: "Request a quote", note: "Coming soon — demo not ready", priceNote: "setup + monthly maintenance", features: ["Coming soon", "Demo not ready yet", "Setup scope discovery", "Monthly maintenance scope discovery"] },
          { name: "TableFlow", price: "Request a quote", note: "Bill and order interface (pilot)", priceNote: "setup + monthly maintenance", features: ["Bill and order interface (pilot)", "Data migration and user/role configuration", "Training", "Monthly hosting, backups and bug fixes"] },
        ],
        faqs: [
          { question: "How are setup and monthly maintenance separated?", answer: "Setup is a one-off fee for data migration, user/role configuration and training. Monthly maintenance covers hosting, backups and bug fixes. The quote lists both fees separately." },
          { question: "Are new features part of monthly maintenance?", answer: "New features and additional integrations are not included in maintenance. They require a separate scope and quote." },
          { question: "Are the product demos ready?", answer: "TableFlow is a bill and order interface pilot. ERP Lite is coming soon and its demo is not ready. CRM starts with a scope discussion." },
        ],
      },
    ],
  },
}

export function PricingSection({ locale, category }: { locale: Locale; category?: PricingGroup["id"] }) {
  const copy = pricing[locale]
  const sections = category ? copy.groups.filter(group => group.id === category) : [{ ...copy, id: "pricing", title: `${copy.title} ${copy.gradient}` }]

  return <>{sections.map((section, index) => (
    <section key={section.id} id={section.id} className="studio-section studio-soft">
      <div className="studio-container">
        <h2>{section.title}</h2>
        <p className="studio-section-description">{section.description}{category && index === 0 && copy.groups.map((group) => <span key={group.id}> · <Link className="studio-link" href={withLocale(`/pricing/${group.id}`, locale)}>{group.title}</Link></span>)}</p>
        <div className="studio-pricing">{section.items.map(item => (
          <article key={item.name} className={"studio-price-card" + (item.featured ? " studio-price-featured" : "")}>
            {item.note && <p className="studio-price-note">{item.note}</p>}
            <h3>{item.name}</h3>
            <p className="studio-price">{item.price}</p>
            <p className="studio-price-note">{item.priceNote}</p>
            <ul>{item.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
            <Link className="studio-link" href={withLocale(item.href ?? "/contact", locale)}>{section.cta}<ArrowRight size={16} /></Link>
          </article>
        ))}</div>
        <div className="mt-16 max-w-3xl">
          <h3>{section.faqTitle}</h3>
          <div className="mt-6 space-y-4">{section.faqs.map(faq => <details key={faq.question} className="studio-price-card"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p></details>)}</div>
        </div>
      </div>
    </section>
  ))}</>
}
