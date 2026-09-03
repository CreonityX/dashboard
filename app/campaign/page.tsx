import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import {
  discoverCampaigns as apiDiscoverCampaigns,
  listBrandCampaigns as apiListBrandCampaigns,
  listDeals as apiListDeals,
  me as apiMe,
} from "@/lib/api"
import { CampaignsProvider } from "@/context/campaigns-context"
import { CampaignApp } from "@/components/campaign/campaign-app"

export const metadata = {
  title: 'Campaign | Creonity',
  description: 'Manage and discover new brand campaigns.',
}

/**
 * Server component. Seeds CampaignsProvider with first-paint data:
 *   - brand  → own campaigns + deals
 *   - creator → discover feed (unfiltered first page) + own deals
 * The UI keeps lists fresh via useCampaigns().refresh*() after mutations.
 */
export default async function CampaignPage() {
  const jar = await cookies()
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
  if (!cookieHeader) redirect("/login")

  let accountType: string
  try {
    accountType = (await apiMe(cookieHeader)).account_type
  } catch {
    redirect("/login")
  }

  const [campaigns, deals] = await Promise.all([
    (accountType === "brand"
      ? apiListBrandCampaigns({}, cookieHeader)
      : apiDiscoverCampaigns({}, cookieHeader)
    ).catch(() => ({ items: [], nextCursor: null })),
    apiListDeals({}, cookieHeader).catch(() => ({ items: [], nextCursor: null })),
  ])

  return (
    <Suspense fallback={<div className="p-4">Loading campaign...</div>}>
      <CampaignsProvider initial={{ campaigns, deals }}>
        <CampaignApp />
      </CampaignsProvider>
    </Suspense>
  )
}
