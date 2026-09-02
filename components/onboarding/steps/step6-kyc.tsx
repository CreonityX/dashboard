import { useState } from "react"
import { Icon } from "@iconify/react"
import type { StepProps } from "../onboarding-shell"
import { savePayoutMethodAction } from "@/app/actions/onboarding"
import { useOnboarding } from "@/context/onboarding-context"

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

  const isComplete = data.panNumber.length === 10 && data.bankAccount.length >= 9 && data.bankAccount === data.bankAccountConfirm && data.ifsc.length === 11

  const [loading, setLoading] = useState(false)
  const { refresh } = useOnboarding()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await savePayoutMethodAction({
        type: "bank_account",
        details: { pan: data.panNumber, account: data.bankAccount, ifsc: data.ifsc },
      })
      await refresh()
      onNext()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 6 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">KYC & Payouts</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">You need a verified PAN and bank account to receive campaign payouts. This information is encrypted and never shared with brands.</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-500/25 dark:bg-amber-950/20 p-4 flex items-start gap-3">
        <Icon icon="gravity-ui:triangle-exclamation" className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-[13px] leading-5 text-amber-800 dark:text-amber-300">
          You can skip this step, but you <strong>will not be able to accept paid campaigns</strong> until your KYC is verified.
        </p>
      </div>

      <div className={`${CARD} flex flex-col gap-5`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#1f1f1f]"><Icon icon="gravity-ui:person-magnifier" className="size-4 text-[#0a0a0a] dark:text-white" /></div>
          <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Identity Verification</div>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>PAN Number</span>
          <input className={`${INPUT} uppercase`} placeholder="ABCDE1234F" maxLength={10} value={data.panNumber} onChange={e => onChange({ panNumber: e.target.value.toUpperCase() })} />
        </label>
        <div className="flex items-start gap-4 p-4 rounded-xl border border-dashed border-[#d4d4d8] dark:border-[#3f3f46] bg-[#fafafa] dark:bg-[#111111]">
          <Icon icon="gravity-ui:picture" className="size-5 text-[#a1a1aa] mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">Upload PAN Card (Optional)</div>
            <div className="text-[12px] text-[#71717a] dark:text-[#a1a1aa] mt-0.5">JPEG or PNG, max 5MB. Speeds up manual review.</div>
            <button className="mt-3 text-[12px] font-semibold text-[#0a0a0a] dark:text-white px-3 py-1.5 rounded-lg border border-[#e4e4e7] dark:border-[#27272a] hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] transition-colors">Choose File</button>
          </div>
        </div>
      </div>

      <div className={`${CARD} flex flex-col gap-5`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#1f1f1f]"><Icon icon="gravity-ui:building" className="size-4 text-[#0a0a0a] dark:text-white" /></div>
          <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Bank Details</div>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Account Number</span>
          <div className="relative">
            <input type={showAcct ? "text" : "password"} className={`${INPUT} pr-11`} placeholder="Enter account number" value={data.bankAccount} onChange={e => onChange({ bankAccount: e.target.value.replace(/\D/g, "") })} />
            <button type="button" tabIndex={-1} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#52525b] dark:hover:text-white transition-colors" onClick={() => setShowAcct(v => !v)}><Icon icon={showAcct ? "gravity-ui:eye-slash" : "gravity-ui:eye"} className="size-4" /></button>
          </div>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Re-enter Account Number</span>
          <input type="text" className={INPUT} placeholder="Confirm account number" value={data.bankAccountConfirm} onChange={e => onChange({ bankAccountConfirm: e.target.value.replace(/\D/g, "") })} onPaste={e => e.preventDefault()} />
          {data.bankAccountConfirm && data.bankAccount !== data.bankAccountConfirm && <span className="text-[12px] text-rose-500">Account numbers do not match</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>IFSC Code</span>
          <input className={`${INPUT} uppercase`} placeholder="e.g. SBIN0001234" maxLength={11} value={data.ifsc} onChange={e => onChange({ ifsc: e.target.value.toUpperCase() })} onBlur={handleIFSCBlur} />
          {resolvedBank && <span className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400">{resolvedBank}</span>}
        </label>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSubmit} disabled={!isComplete || loading}
          className="flex-1 h-12 rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> : null}
          Save & Continue →
        </button>
        <button onClick={onNext} className="h-12 px-5 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] text-[14px] font-semibold hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] transition-colors">
          Skip for now
        </button>
      </div>
    </div>
  )
}
