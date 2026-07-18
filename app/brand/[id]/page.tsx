"use client"

import { useParams, notFound } from "next/navigation"
import { BrandProfileCard } from "@/components/brand/brand-profile-card"
import { BrandCampaignGrid } from "@/components/brand/brand-campaign-grid"
import { MOCK_BRANDS } from "@/components/brand/brand-data"
import { useAccount } from "@/context/account-context"

export default function BrandProfilePage() {
  const params = useParams()
  const id = params.id as string
  const { account, brand: activeBrand, updateBrand } = useAccount()

  const brand = id === "creonity" && activeBrand ? activeBrand : MOCK_BRANDS[id]
  const isOwner = account?.role === "brand" && account.brandId === id
  
  if (!brand) {
    notFound()
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <div className="flex flex-col lg:flex-row w-full px-0 pt-0 lg:px-5 lg:pt-6 gap-2 lg:gap-5 h-full overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Brand Profile Card */}
        <div className="w-full lg:w-[415px] shrink-0 flex flex-col h-auto lg:h-full lg:pb-4">
          <div className="px-0 pt-0 lg:px-0 lg:pt-0 lg:h-full">
            <BrandProfileCard brand={brand} isOwner={isOwner} onUpdate={updateBrand} />
          </div>
        </div>

        {/* Right Column: Campaign Grid (Desktop) */}
        <div className="hidden lg:flex flex-1 min-w-0 flex-col h-auto lg:h-full lg:overflow-y-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <BrandCampaignGrid domain={brand.domain} />
        </div>

        {/* Mobile: Grid always below the profile card */}
        <div className="lg:hidden flex flex-1 min-w-0 flex-col h-auto pb-10">
          <BrandCampaignGrid domain={brand.domain} />
        </div>
        
      </div>
    </div>
  )
}
