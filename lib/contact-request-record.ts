import { getContactDataProtector } from "./server/contact-data-protection.ts"

export type ContactRequestWriteInput = {
  name: string
  email: string
  phone?: string
  project: string
  locale: "tr" | "en"
}

type SqlClient = {
  query(statement: string, values: (string | null)[]): Promise<unknown>
}

export function createContactRequestRecorder(sql: SqlClient) {
  return async function recordContactRequest(submission: ContactRequestWriteInput) {
    const protector = getContactDataProtector()
    const protect = (value: string) => protector ? protector.encrypt(value) : Promise.resolve(value)
    await sql.query(
      "insert into contact_requests (name, email, phone, project, locale, retention_until) values ($1, $2, $3, $4, $5, now() + interval '24 months')",
      [
        await protect(submission.name),
        await protect(submission.email),
        submission.phone ? await protect(submission.phone) : null,
        await protect(submission.project),
        submission.locale,
      ],
    )
  }
}
