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
      { name: "Logo tasarımı", price: "2.500–8.000 TL", note: "Sadece logo", priceNote: "paket aralığı", features: ["Temel ve Genişletilmiş paketler", "Konsept ve revizyon kapsamı belli", "SVG + PNG teslimi"], href: "/pricing#logo" },
      { name: "Web siteleri", price: "15.000–40.000 TL", note: "Tek seferlik proje", priceNote: "paket fiyatları", features: ["Vitrin, Kurumsal, Randevulu site", "2 revizyon turu", "İlk ay hata düzeltme dahil"], featured: true, href: "/pricing#web" },
      { name: "Yazılım ürünleri", price: "Teklif alın", note: "Kurulum + aylık bakım", priceNote: "kapsama göre teklif", features: ["CRM", "ERP Lite — yakında", "TableFlow — adisyon ve sipariş arayüzü (pilot)"], href: "/pricing#yazilim" },
    ],
    groups: [
      {
        id: "logo", title: "Logo tasarımı", cta: "Logo için teklif alın", faqTitle: "Logo tasarımı hakkında",
        description: "Yalnızca logo tasarımı. Kartvizit, antetli kağıt, sosyal medya şablonu, renk/tipografi sistemi ve marka rehberi dahil değildir.",
        items: [
          { name: "Temel", price: "2.500–4.000 TL", note: "Logo tasarımı", priceNote: "paket fiyat aralığı", features: ["1 konsept", "2 revizyon turu", "Açık/koyu versiyon", "SVG + PNG"] },
          { name: "Genişletilmiş", price: "5.000–8.000 TL", note: "Logo tasarımı", priceNote: "paket fiyat aralığı", features: ["3 konsept", "3 revizyon turu", "Yatay/dikey/ikon varyasyonları", "SVG + PNG ve kaynak dosya"] },
        ],
        faqs: [
          { question: "Kaç revizyon yapılır?", answer: "Temel pakette 2, Genişletilmiş pakette 3 revizyon turu vardır. Geri bildirimler her turda birlikte değerlendirilir; ek turlar ayrıca teklif edilir." },
          { question: "Paketler neleri kapsamaz?", answer: "Kartvizit, antetli kağıt, sosyal medya şablonu, renk/tipografi sistemi ve marka rehberi kapsam dışıdır. Teslim, seçilen paketin logo dosyaları ve varyasyonlarıyla sınırlıdır." },
        ],
      },
      {
        id: "web", title: "Web siteleri", cta: "Web sitesi için teklif alın", faqTitle: "Web sitesi paketleri hakkında",
        description: "Tek seferlik web sitesi projeleri. Tüm paketlerde 2 revizyon turu bulunur. İçerik, fotoğraf, alan adı ve hosting müşteriye aittir; aylık bakım opsiyoneldir.",
        items: [
          { name: "Vitrin", price: "15.000–20.000 TL", note: "Tek seferlik proje", priceNote: "proje bedeli", features: ["4–5 sayfa", "İletişim formu", "Responsive tasarım", "Yönetim paneli yok"] },
          { name: "Kurumsal", price: "25.000 TL", note: "Tek seferlik proje", priceNote: "proje bedeli", features: ["Kurumsal sayfalar", "Teklif formu", "Yönetim paneli", "SEO temeli"], featured: true },
          { name: "Randevulu site", price: "40.000 TL", note: "Tek seferlik proje", priceNote: "proje bedeli", features: ["Randevu akışı", "Yönetim paneli", "TR/EN"] },
        ],
        faqs: [
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
      { name: "Logo design", price: "2,500–8,000 TRY", note: "Logo only", priceNote: "package range", features: ["Basic and Extended packages", "Defined concepts and revision rounds", "SVG + PNG delivery"], href: "/pricing#logo" },
      { name: "Websites", price: "15,000–40,000 TRY", note: "One-off project", priceNote: "package prices", features: ["Showcase, Corporate, Booking website", "2 revision rounds", "First-month bug fixes included"], featured: true, href: "/pricing#web" },
      { name: "Software products", price: "Request a quote", note: "Setup + monthly maintenance", priceNote: "quoted by scope", features: ["CRM", "ERP Lite — coming soon", "TableFlow — bill and order interface (pilot)"], href: "/pricing#yazilim" },
    ],
    groups: [
      {
        id: "logo", title: "Logo design", cta: "Request a logo quote", faqTitle: "About logo packages",
        description: "Logo design only. Business cards, letterheads, social media templates, a color/typography system and a brand guide are not included.",
        items: [
          { name: "Basic", price: "2,500–4,000 TRY", note: "Logo design", priceNote: "package price range", features: ["1 concept", "2 revision rounds", "Light/dark versions", "SVG + PNG"] },
          { name: "Extended", price: "5,000–8,000 TRY", note: "Logo design", priceNote: "package price range", features: ["3 concepts", "3 revision rounds", "Horizontal/vertical/icon variations", "SVG + PNG and source file"] },
        ],
        faqs: [
          { question: "How many revision rounds are included?", answer: "Basic includes 2 rounds; Extended includes 3. Feedback is consolidated in each round. Extra rounds are quoted separately." },
          { question: "What is excluded?", answer: "Business cards, letterheads, social media templates, a color/typography system and a brand guide are excluded. Delivery is limited to the selected package's logo files and variations." },
        ],
      },
      {
        id: "web", title: "Websites", cta: "Request a website quote", faqTitle: "About website packages",
        description: "One-off website projects with 2 revision rounds. Content, photos, domain and hosting are supplied and paid for by the client. Monthly maintenance is optional.",
        items: [
          { name: "Showcase", price: "15,000–20,000 TRY", note: "One-off project", priceNote: "project fee", features: ["4–5 pages", "Contact form", "Responsive design", "No admin panel"] },
          { name: "Corporate", price: "25,000 TRY", note: "One-off project", priceNote: "project fee", features: ["Corporate pages", "Quote request form", "Admin panel", "SEO foundations"], featured: true },
          { name: "Booking website", price: "40,000 TRY", note: "One-off project", priceNote: "project fee", features: ["Booking flow", "Admin panel", "TR/EN"] },
        ],
        faqs: [
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

export function PricingSection({ locale, overview = false }: { locale: Locale; overview?: boolean }) {
  const copy = pricing[locale]
  const sections = overview ? [{ ...copy, id: "pricing", title: `${copy.title} ${copy.gradient}` }] : copy.groups

  return <>{sections.map((section, index) => (
    <section key={section.id} id={section.id} className="studio-section studio-soft">
      <div className="studio-container">
        <h2>{section.title}</h2>
        <p className="studio-section-description">{section.description}{!overview && index === 0 && copy.groups.map((group) => <span key={group.id}> · <Link className="studio-link" href={`#${group.id}`}>{group.title}</Link></span>)}</p>
        <div className="studio-pricing">{section.items.map(item => (
          <article key={item.name} className={"studio-price-card" + (item.featured ? " studio-price-featured" : "")}>
            <p className="studio-price-note">{item.note}</p>
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
