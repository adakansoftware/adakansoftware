"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

import type { Locale } from "@/lib/i18n"
import {
  advanceLaptopMotion,
  calculateLaptopMotion,
  clamp,
  LAPTOP_FRAME_COUNT,
  LAPTOP_FRAMES_PER_SHEET,
  LAPTOP_SHEET_COUNT,
  laptopSpriteFrame,
  resolveLaptopSprite,
  resolveLaptopViewportHeight,
  type LaptopSprite,
  type LaptopTheme,
} from "@/lib/laptop-animation"

const themes: LaptopTheme[] = ["light", "dark"]

function useDecodedLaptopSprite(
  target: LaptopSprite,
  decodedSources: ReadonlySet<string>,
) {
  const [displayed, setDisplayed] = useState(target)

  useEffect(() => {
    setDisplayed((current) => resolveLaptopSprite(current, target, decodedSources))
  }, [decodedSources, target.backgroundPosition, target.source])

  return displayed.source === target.source ? target : displayed
}

export function LaptopReveal({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null)
  const motionRef = useRef({ frame: 1, messageProgress: 0 })
  const targetMotionRef = useRef({ frame: 1, messageProgress: 0 })
  const reduceMotion = useReducedMotion()
  const [motion, setMotion] = useState({ frame: 1, messageProgress: 0 })
  const [decodedSpriteSources, setDecodedSpriteSources] = useState<ReadonlySet<string>>(
    () => new Set(),
  )

  useEffect(() => {
    if (reduceMotion) return
    const observedSection = sectionRef.current
    if (!observedSection) return

    let animationFrame = 0
    let previousAnimationTime = 0
    const readTargetMotion = () => {
      const section = sectionRef.current
      if (!section) return targetMotionRef.current

      return calculateLaptopMotion({
        sectionTop: section.getBoundingClientRect().top,
        sectionHeight: section.offsetHeight,
        viewportHeight: resolveLaptopViewportHeight(section.offsetHeight),
      })
    }

    const commitMotion = (nextMotion: typeof motion) => {
      motionRef.current = nextMotion
      setMotion((currentMotion) => {
        const frameChanged = Math.round(currentMotion.frame) !== Math.round(nextMotion.frame)
        const messageChanged = Math.abs(
          currentMotion.messageProgress - nextMotion.messageProgress,
        ) >= 0.001
        return frameChanged || messageChanged ? nextMotion : currentMotion
      })
    }

    const animateToTarget = (timestamp: number) => {
      animationFrame = 0
      const target = targetMotionRef.current
      const elapsedMs = previousAnimationTime
        ? Math.min(timestamp - previousAnimationTime, 50)
        : 1000 / 60
      previousAnimationTime = timestamp
      const nextMotion = advanceLaptopMotion(motionRef.current, target, elapsedMs)
      commitMotion(nextMotion)

      if (
        nextMotion.frame !== target.frame ||
        Math.abs(nextMotion.messageProgress - target.messageProgress) >= 0.005
      ) {
        animationFrame = window.requestAnimationFrame(animateToTarget)
      } else {
        previousAnimationTime = 0
      }
    }

    const requestFrameUpdate = () => {
      targetMotionRef.current = readTargetMotion()
      if (document.hidden) return
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animateToTarget)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
        previousAnimationTime = 0
        return
      }

      previousAnimationTime = 0
      requestFrameUpdate()
    }

    const initialMotion = readTargetMotion()
    targetMotionRef.current = initialMotion
    commitMotion(initialMotion)
    window.addEventListener("scroll", requestFrameUpdate, { passive: true })
    window.addEventListener("resize", requestFrameUpdate)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    const resizeObserver = new ResizeObserver(requestFrameUpdate)
    resizeObserver.observe(observedSection)

    return () => {
      window.removeEventListener("scroll", requestFrameUpdate)
      window.removeEventListener("resize", requestFrameUpdate)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      resizeObserver.disconnect()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return

    const section = sectionRef.current
    if (!section) return
    const retainedSprites = new Set<HTMLImageElement>()
    let active = true

    const markDecoded = (source: string) => {
      if (!active) return
      setDecodedSpriteSources((current) => {
        if (current.has(source)) return current
        const next = new Set(current)
        next.add(source)
        return next
      })
    }

    const loadSprites = () => {
      for (const theme of themes) {
        for (let sheet = 0; sheet < LAPTOP_SHEET_COUNT; sheet += 1) {
          const image = new window.Image()
          image.decoding = "async"
          retainedSprites.add(image)
          const source = laptopSpriteFrame(
            sheet * LAPTOP_FRAMES_PER_SHEET + 1,
            theme,
          ).source
          image.src = source
          void (async () => {
            try {
              await image.decode()
              markDecoded(source)
            } catch {
              if (image.complete && image.naturalWidth > 0) markDecoded(source)
            }
          })()
        }
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        loadSprites()
      },
      { rootMargin: "100% 0px" },
    )
    observer.observe(section)

    return () => {
      active = false
      observer.disconnect()
      for (const image of retainedSprites) {
        image.onload = null
        image.onerror = null
        image.src = ""
      }
      retainedSprites.clear()
    }
  }, [reduceMotion])

  const visibleFrame = reduceMotion ? LAPTOP_FRAME_COUNT : motion.frame
  const messageProgress = reduceMotion ? 1 : motion.messageProgress
  const targetLightSprite = laptopSpriteFrame(visibleFrame, "light")
  const targetDarkSprite = laptopSpriteFrame(visibleFrame, "dark")
  const lightSprite = useDecodedLaptopSprite(targetLightSprite, decodedSpriteSources)
  const darkSprite = useDecodedLaptopSprite(targetDarkSprite, decodedSpriteSources)
  const headline = locale === "tr"
    ? ["Fikri ürüne.", "Ürünü etkiye."]
    : ["Ideas to products.", "Products to impact."]
  const capabilities = locale === "tr"
    ? "Strateji · Tasarım · Yazılım"
    : "Strategy · Design · Software"

  return (
    <section ref={sectionRef} className="studio-laptop-story" aria-label={locale === "tr" ? "Dijital ürün deneyimi" : "Digital product experience"}>
      <div className="studio-laptop-sticky">
        <div className="studio-laptop-heading">
          <p>{locale === "tr" ? "Fikirden çalışan ürüne" : "From idea to working product"}</p>
          <h2>{locale === "tr" ? "Detaylar açıldıkça fark görünür." : "The difference appears in the details."}</h2>
        </div>
        <div className="studio-laptop-product" aria-hidden="true">
          <div
            className="studio-laptop-frame studio-laptop-frame-light"
            style={{
              backgroundImage: `url("${lightSprite.source}")`,
              backgroundPosition: lightSprite.backgroundPosition,
            }}
          />
          <div
            className="studio-laptop-frame studio-laptop-frame-dark"
            style={{
              backgroundImage: `url("${darkSprite.source}")`,
              backgroundPosition: darkSprite.backgroundPosition,
            }}
          />
          <div
            className="studio-laptop-screen-message"
            style={{ opacity: clamp(messageProgress * 2.5, 0, 1) }}
          >
            <span
              className="studio-laptop-screen-overline"
              style={{
                opacity: clamp(messageProgress / 0.18, 0, 1),
                transform: `translate3d(0, ${(1 - clamp(messageProgress / 0.18, 0, 1)) * 8}px, 0)`,
              }}
            >
              <i aria-hidden="true" />
              Adakan Software
            </span>
            <div className="studio-laptop-screen-words">
              {headline.map((line, index) => {
                const wordProgress = clamp((messageProgress - 0.12 - index * 0.2) / 0.32, 0, 1)
                return (
                  <strong
                    key={line}
                    style={{
                      opacity: wordProgress,
                      filter: `blur(${(1 - wordProgress) * 5}px)`,
                      transform: `translate3d(0, ${(1 - wordProgress) * 14}px, 0)`,
                    }}
                  >
                    {line}
                  </strong>
                )
              })}
            </div>
            <span
              className="studio-laptop-screen-capabilities"
              style={{
                opacity: clamp((messageProgress - 0.62) / 0.24, 0, 1),
                transform: `translate3d(0, ${(1 - clamp((messageProgress - 0.62) / 0.24, 0, 1)) * 8}px, 0)`,
              }}
            >
              {capabilities}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
