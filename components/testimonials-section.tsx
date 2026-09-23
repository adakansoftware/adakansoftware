import Link from "next/link"
import { withLocale, type Locale } from "@/lib/i18n"

// Publish customer quotations only after their source and approval are verified.
export function TestimonialsSection({ locale = "tr" }: { locale?: Locale }) {
  return <section className="studio-page-header studio-container">
    <h1>{locale === "tr" ? "Çalışmalarımızı inceleyin." : "Explore our work."}</h1>
    <p>{locale === "tr" ? "Web sitesi ve marka kimliği çalışmalarımızı portfolyomuzda görebilirsiniz." : "Browse our website and brand identity projects in our portfolio."}</p>
    <div className="studio-actions"><Link className="studio-button" href={withLocale("/projects", locale)}>{locale === "tr" ? "İşleri görüntüle" : "View projects"}</Link></div>
  </section>
}
