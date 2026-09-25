export function isSensitiveDotPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  if (segments[0] === ".well-known") return false
  return segments.some((segment) => segment.startsWith("."))
}

