"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { verifyEmailAction, resendVerificationAction } from "@/app/actions/auth"
import { toast } from "sonner"

export function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter()
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""))
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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
  }

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const onPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(""))
      inputRefs[5].current?.focus()
      e.preventDefault()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otp = digits.join("")
    if (otp.length !== 6) return
    
    setLoading(true)
    setError(null)
    try {
      const res = await verifyEmailAction(email, otp)
      if (res.success) {
        toast.success("Email verified!")
        router.push("/onboarding")
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError(null)
    try {
      const res = await resendVerificationAction(email)
      if (res.success) {
        toast.success("Verification email sent!")
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError("Failed to resend email.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#efefef] dark:border-[#27272a] shadow-sm text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 mx-auto mb-6">
        <Icon icon="gravity-ui:envelope" className="size-8 text-indigo-600 dark:text-indigo-400" />
      </div>
      
      <h1 className="text-2xl font-bold text-[#0a0a0a] dark:text-white mb-3">Check your email</h1>
      <p className="text-[14px] text-[#71717a] dark:text-[#a1a1aa] mb-8 leading-relaxed">
        We've sent a 6-digit verification code to <span className="font-semibold text-[#0a0a0a] dark:text-white">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex justify-center gap-2">
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

        {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}

        <button 
          type="submit"
          disabled={loading || digits.join("").length !== 6}
          className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> : null}
          Verify Email
        </button>

        <div className="text-[13px] text-[#71717a] dark:text-[#a1a1aa] mt-2">
          Didn't receive the email?{" "}
          <button 
            type="button" 
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-[#0a0a0a] dark:text-white hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Click to resend"}
          </button>
        </div>
      </form>
    </div>
  )
}
