import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { me as apiMe, type Me } from "@/lib/api"
import { AuthProvider } from "@/context/auth-context"

/**
 * Path prefixes that don't require authentication. Everything else redirects
 * to /login when the user has no access cookie.
 */
const PUBLIC_PREFIXES = [
  "/login",
  "/invite",
  "/_next",
  "/api",
  "/icon",
  "/favicon",
  "/apple-icon",
]

const VERIFY_PATH = "/verify-email"
const ONBOARDING_PATH = "/onboarding"

/**
 * Server-side auth bootstrap. Reads the access cookie, calls /auth/me, and
 * gates the request. Runs at the root layout boundary so every page has a
 * known auth state without an extra round-trip.
 *
 * Redirect rules (only the ones we have backend support for today):
 *   1. No cookie + non-public path  → /login
 *   2. Cookie + email not verified  → /verify-email
 *      (skipped for /login, /verify-email itself, public assets)
 *   3. Cookie + creator + onboarding incomplete → /onboarding
 *      (skipped for /onboarding itself, /login, /verify-email)
 *
 * Returns the Me object for the AuthProvider. Pages can read it via
 * useAuth() on the client, or import { getMe } from a server component
 * if we ever need it server-side.
 */
export async function AuthBootstrap({ pathname, children }: { pathname: string; children: React.ReactNode }) {
  const me = await fetchMe()

  if (!me) {
    if (!isPublicPath(pathname)) redirect("/login")
    return <>{children}</>
  }

  if (!me.is_email_verified && pathname !== VERIFY_PATH && !isPublicPath(pathname)) {
    redirect(VERIFY_PATH)
  }

  if (
    me.account_type === "creator" &&
    me.is_onboarding_complete === false &&
    pathname !== ONBOARDING_PATH &&
    pathname !== VERIFY_PATH
  ) {
    redirect(ONBOARDING_PATH)
  }

  return <AuthProvider value={me}>{children}</AuthProvider>
}

async function fetchMe(): Promise<Me | null> {
  const jar = await cookies()
  const access = jar.get("creonity_auth")?.value
  if (!access) return null
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
  try {
    return await apiMe(cookieHeader)
  } catch {
    // Invalid / expired / unreachable — treat as logged out. The login form
    // will guide the user to refresh.
    return null
  }
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
