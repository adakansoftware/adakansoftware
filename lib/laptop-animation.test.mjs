import assert from "node:assert/strict"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import sharp from "sharp"

import * as laptopAnimation from "./laptop-animation.ts"

import {
  advanceLaptopMotion,
  calculateLaptopMotion,
  LAPTOP_FRAME_COUNT,
  LAPTOP_SHEET_COUNT,
  resolveLaptopViewportHeight,
  laptopSpriteFrame,
  laptopFrameSource,
} from "./laptop-animation.ts"

test("mobile smoothing approaches a distant frame without snapping to it", () => {
  const current = { frame: 1, messageProgress: 0 }
  const target = { frame: LAPTOP_FRAME_COUNT, messageProgress: 1 }
  const next = advanceLaptopMotion(current, target, 1000 / 120)

  assert.ok(next.frame > current.frame)
  assert.ok(next.frame < 2, "a 120 Hz display must not race through several frames per refresh")
  assert.equal(next.messageProgress, 0)
})

test("mobile smoothing takes the same real time at 60 Hz and 120 Hz", () => {
  const target = { frame: LAPTOP_FRAME_COUNT, messageProgress: 1 }
  const simulate = (refreshRate, durationMs) => {
    let motion = { frame: 1, messageProgress: 0 }
    const deltaMs = 1000 / refreshRate
    const steps = Math.round(durationMs / deltaMs)
    for (let index = 0; index < steps; index += 1) {
      motion = advanceLaptopMotion(motion, target, deltaMs)
    }
    return motion
  }

  const at60Hz = simulate(60, 1000)
  const at120Hz = simulate(120, 1000)

  assert.ok(Math.abs(at60Hz.frame - at120Hz.frame) < 0.001)
  assert.ok(at60Hz.frame < LAPTOP_FRAME_COUNT / 2, "the lid should still be opening after one second")
})

test("screen message waits until the physical lid is open", () => {
  let motion = { frame: 1, messageProgress: 0 }
  const target = { frame: LAPTOP_FRAME_COUNT, messageProgress: 1 }

  for (let index = 0; index < 120; index += 1) {
    motion = advanceLaptopMotion(motion, target, 1000 / 60)
  }
  assert.equal(motion.messageProgress, 0)

  while (motion.frame < LAPTOP_FRAME_COUNT) {
    motion = advanceLaptopMotion(motion, target, 1000 / 60)
  }
  motion = advanceLaptopMotion(motion, target, 1000 / 60)
  assert.ok(motion.messageProgress > 0)
})

test("mobile smoothing settles exactly on its target in both directions", () => {
  let motion = { frame: 1, messageProgress: 0 }
  const open = { frame: LAPTOP_FRAME_COUNT, messageProgress: 1 }
  for (let index = 0; index < 360; index += 1) motion = advanceLaptopMotion(motion, open, 1000 / 60)
  assert.deepEqual(motion, open)

  const closed = { frame: 1, messageProgress: 0 }
  for (let index = 0; index < 240; index += 1) motion = advanceLaptopMotion(motion, closed, 1000 / 60)
  assert.deepEqual(motion, closed)
})

test("laptop story uses one motion path and scroll range across viewport sizes", () => {
  const component = readFileSync(join("components", "laptop-reveal.tsx"), "utf8")
  const styles = readFileSync(join("app", "studio.css"), "utf8")
  const mobileStyles = styles.slice(
    styles.indexOf("@media (max-width: 640px)"),
    styles.indexOf("@media (max-width: 370px)"),
  )

  assert.doesNotMatch(component, /matchMedia\("\(max-width: 640px\)"\)/)
  assert.match(component, /advanceLaptopMotion\(motionRef\.current, target, elapsedMs\)/)
  assert.match(styles, /\.studio-laptop-story \{[^}]*min-height: 250svh;/)
  assert.doesNotMatch(mobileStyles, /\.studio-laptop-story \{[^}]*min-height:/)
})

test("mobile browser chrome changes do not alter the laptop story viewport", () => {
  assert.equal(resolveLaptopViewportHeight(2110, 844), 844)
  assert.equal(resolveLaptopViewportHeight(1850, 844), 740)
  assert.equal(resolveLaptopViewportHeight(1850, 760), 740)
})

test("laptop animation retains decoded sprites and pauses while the page is hidden", () => {
  const component = readFileSync(join("components", "laptop-reveal.tsx"), "utf8")

  assert.match(component, /retainedSprites/)
  assert.match(component, /await image\.decode\(\)/)
  assert.doesNotMatch(component, /pendingImages\.delete\(image\)/)
  assert.match(component, /visibilitychange/)
  assert.match(component, /document\.hidden/)
})

test("laptop frames use already decoded sprite sheets without delayed layer swaps", () => {
  const component = readFileSync(join("components", "laptop-reveal.tsx"), "utf8")

  assert.equal(typeof laptopAnimation.resolveLaptopSprite, "function")
  const current = { source: "/sheet-01.webp", backgroundPosition: "0% 0%" }
  const sameSheetTarget = { source: "/sheet-01.webp", backgroundPosition: "50% 0%" }
  const nextSheetTarget = { source: "/sheet-02.webp", backgroundPosition: "0% 0%" }

  assert.deepEqual(
    laptopAnimation.resolveLaptopSprite(current, sameSheetTarget, new Set()),
    sameSheetTarget,
  )
  assert.deepEqual(
    laptopAnimation.resolveLaptopSprite(current, nextSheetTarget, new Set()),
    current,
  )
  assert.deepEqual(
    laptopAnimation.resolveLaptopSprite(current, nextSheetTarget, new Set([nextSheetTarget.source])),
    nextSheetTarget,
  )
  assert.match(component, /await image\.decode\(\)/)
  assert.match(component, /decodedSpriteSources/)
  assert.match(component, /resolveLaptopSprite/)
})

