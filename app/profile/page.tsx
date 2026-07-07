"use client"

import { useState } from "react"
import { ProfileCard } from "@/components/profile/profile-card"
import { PortfolioSection } from "@/components/profile/portfolio-section"
import { useProfile } from "@/context/profile-context"

function ProfilePageInner() {
  const [isEditing, setIsEditing] = useState(false)
  const { profile, setProfile } = useProfile()

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <div className="flex flex-col lg:flex-row w-full px-0 pt-0 lg:px-5 lg:pt-6 gap-2 lg:gap-5 h-full overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Profile Card */}
        <div className="w-full lg:w-[415px] shrink-0 flex flex-col h-auto lg:h-full lg:pb-4">
          <div className="px-4 pt-4 lg:px-0 lg:pt-0 lg:h-full">
            <ProfileCard
              isOwnProfile={true}
              isEditing={isEditing}
              onEditingChange={setIsEditing}
            />
          </div>
        </div>

        {/* Right Column: Portfolio */}
        <div className="hidden lg:flex flex-1 min-w-0 flex-col h-auto lg:h-full lg:overflow-y-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <PortfolioSection 
            isEditing={isEditing} 
            onChange={(items) => setProfile((prev) => ({ ...prev, portfolioItems: items }))} 
          />
        </div>

        {/* Mobile: Portfolio always below the profile card */}
        <div className="lg:hidden flex flex-1 min-w-0 flex-col h-auto pb-10">
          <PortfolioSection 
            isEditing={isEditing} 
            onChange={(items) => setProfile((prev) => ({ ...prev, portfolioItems: items }))} 
          />
        </div>
        
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProfilePageInner />
  )
}
