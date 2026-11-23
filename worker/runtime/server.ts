type CookieOptions = {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
  path?: string
  maxAge?: number
  expires?: Date
}

export class NextResponse extends Response {
  private cookieValues = new Map<string, string>()

  cookies = {
    set: (name: string, value: string, options: CookieOptions = {}) => {
      if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name)) throw new TypeError("Invalid cookie name")
      const path = options.path ?? "/"
      if ([...path].some(character => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127 || character === ";")) throw new TypeError("Invalid cookie path")
      const attributes = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`]
      if (options.expires) attributes.push(`Expires=${options.expires.toUTCString()}`)
      if (options.maxAge !== undefined) {
        if (!Number.isFinite(options.maxAge)) throw new TypeError("Invalid cookie maxAge")
        attributes.push(`Max-Age=${Math.floor(options.maxAge)}`)
      }
      if (options.httpOnly) attributes.push("HttpOnly")
      if (options.secure) attributes.push("Secure")
      if (options.sameSite) attributes.push(`SameSite=${options.sameSite[0].toUpperCase()}${options.sameSite.slice(1)}`)
      this.cookieValues.set(name, attributes.join("; "))
      this.headers.delete("set-cookie")
      for (const serialized of this.cookieValues.values()) this.headers.append("set-cookie", serialized)
      return this.cookies
    },
    delete: (name: string) => this.cookies.set(name, "", { expires: new Date(0), maxAge: 0 }),
  }

  static json(body: unknown, init?: ResponseInit) {
    const headers = new Headers(init?.headers)
    if (!headers.has("content-type")) headers.set("content-type", "application/json")
    return new NextResponse(JSON.stringify(body), { ...init, headers })
  }
}
