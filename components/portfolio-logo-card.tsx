import Image from "next/image"
import Link from "next/link"

import { getOptimizedLogoImage } from "@/lib/project-image-assets"

export type PortfolioLogoWork = {
  title: string
  category: string
  description: string
  initials: string
  logoImage?: string
  color: string
}

export function PortfolioLogoCard({ work, href }: { work: PortfolioLogoWork; href?: string }) {
  const content = (
    <>
      <div
        className="relative mb-5 aspect-square overflow-hidden rounded-xl border border-border/50 bg-white"
      >
        <div className="absolute inset-3 flex items-center justify-center">
          {work.logoImage ? (
            <Image
              src={getOptimizedLogoImage(work.logoImage)}
              alt={`${work.title} logo`}
              width={480}
              height={480}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
              className={`h-auto max-h-[72%] w-[82%] object-contain transition-transform duration-300 group-hover:scale-105 ${
                work.title === "Salihoğulları Hafriyat" ? "-translate-y-3" : ""
              }`}
            />
          ) : (
            <span
              className="font-aquire text-[clamp(2.8rem,8vw,4.8rem)] leading-none transition-transform duration-300 group-hover:scale-105"
              style={{ color: work.color }}
            >
              {work.initials}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs font-medium tracking-widest text-accent uppercase">{work.category}</p>
      <h3 className="mt-3 text-xl font-bold">{work.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{work.description}</p>
    </>
  )

  const className = "group block overflow-hidden rounded-2xl border border-border/50 bg-card/25 p-5 transition-colors hover:border-accent/45 premium-border"
  return href ? <Link href={href} className={className}>{content}</Link> : <article className={className}>{content}</article>
}
