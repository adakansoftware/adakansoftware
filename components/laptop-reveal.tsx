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
  type LaptopTheme,
} from "@/lib/laptop-animation"

const themes: LaptopTheme[] = ["light", "dark"]

export function LaptopReveal({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null)
  const preloadedSpritesRef = useRef<HTMLImageElement[]>([])
  const motionRef = useRef({ frame: 1, messageProgress: 0 })
  const targetMotionRef = useRef({ frame: 1, messageProgress: 0 })
  const reduceMotion = useReducedMotion()
  const [motion, setMotion] = useState({ frame: 1, messageProgress: 0 })

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
        viewportHeight: window.innerHeight,
      })
    }

    const commitMotion = (nextMotion: typeof motion) => {
      motionRef.current = nextMotion
      setMotion(nextMotion)
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
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animateToTarget)
    }

    const initialMotion = readTargetMotion()
    targetMotionRef.current = initialMotion
    commitMotion(initialMotion)
    window.addEventListener("scroll", requestFrameUpdate, { passive: true })
    window.addEventListener("resize", requestFrameUpdate)
    const resizeObserver = new ResizeObserver(requestFrameUpdate)
    resizeObserver.observe(observedSection)

    return () => {
      window.removeEventListener("scroll", requestFrameUpdate)
      window.removeEventListener("resize", requestFrameUpdate)
      resizeObserver.disconnect()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return

    const section = sectionRef.current
    if (!section) return

    const loadSprites = () => {
      for (const theme of themes) {
        for (let sheet = 0; sheet < LAPTOP_SHEET_COUNT; sheet += 1) {
          const image = new window.Image()
          image.decoding = "async"
          image.src = laptopSpriteFrame(
            sheet * LAPTOP_FRAMES_PER_SHEET + 1,
            theme,
          ).source
          preloadedSpritesRef.current.push(image)
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
      observer.disconnect()
      preloadedSpritesRef.current = []
    }
  }, [reduceMotion])

  const visibleFrame = reduceMotion ? LAPTOP_FRAME_COUNT : motion.frame
  const messageProgress = reduceMotion ? 1 : motion.messageProgress
  const lightSprite = laptopSpriteFrame(visibleFrame, "light")
  const darkSprite = laptopSpriteFrame(visibleFrame, "dark")
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
