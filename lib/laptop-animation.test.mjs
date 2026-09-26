import assert from "node:assert/strict"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

import {
  advanceLaptopMotion,
  calculateLaptopMotion,
  LAPTOP_FRAME_COUNT,
  laptopFrameSource,
} from "./laptop-animation.ts"

test("mobile smoothing approaches a distant frame without snapping to it", () => {
  const current = { frame: 1, messageProgress: 0 }
  const target = { frame: LAPTOP_FRAME_COUNT, messageProgress: 1 }
  const next = advanceLaptopMotion(current, target)

  assert.ok(next.frame > current.frame)
  assert.ok(next.frame < target.frame)
  assert.ok(next.messageProgress > 0 && next.messageProgress < 1)
})

test("mobile smoothing settles exactly on its target in both directions", () => {
  let motion = { frame: 1, messageProgress: 0 }
  const open = { frame: LAPTOP_FRAME_COUNT, messageProgress: 1 }
  for (let index = 0; index < 120; index += 1) motion = advanceLaptopMotion(motion, open)
  assert.deepEqual(motion, open)

  const closed = { frame: 1, messageProgress: 0 }
  for (let index = 0; index < 120; index += 1) motion = advanceLaptopMotion(motion, closed)
  assert.deepEqual(motion, closed)
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
  assert.equal(laptopFrameSource(0, "light"), "/laptop-frames/light/laptop-0001.webp?v=2")
  assert.equal(laptopFrameSource(999, "dark"), "/laptop-frames/dark/laptop-0072.webp?v=2")
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
