"use server"

import { cookies } from "next/headers"
import { ApiCallError, login as apiLogin, logout as apiLogout } from "@/lib/api"

const ACCESS_COOKIE = "creonity_auth"
const REFRESH_COOKIE = "creonity_refresh"
const IS_PROD = process.env.NODE_ENV === "production"

const cookieOpts = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax" as const,
  path: "/",
}

export async function loginAction(
  email: string,
  password: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const result = await apiLogin(email, password)

    if ("mfa_required" in result) {
      return {
        success: false,
        error: "MFA is enabled on this account — multi-factor support ships in Phase 2.",
      }
    }

    const jar = await cookies()
    jar.set(ACCESS_COOKIE, result.accessToken, { ...cookieOpts, maxAge: 15 * 60 })
    jar.set(REFRESH_COOKIE, result.refreshToken, { ...cookieOpts, maxAge: 30 * 24 * 60 * 60 })
    return { success: true }
  } catch (err) {
    if (err instanceof ApiCallError) {
      return { success: false, error: err.status === 401 ? "Invalid email or password." : err.message }
    }
    return { success: false, error: "Unable to reach the server. Please try again." }
  }
}

export async function logoutAction(): Promise<{ success: true }> {
  const jar = await cookies()
  const refreshToken = jar.get(REFRESH_COOKIE)?.value
  if (refreshToken) {
    try {
      await apiLogout(refreshToken)
    } catch {
      // Best-effort — still clear cookies locally
    }
  }
  jar.delete(ACCESS_COOKIE)
  jar.delete(REFRESH_COOKIE)
  return { success: true }
}
