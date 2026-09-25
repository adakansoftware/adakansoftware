"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef } from "react"
import { Menu } from "lucide-react"
import { getLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n"
import { getLocalizedRouteAlternate } from "@/lib/localized-route-map"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar({ locale: _locale }: { locale: Locale }) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const menu = useRef<HTMLDetailsElement>(null)
  const links = locale === "tr" ? [["Hizmetler", "/services"], ["İşler", "/projects"], ["Demolar", "/demos"], ["Logo", "/logo"], ["Fiyatlar", "/pricing"], ["Yaklaşım", "/approach"]] : [["Services", "/services"], ["Work", "/projects"], ["Demos", "/demos"], ["Logo", "/logo"], ["Pricing", "/pricing"], ["Approach", "/approach"]]
  const close = () => { if (menu.current) menu.current.open = false }
  const items = links.map(([label, href]) => <Link key={href} href={withLocale(href, locale)} onClick={close} aria-current={pathname === withLocale(href, locale) ? "page" : undefined}>{label}</Link>)
  return <header className="studio-header"><div className="studio-container studio-nav">
    <Link href={withLocale("/", locale)} className="studio-brand" onClick={close}><Image src="/adakan-logo.png" alt="" width={40} height={40} priority /><span>Adakan<span className="studio-brand-secondary"> Software</span></span></Link>
    <nav className="studio-desktop-nav" aria-label={locale === "tr" ? "Ana menü" : "Main navigation"}>{items}</nav>
    <div className="studio-nav-actions"><ThemeToggle locale={locale} /><a className="studio-language" href={getLocalizedRouteAlternate(pathname, locale === "tr" ? "en" : "tr")} lang={locale === "tr" ? "en" : "tr"} onClick={close} aria-label={locale === "tr" ? "Switch to English" : "Türkçeye geç"}>{locale === "tr" ? "EN" : "TR"}</a><Link className="studio-nav-cta" href={withLocale("/contact", locale)} onClick={close}>{locale === "tr" ? "Konuşalım" : "Let’s talk"}<span aria-hidden="true"> ↗</span></Link></div>
    <details ref={menu} className="studio-mobile-menu" onKeyDown={event => { if (event.key === "Escape") { close(); menu.current?.querySelector("summary")?.focus() } }}><summary aria-label={locale === "tr" ? "Menüyü aç veya kapat" : "Toggle menu"}><Menu size={22} /></summary><nav aria-label={locale === "tr" ? "Mobil menü" : "Mobile navigation"}>{items}<Link className="studio-mobile-cta" href={withLocale("/contact", locale)} onClick={close}>{locale === "tr" ? "Konuşalım" : "Let’s talk"}<span aria-hidden="true"> ↗</span></Link></nav></details>
  </div></header>
}
