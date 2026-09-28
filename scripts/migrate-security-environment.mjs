/* global console, process, URL */
import { readFile, writeFile } from "node:fs/promises"
import { randomBytes } from "node:crypto"

import { hashAdminPassword } from "../lib/admin-login-credentials.ts"
import { generateContactDataEncryptionKey } from "../lib/server/contact-data-protection.ts"

const environmentPath = new URL("../.env.local", import.meta.url)
let source = await readFile(environmentPath, "utf8")

function replaceValue(name, value) {
  const line = `${name}=${value}`
  const pattern = new RegExp(`^${name}=.*$`, "mu")
  source = pattern.test(source) ? source.replace(pattern, line) : `${source.trimEnd()}\n${line}\n`
}

if (!process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD) {
  replaceValue("ADMIN_PASSWORD_HASH", await hashAdminPassword(process.env.ADMIN_PASSWORD))
}
if (!process.env.RATE_LIMIT_HASH_SECRET) {
  replaceValue("RATE_LIMIT_HASH_SECRET", randomBytes(32).toString("base64url"))
}
if (!process.env.CONTACT_DATA_ENCRYPTION_KEY) {
  replaceValue("CONTACT_DATA_ENCRYPTION_KEY", generateContactDataEncryptionKey())
}

source = source.replace(/^ADMIN_PASSWORD=.*(?:\r?\n|$)/mu, "")
await writeFile(environmentPath, source, { encoding: "utf8", mode: 0o600 })
console.log("Local security environment migrated without printing secret material.")
