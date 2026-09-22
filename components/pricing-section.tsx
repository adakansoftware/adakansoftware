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
    items: [
      { name: "Brand foundation", price: "€800", note: "Logo & brand identity", features: ["Logo system", "Color and typography", "Delivery files"] },
      { name: "Corporate web", price: "€1.500", note: "Website", features: ["Strategic page flow", "Responsive interface", "Launch support"], featured: true },
      { name: "Digital product", price: "€3.000", note: "UI/UX & frontend", features: ["Product flows", "Design system", "Next.js development"] },
    ],
  },
} satisfies Record<Locale, { eyebrow: string; title: string; gradient: string; description: string; cta: string; items: Array<{ name: string; price: string; note: string; features: string[]; featured?: boolean }> }>

export function PricingSection({ locale }: { locale: Locale }) {
  const copy = pricing[locale]
  return <section id="pricing" className="studio-section studio-soft"><div className="studio-container"><h2>{locale === "tr" ? "Kapsamı belli. Başlangıcı net." : "Clear scope. A clear starting point."}</h2><p className="studio-section-description">{locale === "tr" ? "Projenize uygun başlangıç paketleri. Son fiyatı kapsamla birlikte belirleriz." : "Starting packages for your project. We agree the final price once the scope is defined."}</p><div className="studio-pricing">{copy.items.map(item => <article key={item.name} className={"studio-price-card" + ("featured" in item && item.featured ? " studio-price-featured" : "")}><p className="studio-price-note">{item.note}</p><h3>{item.name}</h3><p className="studio-price">{item.price}</p><p className="studio-price-note">{locale === "tr" ? "başlangıç fiyatı" : "starting at"}</p><ul>{item.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul><Link className="studio-link" href={withLocale("/contact", locale)}>{copy.cta}<ArrowRight size={16} /></Link></article>)}</div></div></section>
}
