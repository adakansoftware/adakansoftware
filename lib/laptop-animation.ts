export const LAPTOP_FRAME_COUNT = 72
export const LAPTOP_OPENING_START = 0.06
export const LAPTOP_OPENING_END = 0.78
export const LAPTOP_MESSAGE_DURATION = 0.16
export const LAPTOP_FRAME_VERSION = "2"

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

export function advanceLaptopMotion(current: LaptopMotion, target: LaptopMotion): LaptopMotion {
  const frameDifference = target.frame - current.frame
  const frameStep = Math.sign(frameDifference) * Math.max(1, Math.ceil(Math.abs(frameDifference) * 0.09))
  const nextFrame = Math.abs(frameDifference) <= 1 ? target.frame : current.frame + frameStep
  const messageDifference = target.messageProgress - current.messageProgress
  const nextMessageProgress = Math.abs(messageDifference) < 0.005
    ? target.messageProgress
    : current.messageProgress + messageDifference * 0.14

  return {
    frame: clamp(nextFrame, 1, LAPTOP_FRAME_COUNT),
    messageProgress: clamp(nextMessageProgress, 0, 1),
  }
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function laptopFrameSource(frame: number, theme: LaptopTheme) {
  const safeFrame = clamp(Math.round(frame), 1, LAPTOP_FRAME_COUNT)
  return `/laptop-frames/${theme}/laptop-${String(safeFrame).padStart(4, "0")}.webp?v=${LAPTOP_FRAME_VERSION}`
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
