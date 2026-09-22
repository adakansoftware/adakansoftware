import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { withLocale, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

export function CTASection({ locale = "tr" }: { locale?: Locale }) {
  return <section className="studio-section studio-cta studio-container"><h2>{locale === "tr" ? "Birlikte iyi bir iş çıkaralım." : "Let’s make something that works."}</h2><p>{locale === "tr" ? "Aklınızdaki projeyi anlatın. İlk adımı birlikte atalım." : "Tell us what you have in mind. We’ll take the first step together."}</p><div className="studio-actions"><Link className="studio-button" href={withLocale("/contact", locale)}>{locale === "tr" ? "İletişime geçin" : "Get in touch"}<ArrowRight size={16} /></Link><a className="studio-link" href={"mailto:" + siteConfig.email}>{siteConfig.email}</a></div></section>
}
