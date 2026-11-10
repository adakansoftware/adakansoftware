import { copyFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'
import process from 'node:process'

const source = process.argv[2] ?? 'source-assets/adakan-logo-v4-original.png'
await mkdir('source-assets', { recursive: true })
if (process.argv[2]) await copyFile(source, 'source-assets/adakan-logo-v4-original.png')
const artwork = await sharp(source).trim({ threshold: 0 }).png().toBuffer()
const transparent = { r: 0, g: 0, b: 0, alpha: 0 }
async function png(file, size) {
  await sharp(artwork).resize(size, size, { fit: 'contain', background: transparent }).png({ compressionLevel: 9 }).toFile(file)
}
await png('public/adakan-logo-v4.png', 1024)
await png('public/adakan-logo.png', 1024)
for (const [file, size] of [
  ['favicon-48-v4.png', 48], ['icon-192-v4.png', 192],
  ['icon-512-v4.png', 512], ['apple-icon-180-v4.png', 180],
  ['favicon.png', 48], ['favicon-32.png', 32], ['favicon-512.png', 512],
  ['icon-light-32x32.png', 32], ['icon-dark-32x32.png', 32],
  ['apple-icon.png', 180], ['apple-icon-180.png', 180],
]) await png(`public/${file}`, size)
await png('public/projects/adakan-software-logo.png', 1024)
await sharp('public/projects/adakan-software-logo.png').webp({ lossless: true }).toFile('public/projects/optimized/adakan-software-logo.webp')
await sharp('public/projects/adakan-software-logo.png').avif({ lossless: true }).toFile('public/projects/optimized/adakan-software-logo.avif')

