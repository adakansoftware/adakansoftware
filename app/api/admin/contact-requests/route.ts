import { parseContactRequestDeletion, parseContactRequestUpdate, toContactRequest } from "@/lib/admin-contact"
import { isAdmin } from "@/lib/admin-auth"
import { adminContentMaxBodyBytes, getAdminContentRequestError, readBoundedJsonObject } from "@/lib/admin-content-request"
import { getNeonSql } from "@/lib/neon"
import { createRequestId, isAllowedOrigin, jsonResponse, optionsResponse } from "@/lib/server/http"
import { getContactDataProtector } from "@/lib/server/contact-data-protection"
import { decryptContactRequestRow } from "@/lib/server/admin-contact-data"

const ALLOW_HEADER_VALUE = "GET, PATCH, DELETE, OPTIONS"

export function OPTIONS(request: Request) {
  return optionsResponse(createRequestId(request), ALLOW_HEADER_VALUE)
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)
  if (!(await isAdmin())) return jsonResponse({ ok: false }, { status: 401, requestId })

  try {
    const rows = await getNeonSql().query("select * from contact_requests order by created_at desc limit 200")
    const decrypted = await Promise.all(rows.map((row) => decryptContactRequestRow(row)))
    return jsonResponse(decrypted.map(toContactRequest).filter((row): row is NonNullable<typeof row> => row !== null), { requestId })
  } catch {
    return jsonResponse({ ok: false, message: "İletişim talepleri yüklenemedi." }, { status: 500, requestId })
  }
}

export async function PATCH(request: Request) {
  const requestId = createRequestId(request)
  if (!(await isAdmin())) return jsonResponse({ ok: false }, { status: 401, requestId })
  const requestError = getAdminContentRequestError(request, isAllowedOrigin)
  if (requestError) return jsonResponse({ ok: false }, { status: requestError, requestId })

  const parsedBody = await readBoundedJsonObject(request, adminContentMaxBodyBytes)
  if (!parsedBody.ok) return jsonResponse({ ok: false, message: "Geçersiz istek gövdesi." }, { status: parsedBody.status, requestId })
  const payload = parsedBody.body

  const parsed = parseContactRequestUpdate(payload)
  if (!parsed.ok) return jsonResponse(parsed, { status: 400, requestId })

  try {
    const protector = getContactDataProtector()
    const adminNote = protector ? await protector.encrypt(parsed.data.adminNote) : parsed.data.adminNote
    const rows = await getNeonSql().query(
      "update contact_requests set status = $1, admin_note = $2, retention_hold = $3, updated_at = now(), retention_until = now() + interval '24 months' where id = $4 returning *",
      [parsed.data.status, adminNote, parsed.data.retentionHold, parsed.data.id],
    )
    if (!rows[0]) return jsonResponse({ ok: false, message: "İletişim talebi bulunamadı." }, { status: 404, requestId })
    const decrypted = await decryptContactRequestRow(rows[0])
    return jsonResponse(toContactRequest(decrypted), { requestId })
  } catch {
    return jsonResponse({ ok: false, message: "İletişim talebi güncellenemedi." }, { status: 500, requestId })
  }
}

export async function DELETE(request: Request) {
  const requestId = createRequestId(request)
  if (!(await isAdmin())) return jsonResponse({ ok: false }, { status: 401, requestId })
  const requestError = getAdminContentRequestError(request, isAllowedOrigin)
  if (requestError) return jsonResponse({ ok: false }, { status: requestError, requestId })

  const parsedBody = await readBoundedJsonObject(request, adminContentMaxBodyBytes)
  if (!parsedBody.ok) return jsonResponse({ ok: false, message: "Geçersiz istek gövdesi." }, { status: parsedBody.status, requestId })
  const parsed = parseContactRequestDeletion(parsedBody.body)
  if (!parsed.ok) return jsonResponse(parsed, { status: 400, requestId })

  try {
    const runId = crypto.randomUUID()
    const rows = await getNeonSql().query(
      `with deleted as (
         delete from contact_requests where id = $1 returning 1
       ), deletion_count as (
         select count(*)::integer as deleted_count from deleted
       ), audit as (
         insert into contact_deletion_audits
           (run_id, actor, reason, deleted_count, executed_at, expires_at)
         select $2::uuid, 'admin', 'manual_request', deleted_count, now(), now() + interval '3 years'
         from deletion_count where deleted_count > 0
         returning deleted_count
       )
       select deleted_count from audit`,
      [parsed.data.id, runId],
    )
    if (!rows[0]) return jsonResponse({ ok: false, message: "İletişim talebi bulunamadı." }, { status: 404, requestId })
    return jsonResponse({ ok: true }, { requestId })
  } catch {
    return jsonResponse({ ok: false, message: "İletişim talebi silinemedi." }, { status: 500, requestId })
  }
}
