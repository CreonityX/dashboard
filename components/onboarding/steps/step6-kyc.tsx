"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import type { StepProps } from "../onboarding-shell"

const INPUT = "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
const LABEL = "text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]"
const CARD = "rounded-2xl border border-[#e4e4e7] bg-white p-5 dark:border-[#27272a] dark:bg-[#111111]"

export function Step6KYC({ data, onChange, onNext }: StepProps) {
  const [resolvedBank, setResolvedBank] = useState("")
  const [showAcct, setShowAcct] = useState(false)

  const handleIFSCBlur = () => {
    if (data.ifsc.length >= 4) {
      // Mock bank lookup
      const banks: Record<string, string> = {
        SBIN: "State Bank of India",
        HDFC: "HDFC Bank",
        ICIC: "ICICI Bank",
        UTIB: "Axis Bank",
        KKBK: "Kotak Mahindra Bank",
      }
      const prefix = data.ifsc.slice(0, 4).toUpperCase()
      setResolvedBank(banks[prefix] ?? "Bank found — Branch details loading")
    }
  }

  const isComplete =
    data.panNumber.length === 10 &&
    data.bankAccount.length >= 9 &&
    data.bankAccount === data.bankAccountConfirm &&
    data.ifsc.length === 11

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 6 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Set up payouts</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          Required to receive earnings from campaigns. You can finish this later.
        </p>
      </div>

      {/* Warning banner */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50/70 dark:border-orange-500/25 dark:bg-orange-950/20 p-4 flex items-start gap-3">
        <Icon icon="gravity-ui:triangle-exclamation" className="size-4 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
        <p className="text-[13px] leading-5 text-orange-700 dark:text-orange-300">
          Skipping this means campaigns <strong>can't pay out</strong> until it's done. Complete it anytime in{" "}
          <strong>Settings → Wallet</strong>.
        </p>
      </div>

      {/* PAN card */}
      <div className={`${CARD} flex flex-col gap-4`}>
        <div className="flex items-center gap-2">
          <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">PAN Verification</div>
          <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
            TDS Compliance
          </span>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>PAN Number</span>
          <input
            className={`${INPUT} uppercase tracking-widest`}
            placeholder="ABCDE1234F"
            maxLength={10}
            value={data.panNumber}
            onChange={e => onChange({ panNumber: e.target.value.toUpperCase() })}
          />
          {data.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.panNumber) && data.panNumber.length === 10 && (
            <span className="text-[12px] text-rose-500">Invalid PAN format (e.g. ABCDE1234F)</span>
          )}
        </label>

        <button
          type="button"
          className="flex items-center gap-2 text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors w-fit"
        >
          <Icon icon="gravity-ui:arrow-up-from-bracket" className="size-4" />
          Upload PAN card instead
        </button>
        <p className="text-[12px] text-[#a1a1aa] -mt-2">
          Required for TDS compliance on Indian creator earnings (Section 194R).
        </p>
      </div>

      {/* Bank card */}
      <div className={`${CARD} flex flex-col gap-4`}>
        <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Bank Account</div>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Account Number</span>
          <div className="relative">
            <input
              type={showAcct ? "text" : "password"}
              className={`${INPUT} pr-11`}
              placeholder="Enter account number"
              value={data.bankAccount}
              onChange={e => onChange({ bankAccount: e.target.value })}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#52525b] dark:hover:text-white transition-colors"
              onClick={() => setShowAcct(v => !v)}
            >
              <Icon icon={showAcct ? "gravity-ui:eye-slash" : "gravity-ui:eye"} className="size-4" />
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Re-enter Account Number</span>
          <input
            className={INPUT}
            placeholder="Confirm account number"
            value={data.bankAccountConfirm}
            onChange={e => onChange({ bankAccountConfirm: e.target.value })}
          />
          {data.bankAccountConfirm && data.bankAccount !== data.bankAccountConfirm && (
            <span className="text-[12px] text-rose-500">Account numbers don't match</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>IFSC Code</span>
          <input
            className={`${INPUT} uppercase tracking-widest`}
            placeholder="SBIN0001234"
            maxLength={11}
            value={data.ifsc}
            onChange={e => onChange({ ifsc: e.target.value.toUpperCase() })}
            onBlur={handleIFSCBlur}
          />
          {resolvedBank && (
            <span className="text-[12px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Icon icon="gravity-ui:check" className="size-3" />
              {resolvedBank}
            </span>
          )}
        </label>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save & Continue →
        </button>
        <button
          onClick={onNext}
          className="h-12 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] text-[14px] font-semibold hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] transition-colors flex items-center justify-center gap-2"
        >
          Skip for now
          <span className="text-[12px] font-normal text-[#a1a1aa]">— payouts unavailable until complete</span>
        </button>
      </div>
    </div>
  )
}
