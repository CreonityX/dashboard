"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { toast } from "sonner"
import type { StepProps } from "../onboarding-shell"

const INPUT = "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
const LABEL = "text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]"

export function Step2Security({ data, onChange, onNext }: StepProps) {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [passkeyDone, setPasskeyDone] = useState(false)

  const handlePasskey = async (attachment: "platform" | "cross-platform") => {
    setPasskeyLoading(true)
    try {
      // Dummy challenge and user details to trigger the native UI
      const publicKey = {
        challenge: new Uint8Array(32),
        rp: { name: "Creonity", id: window.location.hostname },
        user: {
          id: new Uint8Array(16),
          name: data.email || "user@example.com",
          displayName: data.name || "User"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" as const }, { alg: -257, type: "public-key" as const }],
        authenticatorSelection: { authenticatorAttachment: attachment },
        timeout: 60000,
        attestation: "none" as const
      };
      
      await navigator.credentials.create({ publicKey });
      
      setPasskeyDone(true)
      onChange({ securityMethod: "passkey" })
      toast.success("Passkey created!", {
        description: "Your device is now a trusted authenticator.",
      })
    } catch (error) {
      console.error(error)
      toast.error("Passkey creation cancelled or failed.")
    } finally {
      setPasskeyLoading(false)
    }
  }

  const passwordValid =
    data.securityMethod === "password" &&
    data.password.length >= 8 &&
    data.password === data.confirmPassword

  const canContinue = passkeyDone || passwordValid

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 2 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Secure your account</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          We use magic links to sign you in. This adds a second layer of protection.
        </p>
      </div>

      {/* Passkey card */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <Icon icon="gravity-ui:fingerprint" className="size-8 text-[#0a0a0a] dark:text-white" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[48px]">
            <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Set up a passkey</div>
            <div className="text-[13px] leading-5 text-[#71717a] dark:text-[#a1a1aa] mt-1">
              Use Face ID, Touch ID, or your device PIN — no password needed.
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <button
            onClick={() => handlePasskey("platform")}
            disabled={passkeyDone || passkeyLoading}
            className="h-10 flex-1 rounded-xl bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-semibold hover:bg-black/85 dark:hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {passkeyLoading ? (
              <><Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> Registering…</>
            ) : passkeyDone ? (
              <><Icon icon="gravity-ui:check" className="size-4" /> Passkey created</>
            ) : (
              "Create passkey"
            )}
          </button>
          {!passkeyDone && (
            <button
              onClick={() => handlePasskey("cross-platform")}
              disabled={passkeyLoading}
              className="h-10 flex-1 rounded-xl bg-[#f4f4f5] dark:bg-[#2a2a2a] text-[#0a0a0a] dark:text-white text-[14px] font-semibold hover:bg-[#e4e4e7] dark:hover:bg-[#3f3f46] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              Use another device
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e4e4e7] dark:bg-[#27272a]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a1a1aa]">or use a password instead</span>
        <div className="flex-1 h-px bg-[#e4e4e7] dark:bg-[#27272a]" />
      </div>

      {/* Password fallback */}
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Create password</span>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className={`${INPUT} pr-11`}
              placeholder="Min 8 characters"
              value={data.password}
              onChange={e => onChange({ password: e.target.value, securityMethod: "password" })}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#52525b] dark:hover:text-white transition-colors"
              onClick={() => setShowPass(v => !v)}
            >
              <Icon icon={showPass ? "gravity-ui:eye-slash" : "gravity-ui:eye"} className="size-4" />
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Confirm password</span>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className={`${INPUT} pr-11`}
              placeholder="Repeat your password"
              value={data.confirmPassword}
              onChange={e => onChange({ confirmPassword: e.target.value })}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#52525b] dark:hover:text-white transition-colors"
              onClick={() => setShowConfirm(v => !v)}
            >
              <Icon icon={showConfirm ? "gravity-ui:eye-slash" : "gravity-ui:eye"} className="size-4" />
            </button>
          </div>
          {data.confirmPassword && data.password !== data.confirmPassword && (
            <span className="text-[12px] text-rose-500">Passwords don't match</span>
          )}
          {data.password.length > 0 && data.password.length < 8 && (
            <span className="text-[12px] text-orange-500">Use at least 8 characters</span>
          )}
        </label>
      </div>

      <p className="text-[12px] text-[#a1a1aa] -mt-4">
        You can change your security method anytime in{" "}
        <span className="font-medium text-[#71717a] dark:text-[#71717a]">Settings → Security</span>
      </p>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  )
}
