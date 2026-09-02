import React, { Suspense } from "react"
import { OnboardingWizard } from "@/components/auth/onboarding-wizard"

export default function InvitePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] dark:bg-[#000000] p-4">
      <Suspense fallback={<div className="text-center text-sm text-[#a1a1aa]">Loading...</div>}>
        <OnboardingWizard />
      </Suspense>
    </div>
  )
}
