import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { withLocale, type Locale } from "@/lib/i18n"

const pricing = {
  tr: {
    eyebrow: "Net kapsam, net yatırım",
    title: "İhtiyaca göre",
    gradient: "esnek fiyatlandırma",
    description: "Her proje için kapsamı birlikte netleştiririz. Aşağıdaki aralıklar, doğru başlangıç noktasını seçmene yardımcı olur.",
    cta: "Kapsamı konuşalım",
    faqTitle: "Sık sorulan sorular",
    faqs: [
      { question: "Fiyatlar neye göre değişir?", answer: "Sayfa sayısı, özel işlevler, içerik durumu ve takvim. Kapsam netleşince sabit fiyat veririz; sürpriz ek maliyet çıkmaz." },
      { question: "Ödeme nasıl planlanıyor?", answer: "Tipik plan: başlangıçta yüzde 40, tasarım onayında yüzde 30, yayında yüzde 30. Daha uzun projelerde planı birlikte esnetebiliriz." },
      { question: "Yayın sonrası destek var mı?", answer: "Yayın sonrası ilk aydaki düzeltmeler fiyata dahildir. Sonrasında istersen aylık bakımla devam ederiz, istersen siteyi kendi yönetirsin." },
      { question: "Bütçem daha küçükse?", answer: "Kapsamı küçültürüz, kaliteyi düşürmeyiz. Doğru kurgulanmış tek sayfalık bir site, yanlış kapsamlı büyük siteden iyidir." },
    ],
    items: [
      { name: "Marka başlangıcı", price: "₺15.000", note: "Logo & marka kimliği", features: ["Logo sistemi", "Renk ve tipografi", "Teslim dosyaları"] },
      { name: "Kurumsal web", price: "₺25.000", note: "Web sitesi", features: ["Stratejik sayfa akışı", "Responsive arayüz", "Yayına alma desteği"], featured: true },
      { name: "Dijital ürün", price: "₺40.000", note: "UI/UX & frontend", features: ["Ürün akışları", "Tasarım sistemi", "Next.js geliştirme"] },
    ],
  },
  en: {
    eyebrow: "Clear scope, clear investment",
    title: "Flexible pricing",
    gradient: "for real needs",
    description: "We define the scope together. These ranges help identify the right starting point for your project.",
    cta: "Discuss your scope",
    faqTitle: "Frequently asked questions",
    faqs: [
      { question: "What changes the price?", answer: "Page count, custom functionality, content readiness, and timeline. Once the scope is clear we give a fixed price; no surprise add-ons." },
      { question: "How is payment structured?", answer: "A typical plan: 40% upfront, 30% at design approval, 30% at launch. Longer projects can use a schedule we agree together." },
      { question: "Is post-launch support included?", answer: "Fixes in the first month after launch are included. After that, continue with a monthly maintenance plan or run the site yourself." },
      { question: "What if my budget is smaller?", answer: "We shrink the scope, not the quality. A well-built single-page site beats a poorly scoped large one." },
    ],
    items: [
      { name: "Brand foundation", price: "€800", note: "Logo & brand identity", features: ["Logo system", "Color and typography", "Delivery files"] },
      { name: "Corporate web", price: "€1.500", note: "Website", features: ["Strategic page flow", "Responsive interface", "Launch support"], featured: true },
      { name: "Digital product", price: "€3.000", note: "UI/UX & frontend", features: ["Product flows", "Design system", "Next.js development"] },
    ],
  },
} satisfies Record<Locale, { eyebrow: string; title: string; gradient: string; description: string; cta: string; faqTitle: string; faqs: Array<{ question: string; answer: string }>; items: Array<{ name: string; price: string; note: string; features: string[]; featured?: boolean }> }>

export function PricingSection({ locale }: { locale: Locale }) {
  const copy = pricing[locale]
  return <section id="pricing" className="studio-section studio-soft"><div className="studio-container"><h2>{locale === "tr" ? "Kapsamı belli. Başlangıcı net." : "Clear scope. A clear starting point."}</h2><p className="studio-section-description">{locale === "tr" ? "Projenize uygun başlangıç paketleri. Son fiyatı kapsamla birlikte belirleriz." : "Starting packages for your project. We agree the final price once the scope is defined."}</p><div className="studio-pricing">{copy.items.map(item => <article key={item.name} className={"studio-price-card" + ("featured" in item && item.featured ? " studio-price-featured" : "")}><p className="studio-price-note">{item.note}</p><h3>{item.name}</h3><p className="studio-price">{item.price}</p><p className="studio-price-note">{locale === "tr" ? "başlangıç fiyatı" : "starting at"}</p><ul>{item.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul><Link className="studio-link" href={withLocale("/contact", locale)}>{copy.cta}<ArrowRight size={16} /></Link></article>)}</div><div className="mt-16 max-w-3xl"><h3>{copy.faqTitle}</h3><div className="mt-6 space-y-4">{copy.faqs.map(faq => <details key={faq.question} className="studio-price-card"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p></details>)}</div></div></div></section>
}
