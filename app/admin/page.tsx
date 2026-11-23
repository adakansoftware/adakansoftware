import { redirect } from "next/navigation"

import { AdminContentManager } from "@/components/admin/admin-content-manager"
import { isAdmin } from "@/lib/admin-auth"

export default async function AdminPage() {
  if (process.env.NEXT_STATIC_EXPORT === "1") {
    // The Worker authorizes both HTML and navigation payload requests.
    return <AdminContentManager email="Yönetici" requiresPublish />
  }

  if (!(await isAdmin())) {
    redirect("/admin/login")
  }

  return <AdminContentManager email={process.env.ADMIN_EMAIL ?? "Yönetici"} />
}
