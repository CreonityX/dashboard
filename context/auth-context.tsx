"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Me } from "@/lib/api"

/**
 * Client-side auth context. The initial value is the result of the
 * server-side /auth/me call from app/_bootstrap.tsx. Pages can call
 * useAuth() to know who is signed in, what role, and which onboarding
 * step they're on.
 *
 * No mutation lives here — login/logout/MFA/verify are server actions in
 * app/actions/auth.ts. After they run, the layout re-renders the bootstrap
 * and AuthProvider gets fresh data.
 */
type AuthContextValue = Me;

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ value, children }: { value: Me; children: ReactNode }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
