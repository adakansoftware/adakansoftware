import Link from "next/link"
import { withLocale, type Locale } from "@/lib/i18n"

type PageHeaderProps = {
  locale?: Locale
  title: string
  gradientText?: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export function PageHeader({ locale = "tr", title, gradientText, description, primaryHref = withLocale("/contact", locale), primaryLabel = locale === "en" ? "Start a project" : "Projeye başlayalım", secondaryHref, secondaryLabel }: PageHeaderProps) {
  return <section className="studio-page-header studio-container"><h1>{title}{gradientText && <><br /><span>{gradientText}</span></>}</h1><p>{description}</p><div className="studio-actions"><Link className="studio-button" href={primaryHref}>{primaryLabel}</Link>{secondaryHref && secondaryLabel && <Link className="studio-link" href={secondaryHref}>{secondaryLabel}</Link>}</div></section>
}
