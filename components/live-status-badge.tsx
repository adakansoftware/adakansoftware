import type { Locale } from "@/lib/i18n"

export function LiveStatusBadge({ locale }: { locale: Locale }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent backdrop-blur-md">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/55 motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {locale === "tr" ? "Canlı" : "Live"}
    </span>
  )
}
