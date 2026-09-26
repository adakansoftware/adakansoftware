"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import NextImage from "next/image"

import type { Locale } from "@/lib/i18n"
import {
  calculateLaptopMotion,
  clamp,
  LAPTOP_FRAME_COUNT,
  laptopFrameSource,
  type LaptopTheme,
} from "@/lib/laptop-animation"

const themes: LaptopTheme[] = ["light", "dark"]
const preloadBatchSize = 8

export function LaptopReveal({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null)
  const preloadedFramesRef = useRef<HTMLImageElement[]>([])
  const reduceMotion = useReducedMotion()
  const [motion, setMotion] = useState({ frame: 1, messageProgress: 0 })

  useEffect(() => {
    if (reduceMotion) return
    const observedSection = sectionRef.current
    if (!observedSection) return

    let animationFrame = 0
    const updateFrame = () => {
      animationFrame = 0
      const section = sectionRef.current
      if (!section) return

      const nextMotion = calculateLaptopMotion({
        sectionTop: section.getBoundingClientRect().top,
        sectionHeight: section.offsetHeight,
        viewportHeight: window.innerHeight,
      })
      setMotion((current) => {
        if (
          current.frame === nextMotion.frame &&
          Math.abs(current.messageProgress - nextMotion.messageProgress) < 0.005
        ) return current
        return nextMotion
      })
    }

    const requestFrameUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateFrame)
    }

    updateFrame()
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

    let cancelled = false
    let nextFrame = 1
    let timeoutId = 0

    const loadBatch = () => {
      if (cancelled || nextFrame > LAPTOP_FRAME_COUNT) return

      const batchEnd = Math.min(nextFrame + preloadBatchSize - 1, LAPTOP_FRAME_COUNT)
      for (; nextFrame <= batchEnd; nextFrame += 1) {
        for (const theme of themes) {
          const image = new window.Image()
          image.decoding = "async"
          image.src = laptopFrameSource(nextFrame, theme)
          preloadedFramesRef.current.push(image)
        }
      }
      timeoutId = window.setTimeout(loadBatch, 35)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        loadBatch()
      },
      { rootMargin: "100% 0px" },
    )
    observer.observe(section)

    return () => {
      cancelled = true
      observer.disconnect()
      window.clearTimeout(timeoutId)
      preloadedFramesRef.current = []
    }
  }, [reduceMotion])

  const visibleFrame = reduceMotion ? LAPTOP_FRAME_COUNT : motion.frame
  const messageProgress = reduceMotion ? 1 : motion.messageProgress
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
          <NextImage
            className="studio-laptop-frame studio-laptop-frame-light"
            src={laptopFrameSource(visibleFrame, "light")}
            alt=""
            width={960}
            height={540}
            decoding="async"
            unoptimized
          />
          <NextImage
            className="studio-laptop-frame studio-laptop-frame-dark"
            src={laptopFrameSource(visibleFrame, "dark")}
            alt=""
            width={960}
            height={540}
            decoding="async"
            unoptimized
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
