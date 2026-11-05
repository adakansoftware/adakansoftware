"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

import type { Locale } from "@/lib/i18n"
import {
  advanceLaptopMotion,
  calculateLaptopMotion,
  clamp,
  resolveLaptopScrollTarget,
  hasLaptopViewportOrientationChanged,
  LAPTOP_FRAME_COUNT,
  LAPTOP_FRAMES_PER_SHEET,
  LAPTOP_SHEET_COUNT,
  LAPTOP_TOUCH_FRAMES_PER_SECOND,
  LAPTOP_DESKTOP_FRAMES_PER_SECOND,
  laptopSpriteFrame,
  laptopSpriteFrameRect,
  resolveLaptopSprite,
  resolveLaptopViewportHeight,
  type LaptopSprite,
  type LaptopTheme,
} from "@/lib/laptop-animation"

const themes: LaptopTheme[] = ["light", "dark"]

function resolveActiveTheme(): LaptopTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export function LaptopReveal({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null)
  const productRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const overlineRef = useRef<HTMLSpanElement>(null)
  const firstWordRef = useRef<HTMLElement>(null)
  const secondWordRef = useRef<HTMLElement>(null)
  const capabilitiesRef = useRef<HTMLSpanElement>(null)
  const motionRef = useRef({ frame: 1, messageProgress: 0 })
  const targetMotionRef = useRef({ frame: 1, messageProgress: 0 })
  const spriteImagesRef = useRef(new Map<string, HTMLImageElement>())
  const decodedSpriteSourcesRef = useRef<ReadonlySet<string>>(new Set())
  const displayedSpriteRef = useRef<LaptopSprite>(laptopSpriteFrame(1, "light"))
  const lastDrawnRef = useRef({ frame: 0, width: 0, height: 0 })
  const lastMessageProgressRef = useRef(-1)
  const reduceMotion = useReducedMotion()

  const drawFrame = (frame: number, theme: LaptopTheme) => {
    const canvas = canvasRef.current
    const product = productRef.current
    if (!canvas || !product) return

    const targetSprite = laptopSpriteFrame(frame, theme)
    const resolvedSprite = resolveLaptopSprite(
      displayedSpriteRef.current,
      targetSprite,
      decodedSpriteSourcesRef.current,
    )
    displayedSpriteRef.current = resolvedSprite
    if (resolvedSprite.source !== targetSprite.source) return

    const image = spriteImagesRef.current.get(targetSprite.source)
    if (!image || !image.complete || image.naturalWidth === 0) return
    const context = canvas.getContext("2d")
    if (!context) return

    const cssWidth = product.clientWidth
    const cssHeight = product.clientHeight
    if (cssWidth === 0 || cssHeight === 0) return
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const pixelWidth = Math.round(cssWidth * pixelRatio)
    const pixelHeight = Math.round(cssHeight * pixelRatio)
    if (
      lastDrawnRef.current.frame === frame
      && lastDrawnRef.current.width === pixelWidth
      && lastDrawnRef.current.height === pixelHeight
    ) return

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    context.clearRect(0, 0, cssWidth, cssHeight)
    const rect = laptopSpriteFrameRect(frame)
    context.drawImage(
      image,
      rect.sourceX,
      rect.sourceY,
      rect.width,
      rect.height,
      0,
      0,
      cssWidth,
      cssHeight,
    )
    lastDrawnRef.current = { frame, width: pixelWidth, height: pixelHeight }
  }

  const setMessageProgress = (messageProgress: number) => {
    if (Math.abs(messageProgress - lastMessageProgressRef.current) < 0.001) return
    lastMessageProgressRef.current = messageProgress

    const message = messageRef.current
    if (message) message.style.opacity = String(clamp(messageProgress * 2.5, 0, 1))

    const overline = overlineRef.current
    if (overline) {
      const overlineProgress = clamp(messageProgress / 0.18, 0, 1)
      overline.style.opacity = String(overlineProgress)
      overline.style.transform = `translate3d(0, ${(1 - overlineProgress) * 8}px, 0)`
    }

    for (const wordRef of [firstWordRef, secondWordRef]) {
      const word = wordRef.current
      if (!word) continue
      const index = wordRef === firstWordRef ? 0 : 1
      const wordProgress = clamp((messageProgress - 0.12 - index * 0.2) / 0.32, 0, 1)
      word.style.opacity = String(wordProgress)
      word.style.transform = `translate3d(0, ${(1 - wordProgress) * 14}px, 0)`
    }

    const capabilities = capabilitiesRef.current
    if (capabilities) {
      const capabilitiesProgress = clamp((messageProgress - 0.62) / 0.24, 0, 1)
      capabilities.style.opacity = String(capabilitiesProgress)
      capabilities.style.transform = `translate3d(0, ${(1 - capabilitiesProgress) * 8}px, 0)`
    }
  }

  const renderCurrentState = (reduced: boolean) => {
    drawFrame(
      reduced ? LAPTOP_FRAME_COUNT : Math.round(motionRef.current.frame),
      resolveActiveTheme(),
    )
    setMessageProgress(reduced ? 1 : motionRef.current.messageProgress)
  }

  useEffect(() => {
    if (reduceMotion) return
    const observedSection = sectionRef.current
    if (!observedSection) return

    let animationFrame = 0
    let previousAnimationTime = 0
    let isReorienting = false
    let ignoreViewportScrollUntil = 0
    let orientationSettleTimer = 0
    const isTouchViewport = navigator.maxTouchPoints > 0
      || window.matchMedia("(pointer: coarse)").matches
    let lastScrollY = window.scrollY
    let viewport = { width: window.innerWidth, height: window.innerHeight }
    const readTargetMotion = () => {
      const section = sectionRef.current
      if (!section) return targetMotionRef.current

      return calculateLaptopMotion({
        sectionTop: section.getBoundingClientRect().top,
        sectionHeight: section.offsetHeight,
        viewportHeight: resolveLaptopViewportHeight(section.offsetHeight),
      })
    }

    const commitMotion = (nextMotion: typeof motionRef.current) => {
      motionRef.current = nextMotion
      drawFrame(Math.round(nextMotion.frame), resolveActiveTheme())
      setMessageProgress(nextMotion.messageProgress)
    }

    const animateToTarget = (timestamp: number) => {
      animationFrame = 0
      const target = targetMotionRef.current
      const elapsedMs = previousAnimationTime
        ? Math.min(timestamp - previousAnimationTime, 50)
        : 1000 / 60
      previousAnimationTime = timestamp
      const nextMotion = advanceLaptopMotion(
        motionRef.current,
        target,
        elapsedMs,
        isTouchViewport ? LAPTOP_TOUCH_FRAMES_PER_SECOND : LAPTOP_DESKTOP_FRAMES_PER_SECOND,
      )
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
      const nextScrollY = window.scrollY
      const scrollDelta = nextScrollY - lastScrollY
      lastScrollY = nextScrollY

      if (isReorienting) return
      const now = performance.now()
      if (now < ignoreViewportScrollUntil) return
      const candidate = readTargetMotion()
      const nextTarget = isTouchViewport
        ? resolveLaptopScrollTarget(targetMotionRef.current, candidate, scrollDelta)
        : candidate

      targetMotionRef.current = nextTarget
      if (document.hidden) return
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animateToTarget)
    }

    const settleOrientation = () => {
      if (orientationSettleTimer) window.clearTimeout(orientationSettleTimer)
      orientationSettleTimer = window.setTimeout(() => {
        isReorienting = false
        orientationSettleTimer = 0
      }, 500)
    }

    const handleResize = () => {
      const nextViewport = { width: window.innerWidth, height: window.innerHeight }
      const orientationChanged = hasLaptopViewportOrientationChanged(viewport, nextViewport)
      viewport = nextViewport

      if (orientationChanged) {
        isReorienting = true
        ignoreViewportScrollUntil = performance.now() + 1000
        targetMotionRef.current = motionRef.current
        if (animationFrame) window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
        previousAnimationTime = 0
      }

      if (isReorienting) {
        lastScrollY = window.scrollY
        settleOrientation()
      }
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
    window.addEventListener("resize", handleResize)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("scroll", requestFrameUpdate)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (orientationSettleTimer) window.clearTimeout(orientationSettleTimer)
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
      if (decodedSpriteSourcesRef.current.has(source)) return
      decodedSpriteSourcesRef.current = new Set([...decodedSpriteSourcesRef.current, source])
      drawFrame(Math.round(motionRef.current.frame), resolveActiveTheme())
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
          spriteImagesRef.current.set(source, image)
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

    loadSprites()

    return () => {
      active = false
      for (const image of retainedSprites) {
        image.onload = null
        image.onerror = null
        image.src = ""
      }
      retainedSprites.clear()
    }
  }, [reduceMotion])

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      lastDrawnRef.current = { frame: 0, width: 0, height: 0 }
      renderCurrentState(reduceMotion ?? false)
    })
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const product = productRef.current
    if (!product) return
    const observer = new ResizeObserver(() => {
      lastDrawnRef.current = { frame: 0, width: 0, height: 0 }
      drawFrame(Math.round(motionRef.current.frame), resolveActiveTheme())
    })
    observer.observe(product)
    return () => observer.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    if (!reduceMotion) return
    setMessageProgress(1)

    const retainedSprites = new Set<HTMLImageElement>()
    for (const theme of themes) {
      const sprite = laptopSpriteFrame(LAPTOP_FRAME_COUNT, theme)
      const image = new window.Image()
      image.decoding = "async"
      retainedSprites.add(image)
      spriteImagesRef.current.set(sprite.source, image)
      image.src = sprite.source
      void (async () => {
        try {
          await image.decode()
        } catch {
          // fall through to the complete check below
        }
        if (image.complete && image.naturalWidth > 0) {
          decodedSpriteSourcesRef.current = new Set([
            ...decodedSpriteSourcesRef.current,
            sprite.source,
          ])
          drawFrame(LAPTOP_FRAME_COUNT, resolveActiveTheme())
        }
      })()
    }

    return () => {
      for (const image of retainedSprites) {
        image.onload = null
        image.onerror = null
        image.src = ""
      }
      retainedSprites.clear()
    }
  }, [reduceMotion])

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
        <div className="studio-laptop-product" ref={productRef} aria-hidden="true">
          <canvas ref={canvasRef} className="studio-laptop-frame" />
          <div className="studio-laptop-screen-message" ref={messageRef}>
            <span className="studio-laptop-screen-overline" ref={overlineRef}>
              <i aria-hidden="true" />
              Adakan Software
            </span>
            <div className="studio-laptop-screen-words">
              <strong ref={firstWordRef}>{headline[0]}</strong>
              <strong ref={secondWordRef}>{headline[1]}</strong>
            </div>
            <span className="studio-laptop-screen-capabilities" ref={capabilitiesRef}>
              {capabilities}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
