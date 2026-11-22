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
    intro: "Adakan Software · İstanbul", title: "Yazılım şirketiniz.", accent: "Sade çözümler.",
    description: <>Adakan Software; <Link href="/van-yazilim-firmasi" className="hover:underline focus-visible:underline">Van</Link> ve <Link href="/istanbul-yazilim-sirketi" className="hover:underline focus-visible:underline">İstanbul</Link> başta olmak üzere Türkiye ve yurt dışındaki işletmelere özel yazılım, web sitesi ve iş otomasyonu geliştiren yazılım şirketidir.</>,
    start: "Projenizi konuşalım", work: "İşlerimizi keşfedin", services: "İhtiyacınız kadar. Özenle.",
    serviceIntro: "Fikirden yayına; web tasarımı, özel yazılım geliştirme ve logo tasarımı tek elden.",
    items: [["Logo tasarımı", "İşletmenizi anlatan logo. Konsept, revizyon ve teslim dosyaları seçtiğiniz pakete göre."], ["Web tasarımı", "İçeriği öne çıkaran, her ekranda rahat kullanılan web siteleri."], ["Yazılım geliştirme", "İşinize uygun, hızlı ve sürdürülebilir dijital ürünler."]],
    approach: "Az karmaşa. Daha iyi sonuç.",
    steps: [["Anlıyoruz", "İhtiyacınızı dinliyor, hedefi ve kapsamı birlikte netleştiriyoruz."], ["Tasarlıyoruz", "Gereksiz olanı çıkarıyor, işe yarayan çözüme odaklanıyoruz."], ["Hayata geçiriyoruz", "Geliştiriyor, test ediyor ve yayına alıyoruz."]], more: "Yaklaşımımız",
  },
  en: {
    intro: "Adakan Software · Istanbul", title: "Your software company.", accent: "Simple solutions.",
    description: <>Adakan Software builds custom software, websites and workflow automation for businesses in <Link href="/en/van-software-company" className="hover:underline focus-visible:underline">Van</Link>, <Link href="/en/istanbul-software-company" className="hover:underline focus-visible:underline">Istanbul</Link> and beyond, with remote delivery in Turkish and English.</>,
    start: "Let’s talk about your project", work: "Explore our work", services: "Just what you need. Done well.",
    serviceIntro: "Web design, custom software development and logo design from one provider.",
    items: [["Logo design", "A logo for your business, with concepts, revision rounds and delivery files defined by your package."], ["Web design", "Websites that put content first and feel comfortable on every screen."], ["Development", "Fast, maintainable digital products built around your business."]],
    approach: "Less complexity. Better outcomes.",
    steps: [["Understand", "We listen and define your goals and project scope together."], ["Design", "We remove what gets in the way and focus on what works."], ["Build", "We develop, test and help you launch."]], more: "Our approach",
  },
}
const icons = [PenTool, PanelsTopLeft, Code2]
const servicePaths = ["/logo", "/services/web-development", "/services/software-development"]

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
    <section id="services" className="studio-section studio-soft"><div className="studio-container"><h2>{copy.services}</h2><p className="studio-section-description">{copy.serviceIntro}</p><div className="studio-services">{copy.items.map(([title, description], index) => { const Icon = icons[index]; return <article key={title}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3><Link href={withLocale(servicePaths[index], locale)}>{title}</Link></h3><p>{description}</p></article> })}</div></div></section>
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
