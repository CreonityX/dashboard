"use server"

import { cookies, headers } from "next/headers"
import {
  ApiCallError,
  login as apiLogin,
  logout as apiLogout,
  mfaChallenge as apiMfaChallenge,
  registerCreator as apiRegisterCreator,
  registerBrand as apiRegisterBrand,
  resendVerification as apiResendVerification,
  verifyEmail as apiVerifyEmail,
  type RegisterPayload,
  type TokenPair,
  type MfaRequired,
} from "@/lib/api"

const ACCESS_COOKIE = "creonity_auth"
const REFRESH_COOKIE = "creonity_refresh"
const IS_PROD = process.env.NODE_ENV === "production"

const cookieOpts = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax" as const,
  path: "/",
}

// ── Cookie helpers (used by every server action that needs to call the API) ──

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value
}

async function getCookieHeader(): Promise<string | undefined> {
  const jar = await cookies()
  // Forward the access cookie to the API as the Authorization Bearer header
  // would; the API also accepts the raw cookie string. We forward both cookies
  // so anything else the API looks at (CSRF, dev tooling) still works.
  const all = jar.getAll()
  if (all.length === 0) return undefined
  return all.map((c) => `${c.name}=${c.value}`).join("; ")
}

async function setTokenCookies(tokens: TokenPair): Promise<void> {
  const jar = await cookies()
  jar.set(ACCESS_COOKIE, tokens.accessToken, { ...cookieOpts, maxAge: 15 * 60 })
  jar.set(REFRESH_COOKIE, tokens.refreshToken, { ...cookieOpts, maxAge: 30 * 24 * 60 * 60 })
}

async function clearTokenCookies(): Promise<void> {
  const jar = await cookies()
  jar.delete(ACCESS_COOKIE)
  jar.delete(REFRESH_COOKIE)
}

// ── Login ─────────────────────────────────────────────────────────────────────

export type LoginResult =
  | { success: true; mfa_required: false }
  | { success: false; mfa_required: true; mfa_token: string; error: string }
  | { success: false; mfa_required: false; error: string; code?: string };

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  try {
    const result = await apiLogin(email, password)
    if ("mfa_required" in result) {
      return { success: false, mfa_required: true, mfa_token: result.mfa_token, error: "" }
    }
    await setTokenCookies(result)
    return { success: true, mfa_required: false }
  } catch (err) {
    if (err instanceof ApiCallError) {
      return {
        success: false,
        mfa_required: false,
        error: err.status === 401 ? "Invalid email or password." : err.message,
        code: err.code,
      }
    }
    return { success: false, mfa_required: false, error: "Unable to reach the server. Please try again." }
  }
}

// ── MFA challenge (second login step) ─────────────────────────────────────────

export type MfaLoginResult =
  | { success: true }
  | { success: false; error: string };

export async function mfaLoginAction(mfaToken: string, totpCode: string): Promise<MfaLoginResult> {
  try {
    const tokens = await apiMfaChallenge(mfaToken, totpCode)
    await setTokenCookies(tokens)
    return { success: true }
  } catch (err) {
    if (err instanceof ApiCallError) {
      return { success: false, error: err.status === 422 ? "Invalid code. Please try again." : err.message }
    }
    return { success: false, error: "Unable to reach the server. Please try again." }
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<{ success: true }> {
  const refreshToken = await getRefreshToken()
  if (refreshToken) {
    try {
      await apiLogout(refreshToken)
    } catch {
      // Best-effort — still clear cookies locally
    }
  }
  await clearTokenCookies()
  return { success: true }
}

// ── Registration ──────────────────────────────────────────────────────────────

export type RegisterResult =
  | { success: true; userId: string; message: string }
  | { success: false; error: string };

export async function registerCreatorAction(payload: RegisterPayload): Promise<RegisterResult> {
  try {
    const res = await apiRegisterCreator(payload)
    return { success: true, userId: res.userId, message: res.message }
  } catch (err) {
    if (err instanceof ApiCallError) {
      return { success: false, error: err.message }
    }
    return { success: false, error: "Unable to reach the server. Please try again." }
  }
}

export async function registerBrandAction(payload: RegisterPayload): Promise<RegisterResult> {
  try {
    const res = await apiRegisterBrand(payload)
    return { success: true, userId: res.userId, message: res.message }
  } catch (err) {
    if (err instanceof ApiCallError) {
      return { success: false, error: err.message }
    }
    return { success: false, error: "Unable to reach the server. Please try again." }
  }
}

// ── Email verification ────────────────────────────────────────────────────────

export type VerifyResult = { success: true } | { success: false; error: string };

export async function verifyEmailAction(email: string, token: string): Promise<VerifyResult> {
  try {
    await apiVerifyEmail(email, token)
    return { success: true }
  } catch (err) {
    if (err instanceof ApiCallError) {
      return { success: false, error: err.message }
    }
    return { success: false, error: "Unable to reach the server. Please try again." }
  }
}

export async function resendVerificationAction(email: string): Promise<VerifyResult> {
  try {
    await apiResendVerification(email)
    return { success: true }
  } catch (err) {
    if (err instanceof ApiCallError) {
      return { success: false, error: err.message }
    }
    return { success: false, error: "Unable to reach the server. Please try again." }
  }
}
