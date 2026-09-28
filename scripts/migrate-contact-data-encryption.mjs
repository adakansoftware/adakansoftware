/* global console, process */
import { neon } from "@neondatabase/serverless"
import { createContactDataProtector, isEncryptedContactValue } from "../lib/server/contact-data-protection.ts"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")
if (!process.env.CONTACT_DATA_ENCRYPTION_KEY) throw new Error("CONTACT_DATA_ENCRYPTION_KEY is required")

const sql = neon(process.env.DATABASE_URL)
const protector = createContactDataProtector(process.env.CONTACT_DATA_ENCRYPTION_KEY)
const rows = await sql.query("select id, name, email, phone, project, admin_note from contact_requests")

for (const row of rows) {
  const protect = async (value) => {
    if (typeof value !== "string") return null
    if (isEncryptedContactValue(value)) {
      try {
        await protector.decrypt(value)
        return value
      } catch {
        // A user may have submitted plaintext that resembles the envelope prefix.
      }
    }
    return protector.encrypt(value)
  }
  await sql.query(
    `update contact_requests
     set name = $1, email = $2, phone = $3, project = $4, admin_note = $5, updated_at = now()
     where id = $6`,
    [
      await protect(row.name),
      await protect(row.email),
      await protect(row.phone),
      await protect(row.project),
      await protect(row.admin_note ?? ""),
      row.id,
    ],
  )
}

console.log(`Encrypted ${rows.length} contact request record(s).`)
