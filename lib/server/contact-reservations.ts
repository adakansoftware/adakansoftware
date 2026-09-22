type Reservation = { owner: string; state: "pending" | "completed"; expiresAt: number }
export type ContactReservations = Record<string, Reservation>
type UpdateReservations = (updater: (entries: ContactReservations) => ContactReservations) => Promise<void>

// Updaters may run again after a Redis WATCH conflict; derive every result from
// that attempt's state and change only reservations owned by this request.
export function createReservationOperations(update: UpdateReservations) {
  return {
    async claimReservation(key: string, owner: string, windowMs: number) {
      let result: "acquired" | "pending" | "completed" = "pending"
      await update((entries) => {
        const now = Date.now()
        const active = Object.fromEntries(Object.entries(entries).filter(([, entry]) => entry.expiresAt > now))
        const existing = active[key]
        result = existing ? existing.state : "acquired"
        return existing ? active : { ...active, [key]: { owner, state: "pending", expiresAt: now + windowMs } }
      })
      return result
    },
    async completeReservation(key: string, owner: string) {
      await update((entries) => {
        const current = entries[key]
        if (!current || current.owner !== owner || current.expiresAt <= Date.now()) return entries
        return { ...entries, [key]: { ...current, state: "completed" } }
      })
    },
    async releaseReservation(key: string, owner: string) {
      await update((entries) => {
        const current = entries[key]
        if (!current || current.owner !== owner || current.state !== "pending") return entries
        const { [key]: _removed, ...remaining } = entries
        return remaining
      })
    },
  }
}
