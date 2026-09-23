import Link from "next/link"
import { FooterWordmark } from "@/components/footer-wordmark"
import { withLocale, type Locale } from "@/lib/i18n"
import { footerContent, socialLinks } from "@/lib/shell-content"
import { getWhatsAppHref } from "@/lib/contact-links"
import { siteConfig } from "@/lib/site-config"

export function Footer({ locale }: { locale: Locale }) {
  const copy = footerContent[locale]
  return <footer className="studio-footer"><div className="studio-container"><div className="studio-footer-top"><div><Link className="studio-brand" href={withLocale("/", locale)}>Adakan Software</Link><p>{siteConfig.location[locale]}</p><a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a></div><nav aria-label={copy.companyTitle}><Link href={withLocale("/logo", locale)}>{locale === "tr" ? "Logo çalışmaları" : "Logo work"}</Link><a href={getWhatsAppHref(locale)} target="_blank" rel="noopener noreferrer">WhatsApp</a>{copy.company.map(link => <Link key={link.href} href={withLocale(link.href, locale)}>{link.name}</Link>)}</nav><nav aria-label={copy.servicesTitle}>{copy.services.map(link => <Link key={link.href} href={withLocale(link.href, locale)}>{link.name}</Link>)}</nav></div><div className="studio-footer-bottom"><span>© {new Date().getFullYear()} Adakan Software</span><div>{socialLinks.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div><div><Link href={withLocale("/privacy", locale)}>{copy.privacy}</Link><Link href={withLocale("/terms", locale)}>{copy.terms}</Link></div></div><FooterWordmark /></div></footer>
}
