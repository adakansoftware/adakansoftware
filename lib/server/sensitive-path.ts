export function isSensitiveDotPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean).map((segment) => {
    let decoded = segment
    for (let pass = 0; pass < 2; pass += 1) {
      try {
        const next = decodeURIComponent(decoded)
        if (next === decoded) break
        decoded = next
      } catch {
        break
      }
    }
    return decoded
  })

  return segments.some((segment, index) => segment.startsWith(".") && !(index === 0 && segment === ".well-known"))
}
