"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import {
  type ApplicationPage,
  type Campaign,
  type CampaignPage,
  type DealPage,
} from "@/lib/api"
import {
  getBrandCampaignsAction,
  getCampaignApplicationsAction,
  getDealsAction,
} from "@/app/actions/campaign"

/**
 * Client-side campaign workspace state. Seeded server-side from
 * app/campaign/page.tsx (brand list + deals) via
 * <CampaignsProvider initial={...}>. Detail pages fetch their own
 * campaign + applications and merge them in via setCampaigns().
 *
 * Mutations go through the server actions in app/actions/campaign.ts;
 * call refresh() afterwards so lists stay in sync.
 */
type CampaignsContextValue = {
  campaigns: Campaign[];
  campaignsCursor: string | null;
  deals: DealPage["items"];
  dealsCursor: string | null;
  applicationsByCampaign: Record<string, ApplicationPage>;
  refreshCampaigns: () => Promise<void>;
  refreshDeals: () => Promise<void>;
  refreshApplications: (campaignId: string) => Promise<void>;
  setCampaigns: (next: Campaign[]) => void;
};

const CampaignsContext = createContext<CampaignsContextValue | null>(null)

export function CampaignsProvider({
  initial,
  children,
}: {
  initial: { campaigns: CampaignPage; deals: DealPage };
  children: ReactNode;
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initial.campaigns.items)
  const [campaignsCursor, setCampaignsCursor] = useState<string | null>(
    initial.campaigns.nextCursor,
  )
  const [deals, setDeals] = useState<DealPage["items"]>(initial.deals.items)
  const [dealsCursor, setDealsCursor] = useState<string | null>(initial.deals.nextCursor)
  const [applicationsByCampaign, setApplicationsByCampaign] = useState<
    Record<string, ApplicationPage>
  >({})

  const refreshCampaigns = useCallback(async () => {
    const res = await getBrandCampaignsAction({})
    if (res.success) {
      setCampaigns(res.data.items)
      setCampaignsCursor(res.data.nextCursor)
    }
  }, [])

  const refreshDeals = useCallback(async () => {
    const res = await getDealsAction({})
    if (res.success) {
      setDeals(res.data.items)
      setDealsCursor(res.data.nextCursor)
    }
  }, [])

  const refreshApplications = useCallback(async (campaignId: string) => {
    const res = await getCampaignApplicationsAction(campaignId, {})
    if (res.success) {
      setApplicationsByCampaign((prev) => ({ ...prev, [campaignId]: res.data }))
    }
  }, [])

  return (
    <CampaignsContext.Provider
      value={{
        campaigns,
        campaignsCursor,
        deals,
        dealsCursor,
        applicationsByCampaign,
        refreshCampaigns,
        refreshDeals,
        refreshApplications,
        setCampaigns,
      }}
    >
      {children}
    </CampaignsContext.Provider>
  )
}

export function useCampaigns(): CampaignsContextValue {
  const ctx = useContext(CampaignsContext)
  if (!ctx) throw new Error("useCampaigns must be used inside <CampaignsProvider>")
  return ctx
}
