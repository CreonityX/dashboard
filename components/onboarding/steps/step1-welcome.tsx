"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Dropdown } from "@heroui/react"
import type { StepProps } from "../onboarding-shell"
import { VerifyModal, OTPInput } from "./verify-modal"
const INPUT = "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
const LABEL = "text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]"

const CATEGORIES = [
  { id: "lifestyle", label: "Lifestyle" },
  { id: "fashion", label: "Fashion & Beauty" },
  { id: "tech", label: "Technology" },
  { id: "gaming", label: "Gaming" },
  { id: "fitness", label: "Fitness & Health" },
  { id: "travel", label: "Travel" },
  { id: "food", label: "Food & Cooking" },
  { id: "finance", label: "Finance" },
  { id: "education", label: "Education" },
  { id: "comedy", label: "Comedy" },
]

export function Step1Welcome({ data, onChange, onNext }: StepProps) {
  const canContinue = !!data.name.trim() && !!data.email.trim()
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 1 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Welcome to Creonity</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          Everything from your application is here. Review and update if anything's off — this is what brands will see.
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL}>Full Name</span>
            <input
              className={INPUT}
              value={data.name}
              onChange={e => onChange({ name: e.target.value })}
              placeholder="Your full name"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL}>Email</span>
            <div className="relative">
              <input
                className={`${INPUT} pr-10`}
                value={data.email}
                onChange={e => onChange({ email: e.target.value })}
                type="email"
                placeholder="email@example.com"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                <Icon icon="lucide:check-circle-2" className="size-[18px]" />
              </div>
            </div>
          </label>
        </div>

        {/* Phone */}
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Phone Number</span>
          <div className="flex gap-2">
            <div className="flex h-11 items-center rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white shrink-0 select-none">
              🇮🇳 +91
            </div>
            <div className="relative flex-1">
              <input
                className={`${INPUT} pr-[76px]`}
                value={data.phone}
                onChange={e => onChange({ phone: e.target.value })}
                type="tel"
                placeholder="9876543210"
              />
              {data.phoneVerified ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <Icon icon="lucide:check-circle-2" className="size-[18px]" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2a] text-[#52525b] dark:text-[#a1a1aa] text-[11px] font-semibold hover:bg-[#e4e4e7] dark:hover:bg-[#3f3f46] transition-colors"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        </label>

        {/* Category */}
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Creator Category</span>
          <Dropdown placement="bottom-start">
            <Dropdown.Trigger>
              <button
                type="button"
                className={`flex items-center justify-between ${INPUT} cursor-pointer text-left`}
              >
                <span>{CATEGORIES.find(c => c.id === data.category)?.label || "Select category"}</span>
                <Icon icon="ph:caret-down" className="size-4 text-[#a1a1aa]" />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover className="w-[calc(100vw-88px)] sm:w-[512px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]">
              <Dropdown.Menu 
                aria-label="Creator categories" 
                className="max-h-[300px] overflow-y-auto p-1"
                onAction={(key) => onChange({ category: key as string })}
              >
                {CATEGORIES.map(c => (
                  <Dropdown.Item key={c.id} textValue={c.label} className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
                    <span className="font-medium text-[#0a0a0a] dark:text-white">{c.label}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </label>

        {/* Social handle */}
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Primary Social Handle</span>
          <div className="relative">
            <input
              className={`${INPUT} pr-[76px]`}
              value={data.socialHandle}
              onChange={e => onChange({ socialHandle: e.target.value })}
              placeholder="@yourhandle"
            />
            <button
              type="button"
              disabled
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2a] text-[#52525b] dark:text-[#a1a1aa] text-[11px] font-semibold opacity-60 cursor-not-allowed"
            >
              Verify
            </button>
          </div>
          <span className="text-[12px] text-[#a1a1aa]">
            You'll connect and verify this via OAuth in Step 4.
          </span>
        </label>
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue &rarr;
      </button>

      {/* Verify Phone Modal */}
      <VerifyModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        title="Verify Phone Number"
        onVerify={() => {
          onChange({ phoneVerified: true } as any)
          setIsPhoneModalOpen(false)
        }}
      >
        <div className="flex flex-col gap-5">
          <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
            Enter the 6-digit code sent to <span className="font-bold">+91 {data.phone || "your number"}</span> to verify your phone number.
          </p>
          <OTPInput />
          <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
        </div>
      </VerifyModal>
    </div>
  )
}
