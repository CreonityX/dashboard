import type { Metadata } from "next"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"

export const metadata: Metadata = {
  title: "Get started — Creonity",
  description: "Set up your Creonity creator profile and start collaborating with brands.",
}

export default function OnboardingPage() {
  return <OnboardingShell />
}
