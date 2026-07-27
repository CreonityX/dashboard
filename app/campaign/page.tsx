import { CampaignApp } from "@/components/campaign/campaign-app"
import { Suspense } from "react"

export const metadata = {
  title: 'Campaign | Creonity',
  description: 'Manage and discover new brand campaigns.',
}

export default function CampaignPage() {
  return <Suspense fallback={<div className="p-4">Loading campaign...</div>}><CampaignApp /></Suspense>
}
