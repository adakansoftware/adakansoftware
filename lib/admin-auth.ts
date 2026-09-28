import { cookies } from "next/headers"

import { createAdminSession, readAdminSession } from "@/lib/admin-session"
import { getAdminCookieName } from "@/lib/admin-cookie"
import { getAdminSessionStore } from "@/lib/admin-session-store"

const cookieName = getAdminCookieName()
export const adminSessionMaxAgeSeconds = 8 * 60 * 60

export function hasAdminSessionConfiguration() {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_SESSION_SECRET?.trim())
}

export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value
  if (!value) return false
  const session = readAdminSession(
    value,
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_SESSION_SECRET ?? "",
    Date.now(),
  )
  if (!session) return false
  try {
    return await getAdminSessionStore().isActive(session.sessionId, Date.now())
  } catch {
    return false
  }
}

export async function adminCookie() {
  if (!hasAdminSessionConfiguration()) {
    throw new Error("Admin session configuration is incomplete.")
  }

  const value = createAdminSession(
    process.env.ADMIN_EMAIL ?? "",
    process.env.ADMIN_SESSION_SECRET ?? "",
    Date.now() + adminSessionMaxAgeSeconds * 1000,
  )
  const session = readAdminSession(
    value,
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_SESSION_SECRET ?? "",
    Date.now(),
  )
  if (!session) throw new Error("Admin session could not be created.")
  await getAdminSessionStore().create(session.sessionId, session.email, session.expiresAt)
  return value
}
export { cookieName }
