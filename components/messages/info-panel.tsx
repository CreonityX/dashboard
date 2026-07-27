"use client"

import { useState } from "react"
import { Button, ButtonGroup } from "@heroui/react"
import { toast } from "@heroui/react"
import {
  FileText,
  Folder,
  Link as LinkIcon,
  Globe,
} from "@gravity-ui/icons"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import type { Conversation } from "@/lib/messages-data"
import { useAccount } from "@/context/account-context"

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function InfoPanel({
  conversation,
  onClose,
}: {
  conversation: Conversation
  onClose: () => void
}) {
  const { isBrand } = useAccount()
  const [showReport, setShowReport] = useState(false)
  const [activeTab, setActiveTab] = useState<"files" | "links">("files")

  return (
    <aside className="absolute inset-0 z-50 flex h-full w-full shrink-0 flex-col overflow-y-auto bg-white dark:bg-[#0a0a0a] xl:relative xl:w-[300px] xl:border-l xl:border-[#efefef] xl:dark:border-white/10">
      {/* Mobile back button */}
      <div className="flex items-center p-2 xl:hidden">
        <Button isIconOnly variant="ghost" aria-label="Close" onPress={onClose} className="text-[#0a0a0a] dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Button>
      </div>

      {/* Identity */}
      <div className="flex flex-col items-center px-5 pb-2 xl:pt-8 text-center">
        <GradientAvatar
          tone={conversation.tone}
          verified={conversation.verified}
          className="h-20 w-20"
        />
        <p className="mt-3 text-[18px] font-bold text-[#0a0a0a] dark:text-white">{conversation.name}</p>
        <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">{conversation.handle}</p>
        {isBrand && conversation.systemRole && <p className="mt-1 text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">{conversation.systemRole}</p>}
      </div>

      {conversation.type === "community" && conversation.members ? (
        <div className="px-5 py-3">
          <h3 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            Members — {conversation.members.length}
          </h3>
          <div className="flex flex-col gap-3">
            {conversation.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <GradientAvatar tone={member.tone} className="h-9 w-9 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#0a0a0a] dark:text-white">
                    {member.name}
                  </p>
                  <p className="truncate text-[12px] capitalize text-[#737373] dark:text-[#a1a1aa]">
                    {member.role}
                  </p>
                </div>
                {member.role === "admin" && (
                  <span className="shrink-0 rounded bg-[#f4f4f5] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#737373] dark:bg-[#27272a] dark:text-[#a1a1aa]">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {conversation.brandInfo && (
            <div className="px-5 py-3">
              <p className="text-[13px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
                {conversation.brandInfo.description}
              </p>
              {conversation.brandInfo.links.length > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  {conversation.brandInfo.links.map((link) => (
                    <a
                      key={link.url}
                      href={`https://${link.url.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#737373] transition-colors hover:text-[#0a0a0a] dark:text-[#a1a1aa] dark:hover:text-white"
                      title={link.label}
                    >
                      {link.label === "Instagram" ? (
                        <InstagramIcon className="h-5 w-5" />
                      ) : (
                        <Globe className="h-5 w-5" />
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {conversation.representative && (
            <div className="px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f]">
                  <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">
                    {conversation.representative.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#0a0a0a] dark:text-white">
                    {conversation.representative.name}
                  </p>
                  <p className="truncate text-[12px] text-[#737373] dark:text-[#a1a1aa]">
                    {conversation.representative.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="px-5 py-4 mt-2">
        <ButtonGroup className="w-full mb-5" variant="ghost">
          <Button
            className={`flex-1 ${activeTab === "files" ? "bg-[#e4e4e7] text-[#0a0a0a] dark:bg-[#3f3f46] dark:text-white" : "bg-[#f4f4f5] text-[#a1a1aa] dark:bg-[#1f1f1f] dark:text-[#737373]"}`}
            onPress={() => setActiveTab("files")}
          >
            <Folder className="h-[18px] w-[18px]" />
          </Button>
          <Button
            className={`flex-1 ${activeTab === "links" ? "bg-[#e4e4e7] text-[#0a0a0a] dark:bg-[#3f3f46] dark:text-white" : "bg-[#f4f4f5] text-[#a1a1aa] dark:bg-[#1f1f1f] dark:text-[#737373]"}`}
            onPress={() => setActiveTab("links")}
          >
            <LinkIcon className="h-[18px] w-[18px]" />
          </Button>
        </ButtonGroup>

        {activeTab === "files" ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-[22px] w-[22px] text-[#d64545]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#0a0a0a] dark:text-white">Media-Kit-2025.pdf</p>
                <p className="text-[11px] text-[#a1a1aa] dark:text-[#737373]">PDF · 3.2 MB</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Folder className="h-[22px] w-[22px] text-[#f59e0b]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#0a0a0a] dark:text-white">Spring Campaign — Brand Kit</p>
                <p className="text-[11px] text-[#a1a1aa] dark:text-[#737373]">Folder · 18 items</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <LinkIcon className="h-[22px] w-[22px] text-[#7b4fd0] dark:text-[#a78bfa]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#0a0a0a] dark:text-white">glowbeauty.com</p>
                <p className="truncate text-[11px] text-[#a1a1aa] dark:text-[#737373]">Spring 2025 Collection</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2 p-4">
        <div className="relative">
          {showReport && (
            <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-[#efefef] bg-white p-1.5 shadow-lg shadow-black/5 z-50 dark:border-white/10 dark:bg-[#1f1f1f]">
              {conversation.type === "community" ? (
                <button 
                  className="w-full rounded-lg px-3 py-2 text-left text-[14px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#f4f4f5] dark:text-white dark:hover:bg-[#27272a]"
                  onClick={() => toast.info("Report Submitted", { description: "We will review your report shortly." })}
                >
                  Report Community
                </button>
              ) : (
                <>
                  <button 
                    className="w-full rounded-lg px-3 py-2 text-left text-[14px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#f4f4f5] dark:text-white dark:hover:bg-[#27272a]"
                    onClick={() => toast.info("Report Submitted", { description: "We will review your report shortly." })}
                  >
                    {isBrand ? "Report Creator" : "Report Brand"}
                  </button>
                  <button 
                    className="w-full rounded-lg px-3 py-2 text-left text-[14px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#f4f4f5] dark:text-white dark:hover:bg-[#27272a]"
                    onClick={() => toast.info("Report Submitted", { description: "We will review your report shortly." })}
                  >
                    Report Representative
                  </button>
                </>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowReport(!showReport)}
            className="w-full rounded-xl bg-[#f4f4f5] py-2.5 text-[14px] font-semibold text-[#0a0a0a] transition-colors hover:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-white dark:hover:bg-[#27272a]"
          >
            Report
          </button>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Action Successful", { description: conversation.type === "community" ? "You've left the community." : "User blocked." })}
          className="w-full rounded-xl bg-[#fde8e8] py-2.5 text-[14px] font-semibold text-[#d64545] transition-colors hover:bg-[#fbd5d5] dark:bg-[#451a1a] dark:text-[#f87171] dark:hover:bg-[#5a2222]"
        >
          {conversation.type === "community" ? "Leave Community" : "Block"}
        </button>
      </div>
    </aside>
  )
}
