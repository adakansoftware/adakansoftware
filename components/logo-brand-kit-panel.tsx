import Image from "next/image"

import type { Locale } from "@/lib/i18n"

const formats = ["SVG", "PNG", "APP ICON"]

export function LogoBrandKitPanel({ locale }: { locale: Locale }) {
  const copy = locale === "tr"
    ? {
        eyebrow: "Marka sistemi",
        descriptor: "Dijital ürün stüdyosu",
        primary: "Ana kullanım",
        light: "Açık zemin",
        dark: "Koyu zemin",
        mode: "Açık / Koyu",
        alt: "Adakan Software marka işareti",
      }
    : {
        eyebrow: "Brand system",
        descriptor: "Digital product studio",
        primary: "Primary lockup",
        light: "Light surface",
        dark: "Dark surface",
        mode: "Light / Dark",
        alt: "Adakan Software brand mark",
      }

  return (
    <div id="brand-kit" className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[#f3f4f6] p-3 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] dark:border-white/[0.1] dark:bg-[#111318] sm:p-4">
      <div className="flex items-center justify-between px-2 pb-3 pt-1 text-[0.65rem] font-semibold tracking-[0.18em] text-black/45 uppercase dark:text-white/45">
        <span>{copy.eyebrow}</span>
        <span>01 / 04</span>
      </div>

      <div className="rounded-[1.35rem] border border-black/[0.07] bg-white px-6 py-7 dark:border-white/[0.09] dark:bg-[#1b1d22] sm:px-8 sm:py-9">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Image
            src="/favicon-v3.svg"
            alt={copy.alt}
            width={96}
            height={64}
            className="h-12 w-16 object-contain sm:h-14 sm:w-20"
          />
          <div className="w-full border-t border-black/10 pt-4 dark:border-white/10 sm:min-w-0 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <p className="text-xl font-semibold tracking-[-0.035em] text-[#111318] dark:text-white sm:text-2xl">
              Adakan Software
            </p>
            <p className="mt-1 text-xs tracking-[0.12em] text-black/45 uppercase dark:text-white/45">
              {copy.descriptor}
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-black/[0.07] pt-3 text-[0.65rem] font-medium tracking-[0.16em] text-black/40 uppercase dark:border-white/[0.08] dark:text-white/40">
          {copy.primary}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-[1.15rem] border border-black/[0.07] bg-white p-4 sm:p-5">
          <div className="flex min-h-20 items-center justify-center">
            <Image src="/favicon-v3.svg" alt="" width={72} height={48} className="h-10 w-14 object-contain" />
          </div>
          <p className="border-t border-black/[0.07] pt-3 text-[0.62rem] font-semibold tracking-[0.14em] text-black/45 uppercase">
            {copy.light}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-white/[0.1] bg-[#101216] p-4 sm:p-5">
          <div className="flex min-h-20 items-center justify-center">
            <Image src="/favicon-v3.svg" alt="" width={72} height={48} className="h-10 w-14 object-contain" />
          </div>
          <p className="border-t border-white/[0.1] pt-3 text-[0.62rem] font-semibold tracking-[0.14em] text-white/50 uppercase">
            {copy.dark}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-2 pb-1 pt-4 text-[0.6rem] font-semibold tracking-[0.13em] text-black/40 uppercase dark:text-white/40">
        {formats.map((format) => <span key={format}>{format}</span>)}
        <span>{copy.mode}</span>
      </div>
    </div>
  )
}
