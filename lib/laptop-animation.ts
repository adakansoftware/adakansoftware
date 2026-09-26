export const LAPTOP_FRAME_COUNT = 72
export const LAPTOP_FRAMES_PER_SHEET = 6
export const LAPTOP_SHEET_COUNT = LAPTOP_FRAME_COUNT / LAPTOP_FRAMES_PER_SHEET
export const LAPTOP_OPENING_START = 0.06
export const LAPTOP_OPENING_END = 0.78
export const LAPTOP_MESSAGE_DURATION = 0.16
export const LAPTOP_STORY_VIEWPORTS = 2.5
export const LAPTOP_FRAME_VERSION = "2"
export const LAPTOP_SPRITE_VERSION = "1"

export type LaptopTheme = "light" | "dark"

type LaptopMotionInput = {
  sectionTop: number
  sectionHeight: number
  viewportHeight: number
}

export type LaptopMotion = {
  frame: number
  messageProgress: number
}

const LAPTOP_MOBILE_FRAMES_PER_SECOND = 20
const LAPTOP_MOBILE_MESSAGE_DURATION_MS = 1600

function moveTowards(current: number, target: number, maximumDistance: number) {
  const difference = target - current
  if (Math.abs(difference) <= maximumDistance) return target
  return current + Math.sign(difference) * maximumDistance
}

export function advanceLaptopMotion(
  current: LaptopMotion,
  target: LaptopMotion,
  deltaMs = 1000 / 60,
): LaptopMotion {
  const elapsedMs = clamp(deltaMs, 0, 50)
  const nextFrame = moveTowards(
    current.frame,
    target.frame,
    LAPTOP_MOBILE_FRAMES_PER_SECOND * elapsedMs / 1000,
  )
  const visibleMessageTarget = nextFrame >= LAPTOP_FRAME_COUNT
    ? target.messageProgress
    : 0
  const nextMessageProgress = moveTowards(
    current.messageProgress,
    visibleMessageTarget,
    elapsedMs / LAPTOP_MOBILE_MESSAGE_DURATION_MS,
  )

  return {
    frame: clamp(nextFrame, 1, LAPTOP_FRAME_COUNT),
    messageProgress: clamp(nextMessageProgress, 0, 1),
  }
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function resolveLaptopViewportHeight(
  sectionHeight: number,
  browserViewportHeight: number,
) {
  const stableStoryViewportHeight = sectionHeight / LAPTOP_STORY_VIEWPORTS
  return Math.min(browserViewportHeight, stableStoryViewportHeight)
}

export function laptopFrameSource(frame: number, theme: LaptopTheme) {
  const safeFrame = clamp(Math.round(frame), 1, LAPTOP_FRAME_COUNT)
  return `/laptop-frames/${theme}/laptop-${String(safeFrame).padStart(4, "0")}.webp?v=${LAPTOP_FRAME_VERSION}`
}

export function laptopSpriteFrame(frame: number, theme: LaptopTheme) {
  const safeFrame = clamp(Math.round(frame), 1, LAPTOP_FRAME_COUNT)
  const frameIndex = safeFrame - 1
  const sheet = Math.floor(frameIndex / LAPTOP_FRAMES_PER_SHEET) + 1
  const positionInSheet = frameIndex % LAPTOP_FRAMES_PER_SHEET
  const column = positionInSheet % 3
  const row = Math.floor(positionInSheet / 3)

  return {
    source: `/laptop-sprites/${theme}/sheet-${String(sheet).padStart(2, "0")}.webp?v=${LAPTOP_SPRITE_VERSION}`,
    backgroundPosition: `${column * 50}% ${row * 100}%`,
  }
}

export function calculateLaptopMotion({
  sectionTop,
  sectionHeight,
  viewportHeight,
}: LaptopMotionInput): LaptopMotion {
  const scrollRange = Math.max(sectionHeight - viewportHeight, 1)
  const storyProgress = clamp(-sectionTop / scrollRange, 0, 1)
  const openingProgress = clamp(
    (storyProgress - LAPTOP_OPENING_START) / (LAPTOP_OPENING_END - LAPTOP_OPENING_START),
    0,
    1,
  )

  return {
    frame: 1 + Math.round(openingProgress * (LAPTOP_FRAME_COUNT - 1)),
    messageProgress: clamp(
      (storyProgress - LAPTOP_OPENING_END) / LAPTOP_MESSAGE_DURATION,
      0,
      1,
    ),
  }
}
