import Link from "next/link"
import { getManagedProjects } from "@/lib/content"
import { ProjectListingCards } from "@/components/project-listing-cards"
import { ArrowRight, Code2, PenTool, PanelsTopLeft } from "lucide-react"
import { withLocale, type Locale } from "@/lib/i18n"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { selectHomepageProjects } from "@/lib/public-projects"
import { LaptopReveal } from "@/components/laptop-reveal"

const content = {
  tr: {
    intro: "İstanbul merkezli yazılım ve tasarım stüdyosu", title: "Web tasarım ve yazılım.", accent: "Sade çözümler.",
    description: "İşletmeniz için özel yazılım, kurumsal web sitesi, Next.js arayüzleri, UI/UX ve güçlü marka kimlikleri tasarlayıp geliştiriyoruz.",
    start: "Projenizi konuşalım", work: "İşlerimizi keşfedin", services: "İhtiyacınız kadar. Özenle.",
    serviceIntro: "Fikirden yayına; web tasarımı, özel yazılım geliştirme ve marka kimliği tek ekipte.",
    items: [["Marka kimliği", "Markanızı anlatan logo, renk ve tipografi. Her yerde tutarlı bir görünüm."], ["Web tasarımı", "İçeriği öne çıkaran, her ekranda rahat kullanılan web siteleri."], ["Yazılım geliştirme", "İşinize uygun, hızlı ve sürdürülebilir dijital ürünler."]],
    approach: "Az karmaşa. Daha iyi sonuç.",
    steps: [["Anlıyoruz", "İhtiyacınızı dinliyor, hedefi ve kapsamı birlikte netleştiriyoruz."], ["Tasarlıyoruz", "Gereksiz olanı çıkarıyor, işe yarayan çözüme odaklanıyoruz."], ["Hayata geçiriyoruz", "Geliştiriyor, test ediyor ve yayına alıyoruz."]], more: "Yaklaşımımız",
  },
  en: {
    intro: "Istanbul software and design studio", title: "Web design & software.", accent: "Simple solutions.",
    description: "We design and build custom software, corporate websites, Next.js interfaces, UI/UX and clear brand identities for ambitious businesses.",
    start: "Let’s talk about your project", work: "Explore our work", services: "Just what you need. Done well.",
    serviceIntro: "Web design, custom software development and brand identity from one connected team.",
    items: [["Brand identity", "A logo, colors and typography that tell your story. A consistent presence everywhere."], ["Web design", "Websites that put content first and feel comfortable on every screen."], ["Development", "Fast, maintainable digital products built around your business."]],
    approach: "Less complexity. Better outcomes.",
    steps: [["Understand", "We listen and define your goals and project scope together."], ["Design", "We remove what gets in the way and focus on what works."], ["Build", "We develop, test and help you launch."]], more: "Our approach",
  },
}
const icons = [PenTool, PanelsTopLeft, Code2]

export async function StudioHome({ locale }: { locale: Locale }) {
  const copy = content[locale]
  const projects = selectHomepageProjects(await getManagedProjects(locale))
  return <>
    <section className="studio-hero studio-container">
      <p className="studio-eyebrow">{copy.intro}</p>
      <h1>{copy.title}<br /><span>{copy.accent}</span></h1>
      <p className="studio-lead">{copy.description}</p>
      <div className="studio-actions"><Link className="studio-button" href={withLocale("/contact", locale)}>{copy.start}<ArrowRight size={16} /></Link><Link className="studio-link" href={withLocale("/projects", locale)}>{copy.work}<ArrowRight size={16} /></Link></div>
    </section>
    <LaptopReveal locale={locale} />
    <section id="services" className="studio-section studio-soft"><div className="studio-container"><h2>{copy.services}</h2><p className="studio-section-description">{copy.serviceIntro}</p><div className="studio-services">{copy.items.map(([title, description], index) => { const Icon = icons[index]; return <article key={title}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article> })}</div></div></section>
    <section id="approach" className="studio-section"><div className="studio-container studio-approach"><div><h2>{copy.approach}</h2><Link className="studio-link" href={withLocale("/approach", locale)}>{copy.more}<ArrowRight size={16} /></Link></div><ol>{copy.steps.map(([title, description], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div></section>
    {projects.length > 0 && <section className="studio-section studio-container">
      <h2>{locale === "tr" ? "Son çalışmalar." : "Recent work."}</h2>
      <p className="studio-section-description">{locale === "tr" ? "Fikirden yayına taşıdığımız web deneyimleri." : "Web experiences we have taken from idea to launch."}</p>
      <div className="mt-8"><ProjectListingCards projects={projects} locale={locale} /></div>
      <Link className="studio-link mt-6" href={withLocale("/projects", locale)}>{locale === "tr" ? "Tüm işleri görün" : "View all work"}<ArrowRight size={16} /></Link>
    </section>}
    <PricingSection locale={locale} /><CTASection locale={locale} />
  </>
}
