"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { type OnboardingStatus } from "@/lib/api"
import { getOnboardingStatusAction } from "@/app/actions/onboarding"

/**
 * Client-side onboarding state. Seeded server-side from app/onboarding/page.tsx
 * via <OnboardingProvider initial={...}>, and refreshed after every server
 * action. Steps are addressed by the backend's OnboardingStep string union
 * — see lib/api.ts.
 */
type OnboardingContextValue = {
  status: OnboardingStatus;
  refresh: () => Promise<void>;
  setStatus: (next: OnboardingStatus) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({
  initial,
  children,
}: {
  initial: OnboardingStatus;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<OnboardingStatus>(initial)

  const refresh = useCallback(async () => {
    const res = await getOnboardingStatusAction()
    if (res.success) setStatus(res.data)
  }, [])

  return (
    <OnboardingContext.Provider value={{ status, refresh, setStatus }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be used inside <OnboardingProvider>")
  return ctx
}
