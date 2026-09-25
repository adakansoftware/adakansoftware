import type { ContactSubmission } from "@/lib/server/contact-service"

type ContactRecorder = (submission: ContactSubmission) => Promise<void>

export async function persistContactWithoutDelivery(
  submission: ContactSubmission,
  record: ContactRecorder,
) {
  await record(submission)

  return {
    ok: true,
    accepted: true,
    deliveryConfigured: false,
    duplicate: false,
    skippedDelivery: true,
    queued: false,
    fallback: "database" as const,
  }
}
