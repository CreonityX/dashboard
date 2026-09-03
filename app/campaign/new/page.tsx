import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { me as apiMe } from "@/lib/api"
import { BrandCampaignCreatePage } from "@/components/campaign/brand-campaign-pages"

/**
 * Server gate: only brand accounts can open the create page
 * (the backend enforces brand_owner/admin/manager on POST too;
 * this is just UX — creators bounce back to /campaign).
 */
export default async function NewCampaignPage() {
  const jar = await cookies()
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
  if (!cookieHeader) redirect("/login")

  try {
    const me = await apiMe(cookieHeader)
    if (me.account_type !== "brand") redirect("/campaign")
  } catch {
    redirect("/login")
  }

  return <BrandCampaignCreatePage />
}
