import type { Locale } from "./i18n.ts"

export const caseStudyKeys = ["z-grup-insaat", "salihogullari-hafriyat"] as const
export type CaseStudyKey = (typeof caseStudyKeys)[number]

type CaseStudy = {
  key: CaseStudyKey
  slug: string
  title: string
  eyebrow: string
  summary: string
  seo: { title: string; description: string; keywords: string[] }
  year: string
  sector: string
  liveUrl: string
  coverImage: string
  logoImage: string
  deliverables: string[]
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>
  faqs: Array<{ question: string; answer: string }>
}

const lastModified = "2026-09-25"

const studies: Record<CaseStudyKey, Record<Locale, CaseStudy>> = {
  "z-grup-insaat": {
    tr: {
      key: "z-grup-insaat", slug: "z-grup-insaat", title: "Z Grup İnşaat web sitesi", eyebrow: "Proje incelemesi · İnşaat ve hafriyat",
      summary: "Hafriyat, temel kazısı ve nakliyat hizmetlerini güçlü bir ilk ekran, açık hizmet yapısı ve erişilebilir teklif kanallarıyla anlatan kurumsal web sitesi.",
      seo: { title: "Z Grup İnşaat Web Sitesi Projesi", description: "Z Grup İnşaat için hazırlanan hafriyat ve inşaat web sitesinin içerik mimarisini, mobil deneyimini, performans ve teklif akışını inceleyin.", keywords: ["inşaat web sitesi", "hafriyat web tasarım", "kurumsal web sitesi projesi", "Z Grup İnşaat", "Next.js web sitesi"] },
      year: "2026", sector: "İnşaat, hafriyat ve nakliyat", liveUrl: "https://zgrupinsaat.vercel.app/", coverImage: "/projects/z-grup-insaat-cover.png", logoImage: "/projects/z-grup-logo.svg",
      deliverables: ["Kurumsal web tasarımı", "Mobil uyumlu arayüz", "Hizmet ve proje bilgi mimarisi", "Teklif ve iletişim akışı", "Teknik SEO temeli", "Performans odaklı frontend"],
      sections: [
        { heading: "İhtiyaç ve sayfa stratejisi", paragraphs: ["Saha hizmeti satın alan ziyaretçiler önce firmanın ne yaptığını, hangi araçlarla çalıştığını ve nasıl teklif alacağını anlamak ister. Sayfa yapısı bu karar sırasına göre hizmetler, filo, projeler ve iletişim noktalarını görünür kılacak biçimde kuruldu.", "Ana mesaj hafriyat, temel kazısı ve nakliyat kapsamını ilk ekranda açıklar. Telefon, WhatsApp ve teklif bağlantıları farklı ziyaretçi tercihlerine cevap verirken aynı hedefte birleşir."], bullets: ["Hizmet kapsamının ilk ekranda anlaşılması", "Filo ve saha kapasitesinin görünür olması", "Telefon, WhatsApp ve teklif yollarının kolay bulunması"] },
        { heading: "Arayüz ve içerik sistemi", paragraphs: ["Kırmızı, siyah ve beyaz marka paleti; geniş tipografi ve saha görselleriyle birlikte kullanıldı. Bölümler kısa başlıklar, açıklayıcı metinler ve tekrarlanan aksiyonlarla okunabilir bir ritim oluşturur.", "Masaüstündeki güçlü görsel hiyerarşi mobilde daha kısa satırlar ve dokunması kolay kontrollerle korunur. Böylece içerik yalnızca vitrin olarak kalmaz; farklı ekranlarda kullanılabilir bir kurumsal iletişim aracına dönüşür."] },
        { heading: "Teknik teslim kapsamı", paragraphs: ["Sayfa bileşenleri yeniden kullanılabilir bir yapıda geliştirildi. Görsel boyutları, başlık sırası, bağlantı adları ve sayfa meta verileri hem kullanıcı deneyimi hem taranabilirlik açısından düzenlendi.", "Proje sayfası ölçülmemiş trafik veya satış sonucu iddia etmez. Buradaki çalışma, görülebilen tasarım ve geliştirme kararlarını şeffaf biçimde belgelemek için yayımlanır."], bullets: ["Semantik başlık yapısı", "Mobil ve masaüstü uyumu", "Paylaşım meta verileri", "Hızlı iletişim bağlantıları"] },
      ],
      faqs: [
        { question: "İnşaat ve hafriyat sitesi hangi sayfaları içermeli?", answer: "Hizmetler, makine veya filo bilgisi, tamamlanan projeler, çalışma bölgeleri ve kolay teklif kanalları temel yapıyı oluşturur. Sayfa sayısı firmanın gerçek hizmet kapsamına göre belirlenmelidir." },
        { question: "Saha hizmetlerinde mobil deneyim neden önemlidir?", answer: "Ziyaretçilerin önemli bölümü telefon üzerinden fiyat, konum ve iletişim bilgisine ulaşır. Başlıkların okunması ve arama ya da WhatsApp bağlantılarının kolay kullanılması bu yüzden önceliklidir." },
        { question: "Bu çalışma canlı olarak incelenebilir mi?", answer: "Evet. Sayfadaki canlı site bağlantısı projenin yayımlanmış sürümünü yeni sekmede açar." },
      ],
    },
    en: {
      key: "z-grup-insaat", slug: "z-group-construction", title: "Z Grup construction website", eyebrow: "Case study · Construction and excavation",
      summary: "A corporate website that presents excavation, foundation digging and transport services through a strong opening, clear service structure and accessible quote channels.",
      seo: { title: "Z Grup Construction Website Case Study", description: "Explore the information architecture, responsive interface, performance foundation and quote journey created for the Z Grup construction website.", keywords: ["construction website design", "excavation company website", "corporate website case study", "Z Grup construction", "Next.js website"] },
      year: "2026", sector: "Construction, excavation and transport", liveUrl: "https://zgrupinsaat.vercel.app/", coverImage: "/projects/z-grup-insaat-cover.png", logoImage: "/projects/z-grup-logo.svg",
      deliverables: ["Corporate web design", "Responsive interface", "Service and project architecture", "Quote and contact journey", "Technical SEO foundation", "Performance-focused frontend"],
      sections: [
        { heading: "Need and page strategy", paragraphs: ["People buying field services first need to understand what the company does, what equipment it operates and how to request a quote. The page architecture follows that decision sequence by exposing services, fleet, projects and contact paths.", "The opening message defines excavation, foundation digging and transport clearly. Phone, WhatsApp and quote links support different visitor preferences while leading toward the same business action."], bullets: ["Make the service scope clear immediately", "Show fleet and field capability", "Keep phone, WhatsApp and quote paths easy to find"] },
        { heading: "Interface and content system", paragraphs: ["The red, black and white brand palette works with large typography and field imagery. Short headings, supporting copy and repeated actions create a page rhythm that remains easy to scan.", "The desktop hierarchy becomes shorter lines and touch-friendly controls on mobile, preserving clarity across screen sizes."] },
        { heading: "Technical delivery", paragraphs: ["Reusable components support the page structure. Image sizing, heading order, link labels and metadata were organized for usability and crawlability.", "This case study does not claim unmeasured traffic or sales outcomes. It documents the visible design and development decisions behind the published work."], bullets: ["Semantic heading hierarchy", "Responsive behavior", "Social sharing metadata", "Direct contact links"] },
      ],
      faqs: [
        { question: "What should a construction website include?", answer: "Services, fleet or equipment details, completed projects, service areas and clear quote channels form the core. The final structure should reflect the company’s real scope." },
        { question: "Why does mobile experience matter for field services?", answer: "Many visitors look for pricing, location and contact information on a phone. Readable headings and easy phone or WhatsApp actions are therefore a priority." },
        { question: "Can the finished work be viewed live?", answer: "Yes. The live website link on this page opens the published version in a new tab." },
      ],
    },
  },
  "salihogullari-hafriyat": {
    tr: {
      key: "salihogullari-hafriyat", slug: "salihogullari-hafriyat", title: "Salihoğulları Hafriyat web sitesi", eyebrow: "Proje incelemesi · Hafriyat ve iş makineleri",
      summary: "Adana merkezli hafriyat ve iş makinesi hizmetlerini marka güveni, hizmet kapsamı ve hızlı teklif akışı çevresinde düzenleyen kurumsal web deneyimi.",
      seo: { title: "Salihoğulları Hafriyat Web Sitesi Projesi", description: "Salihoğulları Hafriyat için hazırlanan kurumsal web sitesinin hizmet anlatımını, mobil yapısını, marka kullanımını ve iletişim akışını inceleyin.", keywords: ["hafriyat web sitesi", "iş makinesi web tasarım", "Adana hafriyat sitesi", "kurumsal web tasarım projesi", "Salihoğulları Hafriyat"] },
      year: "2026", sector: "Hafriyat ve iş makineleri", liveUrl: "https://salihogullaridemobyadakansoftware.vercel.app/", coverImage: "/projects/sallihogullari-hafriyat-cover.png", logoImage: "/projects/salihogullari-hafriyat-logo.svg",
      deliverables: ["Kurumsal web arayüzü", "Mobil sayfa sistemi", "Hizmet içeriği kurgusu", "Logo ve renk uygulaması", "Teklif odaklı iletişim", "Teknik SEO temeli"],
      sections: [
        { heading: "Hizmetin anlaşılır hale gelmesi", paragraphs: ["Hafriyat ve iş makinesi hizmetlerinde ziyaretçinin ihtiyacı çoğu zaman nettir: yapılacak iş, konum, makine türü ve takvim. İçerik bu bilgileri karşılayacak hizmet grupları ve doğrudan iletişim seçenekleri etrafında düzenlendi.", "Kurumsal anlatı gereksiz teknik ifadelerle uzatılmadı. Firma adı, çalışma alanı ve hizmet başlıkları ziyaretçinin aradığı bilgiyi kısa sürede bulmasına yardımcı olacak şekilde öne çıkarıldı."], bullets: ["Hafriyat ve kazı hizmetlerinin ayrıştırılması", "İş makinesi ihtiyacının görünür anlatımı", "Teklif için gerekli bilgilerin yönlendirilmesi"] },
        { heading: "Marka dili ve responsive tasarım", paragraphs: ["Sarı ve turuncu tonlar iş makinesi sembolüyle birlikte tutarlı biçimde kullanıldı. Koyu yüzeyler saha karakterini taşırken açık içerik alanları metinlerin rahat okunmasını sağlar.", "Kartlar, menü ve iletişim düğmeleri küçük ekranlarda yeniden sıralanır. Görsel dil korunurken temel aksiyonlar başparmak erişimine uygun hale gelir."] },
        { heading: "Arama ve bakım temeli", paragraphs: ["Sayfa başlıkları gerçek hizmet adlarına göre düzenlendi; görsel açıklamaları ve meta bilgiler marka ile hizmet bağlamını destekler. Bileşen temelli yapı yeni hizmet ya da proje içeriğinin eklenmesini kolaylaştırır.", "Bu inceleme doğrulanmamış performans veya ticari sonuç ileri sürmez. Yayımlanan arayüzün kapsamını ve kullanılan yaklaşımı açıkça gösterir."], bullets: ["Hizmet odaklı bilgi mimarisi", "Semantik içerik sırası", "Mobil iletişim yolları", "Genişletilebilir bileşen yapısı"] },
      ],
      faqs: [
        { question: "Hafriyat firması web sitesinde hangi bilgiler olmalı?", answer: "Hizmet türleri, kullanılan makineler, çalışma bölgesi, örnek işler ve teklif için gerekli iletişim bilgileri açık biçimde yer almalıdır." },
        { question: "Yerel hizmet sayfaları nasıl hazırlanmalı?", answer: "Yalnızca şehir adını tekrarlamak yerine gerçek hizmet kapsamını, çalışma koşullarını ve iletişim sürecini açıklayan özgün içerik hazırlanmalıdır." },
        { question: "Canlı site bağlantısı güncel mi?", answer: "Evet. Bu sayfadaki bağlantı Salihoğulları Hafriyat çalışmasının yayımlanmış sürümüne gider." },
      ],
    },
    en: {
      key: "salihogullari-hafriyat", slug: "salihogullari-excavation", title: "Salihoğulları excavation website", eyebrow: "Case study · Excavation and machinery",
      summary: "A corporate web experience for an Adana-based excavation and machinery business, organized around brand trust, service clarity and a direct quote journey.",
      seo: { title: "Salihoğulları Excavation Website Case Study", description: "Explore the service content, responsive structure, brand application and contact journey created for the Salihoğulları excavation website.", keywords: ["excavation website design", "machinery company website", "Adana excavation website", "corporate web design case study", "Salihoğulları excavation"] },
      year: "2026", sector: "Excavation and machinery", liveUrl: "https://salihogullaridemobyadakansoftware.vercel.app/", coverImage: "/projects/sallihogullari-hafriyat-cover.png", logoImage: "/projects/salihogullari-hafriyat-logo.svg",
      deliverables: ["Corporate web interface", "Responsive page system", "Service content structure", "Logo and color application", "Quote-focused contact flow", "Technical SEO foundation"],
      sections: [
        { heading: "Making the service easy to understand", paragraphs: ["Excavation and machinery visitors often arrive with a defined need: work type, location, equipment and schedule. The content is structured around service groups and direct contact options that support those questions.", "The company story stays concise. Name, service area and primary capabilities receive enough emphasis for visitors to find relevant information quickly."], bullets: ["Separate excavation and digging services", "Explain machinery availability", "Guide the details needed for a quote"] },
        { heading: "Brand language and responsive design", paragraphs: ["Yellow and orange accents support the machinery symbol consistently. Dark surfaces carry the field-oriented character while lighter content areas keep text comfortable to read.", "Cards, navigation and contact actions reorder on small screens. The visual identity remains consistent while the main controls stay easy to reach." ] },
        { heading: "Search and maintenance foundation", paragraphs: ["Headings use real service terminology, while image descriptions and metadata reinforce the brand and service context. A component-based structure makes new services or project entries easier to add.", "This review makes no unverified performance or commercial claims. It documents the scope and approach visible in the published interface."], bullets: ["Service-led information architecture", "Semantic content order", "Mobile contact paths", "Extensible component structure"] },
      ],
      faqs: [
        { question: "What information should an excavation website contain?", answer: "It should clearly present service types, machinery, service area, example work and the contact details needed to request a quote." },
        { question: "How should local service pages be written?", answer: "They should explain the real service scope, working conditions and contact process instead of repeating a city name without useful detail." },
        { question: "Is the live website link current?", answer: "Yes. The link on this page opens the published Salihoğulları excavation website." },
      ],
    },
  },
}

export function getCaseStudy(key: CaseStudyKey, locale: Locale) { return studies[key][locale] }
export function isCaseStudySlug(slug: string, locale: Locale): boolean { return caseStudyKeys.some(key => studies[key][locale].slug === slug) }
export function getCaseStudyBySlug(slug: string, locale: Locale) { const key = caseStudyKeys.find(item => studies[item][locale].slug === slug); return key ? studies[key][locale] : undefined }
export function getCaseStudyPaths() { return caseStudyKeys.map(key => ({ key, tr: `/projects/${studies[key].tr.slug}`, en: `/projects/${studies[key].en.slug}`, lastModified })) }