test("short landscape viewports constrain the laptop by available height", () => {
  const styles = readFileSync(join("app", "studio.css"), "utf8")
  const landscapeStart = styles.indexOf("@media (orientation: landscape) and (max-height: 500px)")

  assert.ok(landscapeStart >= 0, "short landscape layout needs its own height-aware rules")
  const landscapeStyles = styles.slice(landscapeStart, styles.indexOf("@media", landscapeStart + 1))
  assert.match(landscapeStyles, /\.studio-laptop-sticky \{[^}]*padding: 12px 16px 8px;/)
  assert.match(landscapeStyles, /\.studio-laptop-product \{[^}]*width: auto;[^}]*height: calc\(100svh - 180px\);[^}]*max-width: 94vw;/)
})

test("Blender animation rotates the display around the model hinge", () => {
  const renderer = readFileSync(join("scripts", "render-imported-macbook.py"), "utf8")

  assert.match(renderer, /hinge_reference = bpy\.data\.objects\.get\("UEFeUEhkJPdlgXF"\)/)
  assert.match(renderer, /hinge_center = \(hinge_min \+ hinge_max\) \/ 2/)
  assert.match(renderer, /hinge_center\.z \+= 0\.0015/)
  assert.match(renderer, /109\.6/)
  assert.doesNotMatch(renderer, /base_max\.y - 0\.006/)
})

test("laptop animation stays closed before its scroll story begins", () => {
  assert.deepEqual(
    calculateLaptopMotion({ sectionTop: 320, sectionHeight: 1800, viewportHeight: 720 }),
    { frame: 1, messageProgress: 0 },
  )
})

test("laptop animation reaches the final frame and message at the story end", () => {
  assert.deepEqual(
    calculateLaptopMotion({ sectionTop: -1080, sectionHeight: 1800, viewportHeight: 720 }),
    { frame: LAPTOP_FRAME_COUNT, messageProgress: 1 },
  )
})

test("laptop animation is deterministic while scrolling in either direction", () => {
  const position = { sectionTop: -540, sectionHeight: 1800, viewportHeight: 720 }
  const first = calculateLaptopMotion(position)
  const second = calculateLaptopMotion(position)

  assert.deepEqual(second, first)
  assert.ok(first.frame > 1 && first.frame < LAPTOP_FRAME_COUNT)
})

test("laptop frame paths are clamped and zero padded for both themes", () => {
  assert.equal(laptopFrameSource(0, "light"), "/laptop-frames/light/laptop-0001.webp?v=5")
  assert.equal(laptopFrameSource(999, "dark"), "/laptop-frames/dark/laptop-0072.webp?v=5")
})

test("laptop frames map to a small set of sprite sheets", () => {
  assert.equal(LAPTOP_SHEET_COUNT, 12)
  assert.deepEqual(laptopSpriteFrame(1, "light"), {
    source: "/laptop-sprites/light/sheet-01.webp?v=4",
    backgroundPosition: "0% 0%",
  })
  assert.deepEqual(laptopSpriteFrame(6, "dark"), {
    source: "/laptop-sprites/dark/sheet-01.webp?v=4",
    backgroundPosition: "100% 100%",
  })
  assert.deepEqual(laptopSpriteFrame(7, "light"), {
    source: "/laptop-sprites/light/sheet-02.webp?v=4",
    backgroundPosition: "0% 0%",
  })
})

test("light and dark laptop sprite sheets ship as non-empty assets", () => {
  for (const theme of ["light", "dark"]) {
    for (let sheet = 1; sheet <= LAPTOP_SHEET_COUNT; sheet += 1) {
      const name = `sheet-${String(sheet).padStart(2, "0")}.webp`
      assert.ok(statSync(join("public", "laptop-sprites", theme, name)).size > 0)
    }
  }
})

test("light and dark laptop sequences ship every non-empty frame", () => {
  const expectedNames = Array.from(
    { length: LAPTOP_FRAME_COUNT },
    (_, index) => `laptop-${String(index + 1).padStart(4, "0")}.webp`,
  )

  for (const theme of ["light", "dark"]) {
    const directory = join("public", "laptop-frames", theme)
    assert.deepEqual(readdirSync(directory).sort(), expectedNames)
    for (const name of expectedNames) assert.ok(statSync(join(directory, name)).size > 0)
  }
})

test("light theme uses a genuinely light laptop scene", async () => {
  const styles = readFileSync(join("app", "studio.css"), "utf8")
  assert.match(styles, /\.studio-laptop-story \{[^}]*background: #d6d6d6;[^}]*color: #1d1d1f;/)
  assert.match(styles, /\.dark \.studio-laptop-story \{[^}]*background: #000;[^}]*color: #f5f5f7;/)

  for (const frame of [1, LAPTOP_FRAME_COUNT]) {
    const name = `laptop-${String(frame).padStart(4, "0")}.webp`
    const lightPixel = await sharp(join("public", "laptop-frames", "light", name))
      .extract({ left: 0, top: 0, width: 1, height: 1 })
      .raw()
      .toBuffer()
    const darkPixel = await sharp(join("public", "laptop-frames", "dark", name))
      .extract({ left: 0, top: 0, width: 1, height: 1 })
      .raw()
      .toBuffer()

    assert.ok(lightPixel[0] > 200 && lightPixel[1] > 200 && lightPixel[2] > 200)
    assert.ok(darkPixel[0] < 20 && darkPixel[1] < 20 && darkPixel[2] < 20)
  }
})
