"use client"

import { useRef, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Icon } from "@iconify/react"
import { mfaSetupAction, mfaVerifyAction, mfaDisableAction } from "@/app/actions/auth"
import type { MfaSetupResult } from "@/lib/api"

const INPUT =
  "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
const LABEL = "text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]"

function SixDigitInput({ onComplete }: { onComplete: (code: string) => void }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""))
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const update = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = cleaned
    setDigits(next)
    if (cleaned && index < 5) inputRefs[index + 1].current?.focus()
    if (next.every(Boolean)) onComplete(next.join(""))
  }

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const onPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      const arr = pasted.split("")
      setDigits(arr)
      inputRefs[5].current?.focus()
      onComplete(pasted)
      e.preventDefault()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={inputRefs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-[20px] font-bold bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] focus:border-[#0a0a0a] dark:focus:border-white rounded-xl outline-none transition-colors text-[#0a0a0a] dark:text-white"
        />
      ))}
    </div>
  )
}

// ── Enable MFA section ────────────────────────────────────────────────────────

function EnableMfa({ onEnabled }: { onEnabled: () => void }) {
  const [phase, setPhase] = useState<"idle" | "setup" | "done">("idle")
  const [setupData, setSetupData] = useState<MfaSetupResult | null>(null)
  const [pendingCode, setPendingCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  const handleBegin = async () => {
    setLoading(true)
    setError(null)
    const res = await mfaSetupAction()
    setLoading(false)
    if (!res.success) { setError(res.error); return }
    setSetupData(res.data)
    setPhase("setup")
  }

  const handleVerify = async () => {
    if (pendingCode.length !== 6) return
    setLoading(true)
    setError(null)
    const res = await mfaVerifyAction(pendingCode)
    setLoading(false)
    if (!res.success) { setError(res.error); return }
    setPhase("done")
    onEnabled()
  }

  if (phase === "done") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-4">
        <Icon icon="gravity-ui:check-circle" className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <div className="text-[14px] font-semibold text-emerald-800 dark:text-emerald-200">MFA enabled</div>
          <div className="text-[13px] text-emerald-700 dark:text-emerald-300 mt-0.5">Your authenticator app is now active.</div>
        </div>
      </div>
    )
  }

  if (phase === "setup" && setupData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-[14px] leading-6 text-[#52525b] dark:text-[#a1a1aa]">
          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
        </div>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] p-6">
          <QRCodeSVG value={setupData.qr_uri} size={180} bgColor="transparent" fgColor="currentColor" className="text-[#0a0a0a] dark:text-white" />
          <button type="button" onClick={() => setShowSecret(v => !v)} className="text-[12px] font-medium text-[#a1a1aa] hover:text-[#52525b] dark:hover:text-white transition-colors">
            {showSecret ? "Hide" : "Can't scan? Show"} secret key
          </button>
          {showSecret && (
            <code className="text-[12px] font-mono bg-[#f4f4f5] dark:bg-[#1f1f1f] px-3 py-1.5 rounded-lg tracking-widest text-[#0a0a0a] dark:text-white break-all text-center">
              {setupData.secret}
            </code>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <span className={LABEL}>Enter the 6-digit code from your app to confirm</span>
          <SixDigitInput onComplete={setPendingCode} />
          {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || pendingCode.length !== 6}
            className="h-11 w-full rounded-xl bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-semibold hover:bg-black/85 dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> Verifying…</> : "Activate MFA"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}
      <button
        type="button"
        onClick={handleBegin}
        disabled={loading}
        className="h-11 w-full rounded-xl bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-semibold hover:bg-black/85 dark:hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading
          ? <><Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> Setting up…</>
          : <><Icon icon="gravity-ui:shield-check" className="size-4" /> Enable authenticator app</>
        }
      </button>
    </div>
  )
}

// ── Disable MFA section ───────────────────────────────────────────────────────

function DisableMfa({ onDisabled }: { onDisabled: () => void }) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDisable = async () => {
    if (!password || code.length !== 6) return
    setLoading(true)
    setError(null)
    const res = await mfaDisableAction(password, code)
    setLoading(false)
    if (!res.success) { setError(res.error); return }
    onDisabled()
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] font-medium text-rose-500 hover:text-rose-600 hover:underline underline-offset-2 transition-colors"
      >
        Disable MFA
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-rose-200 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-950/20 p-5">
      <div className="text-[14px] font-semibold text-rose-800 dark:text-rose-200">Confirm to disable MFA</div>
      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>Current password</span>
        <div className="relative">
          <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your account password" className={`${INPUT} pr-11`} />
          <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#52525b] dark:hover:text-white transition-colors">
            <Icon icon={showPw ? "gravity-ui:eye-slash" : "gravity-ui:eye"} className="size-4" />
          </button>
        </div>
      </label>
      <div className="flex flex-col gap-1.5">
        <span className={LABEL}>Current authenticator code</span>
        <SixDigitInput onComplete={setCode} />
      </div>
      {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={() => setOpen(false)} className="flex-1 h-10 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] text-[13px] font-semibold text-[#52525b] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDisable}
          disabled={loading || !password || code.length !== 6}
          className="flex-1 h-10 rounded-xl bg-rose-600 text-white text-[13px] font-semibold hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> Disabling…</> : "Disable MFA"}
        </button>
      </div>
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

/**
 * Drop-in MFA setup/disable card. Pass mfaEnabled from useAuth().mfa_enabled.
 * After enabling/disabling the parent should call router.refresh() so the
 * AuthBootstrap re-reads /auth/me and the mfa_enabled flag updates.
 */
export function MfaSetup({ mfaEnabled: initialEnabled }: { mfaEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled)

  return (
    <div className="rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f5] dark:bg-[#1f1f1f]">
          <Icon icon="gravity-ui:shield-check" className="size-6 text-[#0a0a0a] dark:text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Authenticator App (TOTP)</div>
            {enabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Icon icon="gravity-ui:check" className="size-2.5" /> Active
              </span>
            )}
          </div>
          <div className="text-[13px] leading-5 text-[#71717a] dark:text-[#a1a1aa] mt-1">
            {enabled
              ? "Your account is protected with a time-based one-time password."
              : "Use Google Authenticator, Authy, or any TOTP app for a second login factor."}
          </div>
        </div>
      </div>
      {enabled ? <DisableMfa onDisabled={() => setEnabled(false)} /> : <EnableMfa onEnabled={() => setEnabled(true)} />}
    </div>
  )
}
