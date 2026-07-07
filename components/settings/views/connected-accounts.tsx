"use client"

import { Icon } from "@iconify/react"
import { Button } from "@heroui/react"
import { useState } from "react"
import { toast } from "sonner"
import {
  SettingsPage,
  SettingsSection,
  SettingsCard,
} from "../settings-ui"

const INTEGRATIONS = [
  { id: "instagram", name: "Instagram", icon: "fa6-brands:instagram", desc: "Sync your follower count and latest posts.", status: "connected", meta: "@alexrivera" },
  { id: "tiktok", name: "TikTok", icon: "fa6-brands:tiktok", desc: "Showcase your viral videos and engagement.", status: "connected", meta: "@arivera" },
  { id: "youtube", name: "YouTube", icon: "fa6-brands:youtube", desc: "Display your channel analytics and videos.", status: "disconnected", meta: null },
  { id: "google-analytics", name: "Google Analytics", icon: "simple-icons:googleanalytics", desc: "Track traffic to your creator portfolio.", status: "disconnected", meta: null },
  { id: "notion", name: "Notion", icon: "simple-icons:notion", desc: "Sync tasks and campaign notes.", status: "disconnected", meta: null },
  { id: "slack", name: "Slack", icon: "fa6-brands:slack", desc: "Receive notifications in your workspace.", status: "disconnected", meta: null },
  { id: "google-calendar", name: "Google Calendar", icon: "simple-icons:googlecalendar", desc: "Sync campaign deadlines and calls.", status: "connected", meta: "alex.r@example.com" },
  { id: "zapier", name: "Zapier", icon: "simple-icons:zapier", desc: "Automate workflows with 5000+ apps.", status: "disconnected", meta: null },
]

export function ConnectedAccountsView({ onBack }: { onBack?: () => void }) {
  const [disconnectModal, setDisconnectModal] = useState<typeof INTEGRATIONS[0] | null>(null)

  return (
    <SettingsPage title="Connected Accounts" onBack={onBack}>
      <SettingsSection>
        <div className="flex flex-col gap-1 max-w-3xl mb-4 px-1">
          <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa]">
            Connect your favorite tools and social platforms to sync data, automate workflows, and enhance your creator portfolio.
          </p>
        </div>

        <SettingsCard className="flex flex-col p-0 overflow-hidden">
          {INTEGRATIONS.map((app) => (
            <div key={app.id} className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Icon icon={app.icon} className="w-5 h-5 text-[#0a0a0a] dark:text-white" />
                </div>
                <span className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{app.name}</span>
              </div>
              
              {app.status === "connected" ? (
                <Button 
                  onClick={() => setDisconnectModal(app)} 
                  variant="bordered"
                  className="w-[160px] border-[#e4e4e7] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#0a0a0a] dark:text-white font-medium rounded-full h-10 transition-colors flex items-center justify-between gap-1.5"
                >
                  <span className="truncate flex-1 text-left">{app.meta}</span>
                  <Icon icon="gravity-ui:chevron-down" className="w-4 h-4 opacity-50 shrink-0" />
                </Button>
              ) : (
                <Button onClick={() => toast.success(`${app.name} connected`, { description: "Account synced successfully." })} className="w-[160px] font-medium bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] rounded-full h-10 transition-colors">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </SettingsCard>
      </SettingsSection>

      {/* Disconnect Modal matching user design */}
      {disconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111111] rounded-[24px] p-7 w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setDisconnectModal(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors">
              <Icon icon="gravity-ui:xmark" className="w-4 h-4" />
            </button>
            
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-5">
              <Icon icon="gravity-ui:trash-bin" className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            
            <h3 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white mb-2">Disconnect {disconnectModal.name}?</h3>
            <p className="text-[15px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa] mb-8">
              Are you sure you want to disconnect this account from your profile?
            </p>
            
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDisconnectModal(null)} className="px-6 py-2.5 rounded-full bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:hover:bg-[#27272a] text-[#0a0a0a] dark:text-white text-[15px] font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={() => {
                toast.success(`${disconnectModal.name} disconnected`);
                setDisconnectModal(null);
              }} className="px-6 py-2.5 rounded-full bg-[#f4f4f5] hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[15px] font-semibold transition-colors">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsPage>
  )
}
