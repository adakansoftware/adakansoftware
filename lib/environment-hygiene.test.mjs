/* global URL */
import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const projectRoot = new URL("../", import.meta.url)
const packageJson = JSON.parse(readFileSync(new URL("package.json", projectRoot), "utf8"))
const gitignore = readFileSync(new URL(".gitignore", projectRoot), "utf8")

test("keeps local secrets out of env files compiled into the Cloudflare worker", () => {
  assert.equal(existsSync(new URL(".env.local", projectRoot)), false)
  assert.match(gitignore, /^\.dev\.vars\*?$/mu)
})

test("loads local secrets explicitly only for development and maintenance commands", () => {
  for (const scriptName of ["dev", "start", "db:apply-schema", "db:encrypt-contact-data", "security:migrate-env", "test:smoke", "test:smoke:boundaries", "test:smoke:production"]) {
    assert.match(packageJson.scripts[scriptName], /--env-file=\.dev\.vars/u, `${scriptName} must load .dev.vars explicitly`)
  }

  assert.doesNotMatch(packageJson.scripts.build, /--env-file/u)
  assert.doesNotMatch(packageJson.scripts["build:cloudflare"], /--env-file/u)
  assert.doesNotMatch(packageJson.scripts.deploy, /--env-file/u)
})
