import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { me as apiMe } from "@/lib/api"
import { LoginForm } from "@/components/auth/login-form"
import { VideoSidebar } from "@/components/auth/video-sidebar"

/**
 * Server component for /login. If the user already has a valid session
 * (cookie + /auth/me 200), bounce them by role so they never see the
 * form again. If the session is unverified, send them to /verify-email.
 * If they're a creator who hasn't onboarded, send them to /onboarding.
 */
export default async function LoginPage() {
  const jar = await cookies()
  const access = jar.get("creonity_auth")?.value
  if (access) {
    const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
    try {
      const me = await apiMe(cookieHeader)
      if (me.is_email_verified) {
        if (me.account_type === "creator" && me.is_onboarding_complete === false) {
          redirect("/onboarding")
        }
        redirect("/")
      }
      redirect("/verify-email")
    } catch {
      // Invalid/expired — fall through to the login form
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#0a0a0a]">
      <div className="hidden lg:block h-screen p-3 pr-0 w-1/2 max-w-[800px]">
        <VideoSidebar />
      </div>
      <div className="flex flex-col flex-1 relative p-3 lg:pl-3">
        <div className="flex-1 w-full h-full">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
