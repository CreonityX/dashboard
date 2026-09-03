import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { BrandProfileCard } from "@/components/brand/brand-profile-card"
import { BrandCampaignGrid } from "@/components/brand/brand-campaign-grid"
import { me as apiMe, getPublicBrandProfile as apiGetPublicBrandProfile } from "@/lib/api"
import type { BrandData } from "@/components/brand/brand-data"

function domainOf(website: string | null): string {
  if (!website) return ""
  try {
    return new URL(website.startsWith("http") ? website : `https://${website}`).hostname.replace(/^www\./, "")
  } catch {
    return website
  }
}

/**
 * Server component. Loads the public brand profile + the viewer's own
 * identity, maps the API shape onto the BrandData the card expects
 * (UI-only fields get neutral defaults), and hands an onUpdate that
 * the card calls when the owner saves.
 *
 * Ownership: viewer is owner iff they hold a brand session whose
 * account_id matches the page id.
 */
export default async function BrandProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jar = await cookies()
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
  if (!cookieHeader) redirect("/login")

  let me
  try {
    me = await apiMe(cookieHeader)
  } catch {
    redirect("/login")
  }

  let profile
  try {
    profile = await apiGetPublicBrandProfile(id, cookieHeader)
  } catch {
    notFound()
  }

  const isOwner = me.account_type === "brand" && me.account_id === id

  const brand: BrandData = {
    id: profile.id,
    domain: domainOf(profile.website),
    name: profile.displayName,
    location: profile.country,
    bio: "",
    website: profile.website ?? "",
    categories: [],
    campaignsCount: 0,
    creatorsWorkedWith: 0,
    rating: 0,
    trustMetrics: { escrowReleaseDays: 0, responseRate: 0, repeatCreatorRate: 0 },
    team: [],
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <div className="flex flex-col lg:flex-row w-full px-0 pt-0 lg:px-5 lg:pt-6 gap-2 lg:gap-5 h-full overflow-y-auto lg:overflow-hidden">

        {/* Left Column: Brand Profile Card */}
        <div className="w-full lg:w-[415px] shrink-0 flex flex-col h-auto lg:h-full lg:pb-4">
          <div className="px-0 pt-0 lg:px-0 lg:pt-0 lg:h-full">
            <BrandProfileCard brand={brand} isOwner={isOwner} brandId={id} />
          </div>
        </div>

        {/* Right Column: Campaign Grid (Desktop) */}
        <div className="hidden lg:flex flex-1 min-w-0 flex-col h-auto lg:h-full lg:overflow-y-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <BrandCampaignGrid brandId={id} brandName={brand.name} domain={brand.domain} />
        </div>

        {/* Mobile: Grid always below the profile card */}
        <div className="lg:hidden flex flex-1 min-w-0 flex-col h-auto pb-10">
          <BrandCampaignGrid brandId={id} brandName={brand.name} domain={brand.domain} />
        </div>

      </div>
    </div>
  )
}
