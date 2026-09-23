import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import { getOptimizedProjectImage } from "@/lib/project-image-assets"

type Project = { title: string; href: string; category: string; year: string; description: string; color: string; coverImage?: string }

export function ProjectListingCards({ projects, locale }: { projects: Project[]; locale: Locale }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectListingCard key={project.title} project={project} locale={locale} />
      ))}
    </div>
  )
}

function ProjectListingCard({ project, locale }: { project: Project; locale: Locale }) {
  const isExternal = project.href.startsWith("http://") || project.href.startsWith("https://")

  return (
    <article
      id={project.href.includes("#") ? project.href.split("#")[1] : undefined}
      className="premium-border group rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-md transition-colors duration-300 hover:border-accent/40"
    >
      <div
        className="relative mb-6 aspect-video overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
        style={{ background: `linear-gradient(135deg, ${project.color}30, transparent 55%, ${project.color}18)` }}
      >
        <div className="absolute top-3 right-3 z-10">
          {isExternal ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-700 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              {locale === "tr" ? "Canlı" : "Live"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-md">
              {project.coverImage ? (locale === "tr" ? "Web tasarımı" : "Web design") : "Demo"}
            </span>
          )}
        </div>
        {project.coverImage ? (
          <>
            <Image
              src={getOptimizedProjectImage(project.coverImage)}
              alt={`${project.title} kapak görseli`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0 grid-pattern opacity-25" />
            <div className="absolute inset-x-6 top-8 rounded-xl border border-white/10 bg-background/35 p-5 backdrop-blur-md">
              <div className="mb-5 flex gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400/80" />
                <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
              </div>
              <div className="space-y-3">
                <span className="block h-3 w-1/2 rounded-full bg-white/25" />
                <span className="block h-10 rounded-lg" style={{ backgroundColor: `${project.color}35` }} />
                <span className="block h-3 w-2/3 rounded-full bg-white/15" />
              </div>
            </div>
          </>
        )}
        <div
          className="absolute right-0 bottom-0 left-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
        />
      </div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {project.category} / {project.year}
          </p>
          <h2 className="mt-3 text-3xl font-bold transition-colors duration-300 group-hover:text-accent">{project.title}</h2>
          <p className="mt-4 text-muted-foreground">{project.description}</p>
          {isExternal ? (
            <Link
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {locale === "tr" ? "Canlı siteyi aç" : "Open live site"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

      </div>
    </article>
  )
}
