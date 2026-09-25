export function getAdminCookieName(environment = process.env.NODE_ENV) {
  return environment === "production" ? "__Host-adakan_admin" : "adakan_admin"
}
