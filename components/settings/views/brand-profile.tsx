"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "@/context/account-context"
import { toast } from "sonner"
import { Icon } from "@iconify/react"
import { SettingsActionButton, SettingsCard, SettingsField, SettingsPage, SettingsSection } from "../settings-ui"

export function BrandProfileView({ onBack }: { onBack?: () => void }) {
  const router = useRouter()
  const { brand, updateBrand } = useAccount()
  
  // Safe initialization
  const [name, setName] = useState(brand?.name || "")
  const [website, setWebsite] = useState(brand?.website || "")
  const [location, setLocation] = useState(brand?.location || "")
  const [categories, setCategories] = useState(brand?.categories.join(", ") || "")

  if (!brand) return null

  const save = () => {
    updateBrand({ 
      name, 
      website, 
      location, 
      categories: categories.split(",").map(c => c.trim()).filter(Boolean) 
    })
    toast.success("Brand profile updated")
  }
  
  return (
    <SettingsPage title="Brand Profile" onBack={onBack} action={<SettingsActionButton onClick={() => router.push(`/brand/${brand.id}`)}>View profile</SettingsActionButton>}>
      <SettingsSection title="Public Identity">
        <SettingsCard className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <SettingsField label="Brand Name">
              <div className="relative">
                <Icon icon="ph:buildings" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" />
                <input value={name} onChange={e => setName(e.target.value)} className="flex items-center h-12 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] pl-10 pr-4 text-[15px] font-medium text-[#0a0a0a] dark:text-white outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
              </div>
            </SettingsField>
            <SettingsActionButton variant="secondary" onClick={save}>Save</SettingsActionButton>
          </div>
          
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <SettingsField label="Website">
              <div className="relative">
                <Icon icon="ph:globe" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" />
                <input value={website} onChange={e => setWebsite(e.target.value)} className="flex items-center h-12 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] pl-10 pr-4 text-[15px] font-medium text-[#0a0a0a] dark:text-white outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
              </div>
            </SettingsField>
            <SettingsActionButton variant="secondary" onClick={save}>Save</SettingsActionButton>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <SettingsField label="Location">
              <div className="relative">
                <Icon icon="ph:map-pin" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" />
                <input value={location} onChange={e => setLocation(e.target.value)} className="flex items-center h-12 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] pl-10 pr-4 text-[15px] font-medium text-[#0a0a0a] dark:text-white outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
              </div>
            </SettingsField>
            <SettingsActionButton variant="secondary" onClick={save}>Save</SettingsActionButton>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <SettingsField label="Categories (comma separated)">
              <div className="relative">
                <Icon icon="ph:tag" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" />
                <input value={categories} onChange={e => setCategories(e.target.value)} className="flex items-center h-12 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] pl-10 pr-4 text-[15px] font-medium text-[#0a0a0a] dark:text-white outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
              </div>
            </SettingsField>
            <SettingsActionButton variant="secondary" onClick={save}>Save</SettingsActionButton>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Brand Information">
        <SettingsCard>
          <div className="grid gap-6 md:grid-cols-2 px-2 py-1">
            <SettingsField label="Account Type">
              <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white mt-1">Brand Workspace</span>
            </SettingsField>
            <SettingsField label="Brand ID">
              <span className="text-[15px] font-mono text-[#71717a] mt-1">{brand.id}</span>
            </SettingsField>
            <SettingsField label="Member Since">
              <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white mt-1">August 12, 2024</span>
            </SettingsField>
          </div>
        </SettingsCard>
      </SettingsSection>
    </SettingsPage>
  )
}
