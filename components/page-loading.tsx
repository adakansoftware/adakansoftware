import Image from "next/image"

export function PageLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_34%)]" aria-hidden="true" />
      <div className="relative flex w-full max-w-xs flex-col items-center text-center">
        <div className="loading-halo relative grid h-20 w-20 place-items-center rounded-[1.4rem] border border-border/70 bg-card/80 shadow-[0_18px_60px_color-mix(in_oklab,var(--accent)_14%,transparent)] backdrop-blur-xl" aria-hidden="true">
          <div className="absolute inset-2 rounded-[1rem] border border-foreground/[0.06]" />
          <Image src="/favicon-v3.svg" alt="" width={42} height={42} priority />
        </div>

        <p className="mt-7 text-[13px] font-semibold tracking-[-0.01em] text-foreground">Adakan Software</p>
        <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>

        <div className="mt-6 h-px w-36 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
          <span className="loading-progress block h-full w-2/3 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  )
}
