import { getContactDataProtector } from "./contact-data-protection.ts"

export async function decryptContactRequestRow(row: Record<string, unknown>) {
  const protector = getContactDataProtector()
  if (!protector) return row

  const decrypted = { ...row }
  for (const key of ["name", "email", "phone", "project", "admin_note"] as const) {
    if (typeof decrypted[key] === "string") {
      decrypted[key] = await protector.decrypt(decrypted[key] as string)
    }
  }

  return decrypted
}
