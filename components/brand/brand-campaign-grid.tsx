"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { RecommendedCampaignCard } from "@/components/campaign/recommended-campaign-card"
import { CAMPAIGNS } from "@/components/campaign/campaign-data"

const MOCK_CREATOR_WORK = [
  { id: "1", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400", type: "image", creator: "Sophie", aspectClass: "aspect-[9/16]" },
  { id: "2", url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400", type: "image", creator: "Marcus", aspectClass: "aspect-square" },
  { id: "3", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", type: "image", creator: "Elena", aspectClass: "aspect-[4/5]" },
  { id: "4", url: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400", type: "image", creator: "David", aspectClass: "aspect-video" },
  { id: "5", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400", type: "image", creator: "Sarah", aspectClass: "aspect-[9/16]" },
  { id: "6", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", type: "image", creator: "James", aspectClass: "aspect-square" },
  { id: "7", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", type: "image", creator: "Mia", aspectClass: "aspect-[4/5]" },
  { id: "8", url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400", type: "image", creator: "Leo", aspectClass: "aspect-video" },
  { id: "9", url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400", type: "image", creator: "Alex", aspectClass: "aspect-[9/16]" },
  { id: "10", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400", type: "image", creator: "Priya", aspectClass: "aspect-[4/5]" },
];

const TABS = ["Open Campaigns", "Completed", "Creator Work"];

export function BrandCampaignGrid({ domain }: { domain: string }) {
  const [activeTab, setActiveTab] = useState("Open Campaigns");

  // Filter campaigns by the given domain
  const brandCampaigns = CAMPAIGNS.filter(c => c.domain === domain);
  const openCampaigns = brandCampaigns.filter(c => c.status === "Open" || c.status === "Closing Soon");
  const completedCampaigns = brandCampaigns.filter(c => c.status === "Filled" || c.status === "Closed");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full overflow-x-auto no-scrollbar scroll-smooth pt-4 lg:pt-0">
        <div className="flex items-center gap-8 px-4 lg:px-0 w-max pr-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-1.5 text-[16px] font-semibold tracking-tight transition-colors outline-none"
            >
              <span
                className={
                  activeTab === tab
                    ? "text-[#0a0a0a] dark:text-white"
                    : "text-gray-500 hover:text-[#0a0a0a] dark:hover:text-white"
                }
              >
                {tab}
              </span>

              {activeTab === tab && (
                <span className="absolute left-0 bottom-0 h-[2.5px] w-full rounded-full bg-[#0a0a0a] dark:bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-full overflow-y-auto px-4 lg:px-0 pb-20 lg:pb-0">
        {activeTab === "Open Campaigns" && (
          openCampaigns.length > 0 ? (
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {openCampaigns.map((campaign) => (
                <RecommendedCampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full pt-32 px-4 text-center">
              <h3 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">No open campaigns</h3>
              <p className="text-[14px] text-gray-500 mt-2 max-w-[300px]">This brand doesn't have any active campaigns at the moment. Check back later!</p>
            </div>
          )
        )}

        {activeTab === "Completed" && (
          completedCampaigns.length > 0 ? (
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {completedCampaigns.map((campaign) => (
                <RecommendedCampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full pt-32 px-4 text-center">
              <h3 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">No completed campaigns</h3>
              <p className="text-[14px] text-gray-500 mt-2 max-w-[300px]">There are no past campaigns to display yet.</p>
            </div>
          )
        )}

        {activeTab === "Creator Work" && (
          <div className="pt-6 columns-2 md:columns-3 xl:columns-5 gap-4">
            {MOCK_CREATOR_WORK.map((item) => (
              <div key={item.id} className={cn("w-full break-inside-avoid overflow-hidden cursor-pointer mb-4 group relative rounded-[16px]", item.aspectClass)}>
                <img 
                  src={item.url} 
                  alt={item.creator}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 z-10">
                  <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-md">
                    {item.creator}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
