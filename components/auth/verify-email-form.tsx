"use client"

// UI TODO: build the actual verify-email form here. It needs:
// - 6 OTP inputs (reuse the OTPInput from components/onboarding/steps/verify-modal.tsx)
// - On submit, call verifyEmailAction(email, otp) and on success call router.push("/onboarding")
//   (or "/" if is_onboarding_complete was already true)
// - A "resend code" button that calls resendVerificationAction(email)
// - Error display from the server action's { success: false, error }
//
// Props below are what app/verify-email/page.tsx already passes — the form
// only needs to forward the email to the server actions.

export function VerifyEmailForm({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-[#0a0a0a] p-4">
      <div className="rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#0a0a0a] dark:text-white mb-2">Verify your email</h1>
        <p className="text-sm text-[#737373] dark:text-[#a1a1aa] mb-4">
          We sent a 6-digit code to <span className="font-medium text-[#0a0a0a] dark:text-white">{email}</span>.
        </p>
        <p className="text-xs text-[#a1a1aa]">Form UI pending — wire to verifyEmailAction.</p>
      </div>
    </div>
  )
}
