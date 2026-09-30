/* global console, process */
import { pathToFileURL } from "node:url"

import { neon } from "@neondatabase/serverless"

import { eraseExpiredContactRequests, previewExpiredContactRequests } from "../lib/server/contact-retention.ts"

export function parseCleanupMode(args) {
  if (args.length === 0 || (args.length === 1 && args[0] === "--dry-run")) return "dry-run"
  if (args.length === 1 && args[0] === "--apply") return "apply"
  throw new Error("Usage: cleanup-contact-data.mjs [--dry-run|--apply]")
}

export async function runContactCleanup({ args = process.argv.slice(2), env = process.env } = {}) {
  const mode = parseCleanupMode(args)
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL is required")
  const sql = neon(env.DATABASE_URL)
  const result = mode === "apply"
    ? await eraseExpiredContactRequests(sql, new Date(), "kvkk-cleanup-cli")
    : await previewExpiredContactRequests(sql, new Date())
  return { mode, ...result }
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url
if (isMain) {
  try {
    console.log(JSON.stringify(await runContactCleanup()))
  } catch (error) {
    console.error(error instanceof Error ? error.message : "KVKK cleanup failed")
    process.exitCode = 1
  }
}
