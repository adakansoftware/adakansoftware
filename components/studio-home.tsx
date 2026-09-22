import Link from "next/link"
import { ArrowRight, Code2, PenTool, PanelsTopLeft } from "lucide-react"
import { withLocale, type Locale } from "@/lib/i18n"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"

const content = {
  tr: {
    intro: "Tasarım ve yazılım stüdyosu", title: "İyi fikirler.", accent: "Sade çözümler.",
    description: "Markanız için güçlü bir kimlik, anlaşılır bir web sitesi ve kullanımı kolay dijital deneyimler tasarlıyoruz.",
    start: "Projenizi konuşalım", work: "İşlerimizi keşfedin", services: "İhtiyacınız kadar. Özenle.",
    serviceIntro: "Fikirden yayına, birbiriyle uyumlu tasarım ve geliştirme.",
    items: [["Marka kimliği", "Markanızı anlatan logo, renk ve tipografi. Her yerde tutarlı bir görünüm."], ["Web tasarımı", "İçeriği öne çıkaran, her ekranda rahat kullanılan web siteleri."], ["Yazılım geliştirme", "İşinize uygun, hızlı ve sürdürülebilir dijital ürünler."]],
    approach: "Az karmaşa. Daha iyi sonuç.",
    steps: [["Anlıyoruz", "İhtiyacınızı dinliyor, hedefi ve kapsamı birlikte netleştiriyoruz."], ["Tasarlıyoruz", "Gereksiz olanı çıkarıyor, işe yarayan çözüme odaklanıyoruz."], ["Hayata geçiriyoruz", "Geliştiriyor, test ediyor ve yayına alıyoruz."]], more: "Yaklaşımımız",
  },
  en: {
    intro: "Design & development studio", title: "Good ideas.", accent: "Simple solutions.",
    description: "We build clear brand identities, thoughtful websites and digital experiences that feel easy to use.",
    start: "Let’s talk about your project", work: "Explore our work", services: "Just what you need. Done well.",
    serviceIntro: "Connected design and development, from idea to launch.",
    items: [["Brand identity", "A logo, colors and typography that tell your story. A consistent presence everywhere."], ["Web design", "Websites that put content first and feel comfortable on every screen."], ["Development", "Fast, maintainable digital products built around your business."]],
    approach: "Less complexity. Better outcomes.",
    steps: [["Understand", "We listen and define your goals and project scope together."], ["Design", "We remove what gets in the way and focus on what works."], ["Build", "We develop, test and help you launch."]], more: "Our approach",
  },
}
const icons = [PenTool, PanelsTopLeft, Code2]

export function StudioHome({ locale }: { locale: Locale }) {
  const copy = content[locale]
  return <>
    <section className="studio-hero studio-container">
      <p className="studio-eyebrow">{copy.intro}</p>
      <h1>{copy.title}<br /><span>{copy.accent}</span></h1>
      <p className="studio-lead">{copy.description}</p>
      <div className="studio-actions"><Link className="studio-button" href={withLocale("/contact", locale)}>{copy.start}<ArrowRight size={16} /></Link><Link className="studio-link" href={withLocale("/projects", locale)}>{copy.work}<ArrowRight size={16} /></Link></div>
    </section>
    <section id="services" className="studio-section studio-soft"><div className="studio-container"><h2>{copy.services}</h2><p className="studio-section-description">{copy.serviceIntro}</p><div className="studio-services">{copy.items.map(([title, description], index) => { const Icon = icons[index]; return <article key={title}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article> })}</div></div></section>
    <section id="approach" className="studio-section"><div className="studio-container studio-approach"><div><h2>{copy.approach}</h2><Link className="studio-link" href={withLocale("/approach", locale)}>{copy.more}<ArrowRight size={16} /></Link></div><ol>{copy.steps.map(([title, description], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div></section>
    <PricingSection locale={locale} /><CTASection locale={locale} />
  </>
}
