/* global console, process */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { findSecretCandidates } from "./check-secrets.mjs"

if (!existsSync(".next/static")) {
  console.error("Client secret scan requires a production build: run npm run build first.")
  process.exit(1)
}

const knownSecrets = Object.entries(process.env).filter(([name, value]) =>
  !name.startsWith("NEXT_PUBLIC_") && name !== "CF_ANALYTICS_TOKEN"
  && /SECRET|TOKEN|PASSWORD|API_KEY|ENCRYPTION_KEY|DATABASE_URL|REDIS_URL/i.test(name)
  && value && value.length >= 12,
)
let scanned = 0
let findings = 0
function scan(directory) {
  if (!existsSync(directory)) return
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) { scan(path); continue }
    if (!entry.isFile()) continue
    scanned += 1
    const content = readFileSync(path).toString("utf8")
    const candidates = findSecretCandidates(content, path)
      .filter((candidate) => candidate.kind !== "credential assignment")
    for (const candidate of candidates) {
      findings += 1
      console.error(`Potential ${candidate.kind} in client asset ${path}:${candidate.line}`)
    }
    for (const [name, value] of knownSecrets) {
      if (content.includes(value) || content.includes(encodeURIComponent(value))) {
        findings += 1
        console.error(`Configured secret ${name} found in client asset ${path}`)
      }
    }
  }
}
for (const directory of ["public", ".next/static", ".open-next/assets"]) scan(directory)
if (findings) process.exitCode = 1
else console.info(`Client secret scan passed for ${scanned} assets.`)
