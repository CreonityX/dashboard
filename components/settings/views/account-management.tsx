"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Button } from "@heroui/react"
import { TrashBin } from "@gravity-ui/icons"
import { toast } from "sonner"
import {
  SettingsPage,
  SettingsSection,
  SettingsCard,
} from "../settings-ui"

export function AccountManagementView({ onBack }: { onBack?: () => void }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  return (
    <SettingsPage title="Account Management" onBack={onBack}>
      


      {/* Data Export */}
      <SettingsSection title="Data Export">
        <SettingsCard className="flex flex-col p-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 pr-1">
                <Icon icon="ph:download-simple" className="w-5 h-5 text-[#0a0a0a] dark:text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Export Account Data</span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa] leading-snug">Download a copy of all the data associated with your account, including profile info, messages, and campaigns.</span>
              </div>
            </div>
            <div className="shrink-0 sm:ml-4 flex items-center">
              <Button onClick={() => toast.success("Export requested", { description: "You will receive an email when your data is ready." })} variant="bordered" className="border-[#e4e4e7] dark:border-[#27272a] font-medium">
                Request Export
              </Button>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection 
        title={<span className="text-rose-600 dark:text-rose-500">Danger Zone</span> as any}
        description="Irreversible actions that affect your account."
      >
        <SettingsCard tone="danger" className="flex flex-col p-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-rose-500/10 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Deactivate Account</span>
              <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa] leading-snug">Temporarily hide your profile and campaigns. You can reactivate by logging in.</span>
            </div>
            <div className="shrink-0 sm:ml-4 flex items-center">
              <Button onClick={() => toast.info("Deactivation initiated", { description: "Your account is now hidden." })} className="font-medium bg-[#FB2B37] hover:bg-[#FB2B37]/90 text-white shadow-sm">
                Deactivate Account
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Delete Account</span>
              <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa] leading-snug">Permanently remove your account and all associated data. This action cannot be undone.</span>
            </div>
            <div className="shrink-0 sm:ml-4 flex items-center">
              <Button 
                className="font-medium bg-[#FB2B37] hover:bg-[#FB2B37]/90 text-white shadow-sm" 
                startContent={<TrashBin className="w-4 h-4" />}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-[440px] bg-white dark:bg-[#111111] rounded-2xl shadow-xl overflow-hidden border border-[#efefef] dark:border-[#27272a] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0 mb-2">
                <TrashBin className="w-6 h-6 text-rose-600 dark:text-rose-500" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h2 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white leading-tight">Delete your account?</h2>
                <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                  This action is irreversible. All of your profile data, active bids, and messages will be permanently removed.
                </p>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">
                  To confirm, type <span className="font-mono bg-[#f4f4f5] dark:bg-[#1f1f1f] px-1.5 py-0.5 rounded text-rose-600 dark:text-rose-500">DELETE</span> below:
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-mono font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-rose-500 dark:focus:ring-rose-500"
                />
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button 
                  className="flex-1 font-medium bg-[#f4f4f5] dark:bg-[#27272a] text-[#0a0a0a] dark:text-white"
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setDeleteConfirmation("")
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  color="danger"
                  className="flex-1 font-medium"
                  isDisabled={deleteConfirmation !== "DELETE"}
                  onClick={() => {
                    toast.success("Account deleted", { description: "Your account and data have been permanently removed." })
                    setIsDeleteModalOpen(false)
                    setDeleteConfirmation("")
                  }}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SettingsPage>
  )
}
