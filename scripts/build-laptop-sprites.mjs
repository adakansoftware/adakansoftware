import { mkdir } from "node:fs/promises"
import { join } from "node:path"

import sharp from "sharp"

const themes = ["light", "dark"]
const frameWidth = 960
const frameHeight = 540
const columns = 3
const rows = 2
const framesPerSheet = columns * rows
const frameCount = 72

for (const theme of themes) {
  const sourceDirectory = join("public", "laptop-frames", theme)
  const outputDirectory = join("public", "laptop-sprites", theme)
  await mkdir(outputDirectory, { recursive: true })

  for (let firstFrame = 1; firstFrame <= frameCount; firstFrame += framesPerSheet) {
    const sheet = Math.floor((firstFrame - 1) / framesPerSheet) + 1
    const composites = []

    for (let offset = 0; offset < framesPerSheet; offset += 1) {
      const frame = firstFrame + offset
      composites.push({
        input: join(sourceDirectory, `laptop-${String(frame).padStart(4, "0")}.webp`),
        left: (offset % columns) * frameWidth,
        top: Math.floor(offset / columns) * frameHeight,
      })
    }

    await sharp({
      create: {
        width: frameWidth * columns,
        height: frameHeight * rows,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(composites)
      .webp({ quality: 88, smartSubsample: true })
      .toFile(join(outputDirectory, `sheet-${String(sheet).padStart(2, "0")}.webp`))
  }
}
