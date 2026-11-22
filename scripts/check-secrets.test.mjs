import assert from "node:assert/strict"
import test from "node:test"
import { execFileSync, spawnSync } from "node:child_process"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import process from "node:process"

import { findSecretCandidates } from "./check-secrets.mjs"

// Git exports repository variables to hooks; fixtures must never reuse that index.
const testEnvironment = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")))

test("client build gate rejects bundled credentials without printing their values", () => {
  const directory = mkdtempSync(join(tmpdir(), "adakan-client-secret-test-"))
  const scanner = fileURLToPath(new globalThis.URL("./check-client-secrets.mjs", import.meta.url))
  const secret = ["opaqueBuild", "Credential987654"].join("")
  try {
    mkdirSync(join(directory, ".next", "static"), { recursive: true })
    writeFileSync(join(directory, ".next", "static", "app.js"), "export const message = 'safe'")
    const options = { cwd: directory, encoding: "utf8", env: { ...testEnvironment, CONTACT_ADMIN_SIGNING_SECRET: secret } }
    assert.equal(spawnSync(process.execPath, [scanner], options).status, 0)
    writeFileSync(join(directory, ".next", "static", "app.js"), `export const value = '${secret}'`)
    const leaked = spawnSync(process.execPath, [scanner], options)
    assert.equal(leaked.status, 1)
    assert.ok(!`${leaked.stdout}${leaked.stderr}`.includes(secret))
    assert.match(leaked.stderr, /app.js/)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test("CLI rejects untracked secrets while keeping ignored local credentials private", () => {
  const directory = mkdtempSync(join(tmpdir(), "adakan-secret-test-"))
  const scanner = fileURLToPath(new globalThis.URL("./check-secrets.mjs", import.meta.url))
  const value = ["ghp_", "abcdefghijklmnopqrstuv123456"].join("")
  try {
    execFileSync("git", ["init", "--quiet"], { cwd: directory, env: testEnvironment })
    writeFileSync(join(directory, ".gitignore"), ".dev.vars\n")
    writeFileSync(join(directory, ".dev.vars"), `GITHUB_TOKEN=${value}`)
    const clean = spawnSync(process.execPath, [scanner], { cwd: directory, encoding: "utf8", env: testEnvironment })
    assert.equal(clean.status, 0)
    writeFileSync(join(directory, "accidental.js"), `export const value = "${value}"`)
    const leaked = spawnSync(process.execPath, [scanner], { cwd: directory, encoding: "utf8", env: testEnvironment })
    assert.equal(leaked.status, 1)
    assert.match(leaked.stderr, /accidental.js/)
    assert.ok(!`${leaked.stdout}${leaked.stderr}`.includes(value))
    execFileSync("git", ["add", "accidental.js"], { cwd: directory, env: testEnvironment })
    writeFileSync(join(directory, "accidental.js"), "export const value = 'clean working copy'")
    const staged = spawnSync(process.execPath, [scanner], { cwd: directory, encoding: "utf8", env: testEnvironment })
    assert.equal(staged.status, 1, "staged secret must be detected even after the working copy is cleaned")
    assert.ok(!`${staged.stdout}${staged.stderr}`.includes(value))
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test("detects exact credential names, JSON keys and connection-string passwords", () => {
  const value = ["opaqueCredential", "9876543210"].join("")
  for (const source of [
    `const token = "${value}"`,
    JSON.stringify({ password: value }),
    `CONTACT_DATA_ENCRYPTION_KEY=${value}`,
    `const database = "postgresql://service:${value}@db.invalid/app"`,
    `const redis = "rediss://default:${value}@redis.invalid:6379"`,
  ]) {
    const result = findSecretCandidates(source, "sample.ts")
    assert.ok(result.length > 0, "credential was not detected")
    assert.ok(!JSON.stringify(result).includes(value), "scanner leaked credential")
  }
})

test("detects provider tokens containing underscores", () => {
  const token = ["re_", "abcdefghijklmnop_1234567890"].join("")
  assert.ok(findSecretCandidates(`const value = "${token}"`, "sample.ts").length > 0)
})

test("finds recognisable credential formats without returning their values", () => {
  const candidates = findSecretCandidates(
    [
      `const key = "${["sk-proj-", "abcdefghijklmnopqrstuvwxyz123456"].join("")}"`,
      `const privateKey = "${["-----BEGIN ", "PRIVATE KEY-----"].join("")}"`,
    ].join("\n"),
    "lib/example.ts",
  )

  assert.deepEqual(candidates, [
    { file: "lib/example.ts", line: 1, kind: "OpenAI API key" },
    { file: "lib/example.ts", line: 2, kind: "private key" },
  ])
})

test("does not flag placeholders or environment-variable references", () => {
  const candidates = findSecretCandidates(
    [
      "VENDOR_API_KEY=change-this-example-key",
      "VENDOR_API_KEY=process.env.VENDOR_API_KEY",
      "const clientSecret = process.env.VENDOR_CLIENT_SECRET",
    ].join("\n"),
    ".env.example",
  )

  assert.deepEqual(candidates, [])
})

test("does not flag documented Cloudflare Turnstile test secret keys", () => {
  const candidates = findSecretCandidates(
    'process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA"',
    "lib/server/turnstile-verification.test.mjs",
  )

  assert.deepEqual(candidates, [])
})

test("finds generic credential assignments with underscore and camelCase names", () => {
  const value = ["qwertyuiop", "asdfghjklzxcvbnm"].join("")
  const candidates = findSecretCandidates(
    [
      `VENDOR_API_KEY=${value}`,
      `const clientSecret = "${value}"`,
    ].join("\n"),
    "docs/plan.md",
  )

  assert.deepEqual(candidates, [
    { file: "docs/plan.md", line: 1, kind: "credential assignment" },
    { file: "docs/plan.md", line: 2, kind: "credential assignment" },
  ])
})

test("finds DSA and PGP private-key headers", () => {
  const candidates = findSecretCandidates(
    [
      ["-----BEGIN ", "DSA PRIVATE KEY-----"].join(""),
      ["-----BEGIN ", "PGP PRIVATE KEY BLOCK-----"].join(""),
    ].join("\n"),
    "docs/plan.md",
  )

  assert.deepEqual(candidates, [
    { file: "docs/plan.md", line: 1, kind: "private key" },
    { file: "docs/plan.md", line: 2, kind: "private key" },
  ])
})

test("does not flag runtime values assigned to credential-named variables", () => {
  const candidates = findSecretCandidates(
    "const bearerToken = request.headers.get(\"authorization\")",
    "lib/request.ts",
  )

  assert.deepEqual(candidates, [])
})
