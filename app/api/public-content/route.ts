import type { Locale } from '@/lib/i18n'
import { getNeonSql } from '@/lib/neon'
import { getLogoWorks, getProjects } from '@/lib/site-data'

type LocalizedRow = { title_tr: string; title_en: string; category_tr: string; category_en: string; description_tr: string; description_en: string; color: string }
type ProjectRow = LocalizedRow & { year: string; href: string; cover_image: string | null }
type LogoRow = LocalizedRow & { initials: string; logo_image: string | null }
const responseHeaders = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }

function presentation(row: LocalizedRow, locale: Locale) {
  return {
    title: locale === 'tr' ? row.title_tr : row.title_en,
    category: locale === 'tr' ? row.category_tr : row.category_en,
    description: locale === 'tr' ? row.description_tr : row.description_en,
    color: row.color,
  }
}

// Only the same published fields shown on public pages. No IDs, drafts,
// admin/session details, contact records, or database configuration.
export async function GET() {
  try {
    // One read per collection, shared by both locales. Errors belong to this
    // request and must never be masked by another locale or concurrent request.
    const sql = process.env.DATABASE_URL ? getNeonSql() : null
    const [projects, logos] = sql ? await Promise.all([
      sql.query('select title_tr, title_en, category_tr, category_en, description_tr, description_en, year, href, color, cover_image from projects where published = true and archived = false order by sort_order'),
      sql.query('select title_tr, title_en, category_tr, category_en, description_tr, description_en, initials, color, logo_image from logo_works where published = true and archived = false order by sort_order'),
    ]) as [ProjectRow[], LogoRow[]] : [[], []]
    const projectLocale = (locale: Locale) => projects.length ? projects.map(row => ({
      ...presentation(row, locale), year: row.year, href: row.href,
      ...(row.cover_image ? { coverImage: row.cover_image } : {}),
    })) : getProjects(locale)
    const logoLocale = (locale: Locale) => logos.length ? logos.map(row => ({
      ...presentation(row, locale), initials: row.initials,
      ...(row.logo_image ? { logoImage: row.logo_image } : {}),
    })) : getLogoWorks(locale)
    return Response.json({ projects: { tr: projectLocale('tr'), en: projectLocale('en') }, logos: { tr: logoLocale('tr'), en: logoLocale('en') } }, { headers: responseHeaders })
  } catch {
    return Response.json({ ok: false }, { status: 503, headers: responseHeaders })
  }
}

