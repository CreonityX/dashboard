import React from "react"
import { OnboardingWizard } from "@/components/auth/onboarding-wizard"

export default function InvitePage() {
  // In a real app, you would fetch this data using the token from the URL params.
  // We're passing mock data based on the scenario where they already filled out an invite form.
  const mockInitialData = {
    firstName: "Alex",
    lastName: "Chen",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    socialLink: "https://instagram.com/alexchen",
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] dark:bg-[#000000] p-4">
      <OnboardingWizard initialData={mockInitialData} />
    </div>
  )
}
