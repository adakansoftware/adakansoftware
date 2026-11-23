import type { Locale } from './i18n'
import type { getProjects, getLogoWorks } from './site-data'

// Replaced only inside the ignored static build directory with published data.
export const buildContent: { projects: Record<Locale, ReturnType<typeof getProjects>>; logos: Record<Locale, ReturnType<typeof getLogoWorks>> } | null = null // BUILD_CONTENT_VALUE
