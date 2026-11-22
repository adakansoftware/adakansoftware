/* global console, process */

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { extname } from "node:path"
import { pathToFileURL } from "node:url"

const binaryExtensions = new Set([".avif", ".gif", ".ico", ".jpeg", ".jpg", ".otf", ".png", ".webp"])

const secretPatterns = [
  { kind: "OpenAI API key", expression: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/ },
  { kind: "Resend API key", expression: /\bre_[A-Za-z0-9_-]{20,}\b/ },
  { kind: "GitHub token", expression: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/ },
  { kind: "AWS access key", expression: /\bAKIA[0-9A-Z]{16}\b/ },
  { kind: "Google API key", expression: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
  { kind: "private key", expression: /-----BEGIN (?:[A-Z0-9-]+ )?PRIVATE KEY(?: BLOCK)?-----/ },
]

const credentialNamePattern = "[A-Za-z0-9_]*(?:api[_-]?key|secret|token|password|encryption[_-]?key)[A-Za-z0-9_]*"
const quotedAssignmentPattern = new RegExp(`(?:^|[^A-Za-z0-9_])["']?${credentialNamePattern}["']?\\s*[:=]\\s*["'\x60]([A-Za-z0-9_./+=-]{16,})["'\x60]`, "i")
const environmentAssignmentPattern = new RegExp(`^(?:export\\s+)?${credentialNamePattern}\\s*=\\s*([A-Za-z0-9_./+=-]{16,})\\s*$`, "i")
const placeholderPattern = /^(?:change-this|your-|re_your_|example|placeholder|test-|dummy|local-|worker-local-)/i
const connectionStringPattern = /\b(?:postgres(?:ql)?|rediss?|mysql|mongodb(?:\+srv)?):\/\/[^\s/:"']+:([^\s@"']+)@/giu
// Public, documented Cloudflare Turnstile test secret keys (always pass / always fail / token already spent).
const turnstileTestKeys = new Set([
  "1x0000000000000000000000000000000AA",
  "2x000000000000000000000000000000AA",
  "3x000000000000000000000000000000FF",
])

export function findSecretCandidates(content, file) {
  const candidates = []

  for (const [index, line] of content.split(/\r?\n/).entries()) {
    for (const { kind, expression } of secretPatterns) {
      const match = line.match(expression)
      if (match && !placeholderPattern.test(match[0])) candidates.push({ file, line: index + 1, kind })
    }

    for (const match of line.matchAll(connectionStringPattern)) {
      if (!placeholderPattern.test(match[1]) && !match[1].includes("${")) {
        candidates.push({ file, line: index + 1, kind: "credential connection URL" })
      }
    }

    const assignment = line.match(quotedAssignmentPattern) ?? line.match(environmentAssignmentPattern)
    if (
      assignment &&
      !placeholderPattern.test(assignment[1]) &&
      !turnstileTestKeys.has(assignment[1]) &&
      !assignment[1].startsWith("process.env.")
    ) {
      candidates.push({ file, line: index + 1, kind: "credential assignment" })
    }
  }

  return candidates
}

function repositoryTextFiles() {
  return [...new Set(execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean))]
    .filter((file) => !binaryExtensions.has(extname(file).toLowerCase()))
}

function scanRepository() {
  const workingFindings = repositoryTextFiles().flatMap((file) => {
    try {
      return findSecretCandidates(readFileSync(file, "utf8"), file)
    } catch (error) {
      if (error.code === "ENOENT") return []
      return [{ file, line: 0, kind: "unreadable file (scan incomplete)" }]
    }
  })
  const stagedFiles = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"], { encoding: "utf8" })
    .split("\0").filter(Boolean).filter((file) => !binaryExtensions.has(extname(file).toLowerCase()))
  const stagedFindings = stagedFiles.flatMap((file) => {
    try {
      const content = execFileSync("git", ["show", `:${file}`], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 })
      return findSecretCandidates(content, `${file} (staged)`)
    } catch {
      return [{ file, line: 0, kind: "unreadable staged file (scan incomplete)" }]
    }
  })
  return [...workingFindings, ...stagedFindings]
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidates = scanRepository()

  if (candidates.length === 0) {
    console.info("Secret scan passed.")
  } else {
    for (const candidate of candidates) {
      console.error(`Potential ${candidate.kind} detected in ${candidate.file}:${candidate.line}`)
    }
    process.exitCode = 1
  }
}
