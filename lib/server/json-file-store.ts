import { randomUUID } from "node:crypto"
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises"
import { dirname } from "node:path"

let writeQueue = Promise.resolve()

async function ensureParentDirectory(filePath: string) {
  await mkdir(dirname(filePath), { recursive: true })
}

function enqueueWrite(operation: () => Promise<void>) {
  const result = writeQueue.then(operation)
  // Preserve the error for this caller while letting later operations run.
  writeQueue = result.catch(() => {})
  return result
}

async function replaceJsonFile(filePath: string, value: unknown) {
  const content = `${JSON.stringify(value, null, 2)}\n`
  await ensureParentDirectory(filePath)
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`
  try {
    await writeFile(temporaryPath, content, { encoding: "utf8", flag: "wx", mode: 0o600 })
    await rename(temporaryPath, filePath)
  } finally {
    await unlink(temporaryPath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error
    })
  }
}

export async function readJsonFile<T>(filePath: string, fallback: T) {
  try {
    const content = await readFile(filePath, "utf8")
    return JSON.parse(content) as T
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return fallback
    }

    throw error
  }
}

export function writeJsonFile(filePath: string, value: unknown) {
  return enqueueWrite(() => replaceJsonFile(filePath, value))
}

export function updateJsonFile<T>(filePath: string, fallback: T, updater: (currentValue: T) => T | Promise<T>) {
  return enqueueWrite(async () => {
    const currentValue = await readJsonFile(filePath, fallback)
    const nextValue = await updater(currentValue)
    await replaceJsonFile(filePath, nextValue)
  })
}
