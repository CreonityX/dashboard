import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { onboardingStatus as apiOnboardingStatus, me as apiMe } from "@/lib/api"
import { OnboardingProvider } from "@/context/onboarding-context"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get started — Creonity",
  description: "Set up your Creonity creator profile and start collaborating with brands.",
}

/**
 * Server component for the onboarding wizard. Fetches /auth/me and
 * /creator/onboarding/status, then hands the status to the existing
 * OnboardingShell wrapped in OnboardingProvider.
 *
 * Guards:
 *   - No access cookie  → /login
 *   - Not a creator     → /
 *   - Already complete  → /
 *
 * The wizard itself decides which step to land on by reading
 * useOnboarding().status.currentStep. The existing shell currently
 * defaults to step 1; that "resume at current step" behaviour is a
 * UI change for the shell to wire up.
 */
export default async function OnboardingPage() {
  const jar = await cookies()
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
  if (!cookieHeader) redirect("/login")

  let me
  try {
    me = await apiMe(cookieHeader)
  } catch {
    redirect("/login")
  }
  if (me.account_type !== "creator") redirect("/")
  if (me.is_onboarding_complete) redirect("/")

  let status
  try {
    status = await apiOnboardingStatus(cookieHeader)
  } catch {
    status = {
      currentStep: "profile_basics" as const,
      completedSteps: [],
      percentComplete: 0,
      isComplete: false,
    }
  }

  return (
    <OnboardingProvider initial={status}>
      <OnboardingShell />
    </OnboardingProvider>
  )
}
