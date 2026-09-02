import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { me as apiMe } from "@/lib/api"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"

/**
 * Server component for /verify-email. Gates:
 *   - No cookie         → /login
 *   - Already verified  → /
 *   - Wrong role guard  → /
 *
 * Renders a client form that calls the verifyEmailAction / resendVerificationAction
 * server actions. The actual OTP UI is left for the UI work to build —
 * the form just needs to dispatch { email, token } on submit.
 */
export default async function VerifyEmailPage() {
  const jar = await cookies()
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
  if (!cookieHeader) redirect("/login")

  let me
  try {
    me = await apiMe(cookieHeader)
  } catch {
    redirect("/login")
  }
  if (me.is_email_verified) redirect("/")

  return <VerifyEmailForm email={me.email} />
}
