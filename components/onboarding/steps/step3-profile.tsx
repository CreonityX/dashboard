"use client"

import { useRef } from "react"
import { Icon } from "@iconify/react"
import type { StepProps } from "../onboarding-shell"

const INPUT = "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
const LABEL = "text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]"
const CARD = "rounded-2xl border border-[#e4e4e7] bg-white p-5 dark:border-[#27272a] dark:bg-[#111111]"

const NICHE_TAGS = [
  "Fashion", "Lifestyle", "Tech", "Fitness", "Travel",
  "Food", "Finance", "Education", "Comedy", "Beauty",
  "Gaming", "Music", "Parenting", "Wellness", "Sports",
]

export function Step3Profile({ data, onChange, onNext }: StepProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ photo: file, photoPreview: url })
  }

  const toggleTag = (tag: string) => {
    if (data.nicheTags.includes(tag)) {
      onChange({ nicheTags: data.nicheTags.filter(t => t !== tag) })
    } else if (data.nicheTags.length < 5) {
      onChange({ nicheTags: [...data.nicheTags, tag] })
    }
  }

  const bioCount = data.bio.length
  const canContinue = bioCount > 0 && data.location.trim().length > 0 && data.nicheTags.length >= 1

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 3 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Build your profile</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          This is what brands see first. Make it count.
        </p>
      </div>

      {/* Photo upload */}
      <div className={`${CARD} flex items-center gap-5`}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 shrink-0 rounded-full border-2 border-dashed border-[#d4d4d8] dark:border-[#3f3f46] hover:border-[#0a0a0a] dark:hover:border-white transition-colors overflow-hidden flex items-center justify-center bg-[#f4f4f5] dark:bg-[#1f1f1f]"
        >
          {data.photoPreview ? (
            <img src={data.photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <Icon icon="gravity-ui:camera" className="size-7 text-[#a1a1aa]" />
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Profile photo</div>
          <div className="text-[13px] text-[#71717a] dark:text-[#a1a1aa] mt-0.5">Shown to brands on your public profile.</div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[13px] font-medium text-[#0a0a0a] dark:text-white hover:underline underline-offset-2"
            >
              {data.photoPreview ? "Change" : "Upload photo"}
            </button>
            {data.photoPreview && (
              <button
                type="button"
                onClick={() => onChange({ photo: null, photoPreview: null })}
                className="text-[13px] font-medium text-rose-500 hover:text-rose-600 hover:underline underline-offset-2"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bio + Location */}
      <div className={`${CARD} flex flex-col gap-4`}>
        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className={LABEL}>Bio</span>
            <span className={`text-[12px] font-medium tabular-nums ${bioCount > 140 ? "text-rose-500" : "text-[#a1a1aa]"}`}>
              {bioCount}/150
            </span>
          </div>
          <textarea
            className="min-h-[96px] w-full resize-none rounded-xl border border-[#e4e4e7] bg-white px-3.5 py-3 text-[13.5px] font-medium text-[#0a0a0a] outline-none leading-6 transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
            placeholder="Tell brands what you do and what you stand for..."
            maxLength={150}
            value={data.bio}
            onChange={e => onChange({ bio: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Location</span>
          <input
            className={INPUT}
            placeholder="City, State — e.g. Mumbai, MH"
            value={data.location}
            onChange={e => onChange({ location: e.target.value })}
          />
          <span className="text-[12px] text-[#a1a1aa]">Used for eligibility matching on Discover campaigns.</span>
        </label>
      </div>

      {/* Niche tags */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between mb-3">
          <span className={LABEL}>Niche tags</span>
          <span className="text-[12px] font-semibold text-[#a1a1aa] tabular-nums">
            {data.nicheTags.length}/5 selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {NICHE_TAGS.map(tag => {
            const selected = data.nicheTags.includes(tag)
            const maxed = !selected && data.nicheTags.length >= 5
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={maxed}
                className={`h-8 rounded-full px-3.5 text-[13px] font-medium transition-all duration-150 ${
                  selected
                    ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] scale-[1.02]"
                    : maxed
                    ? "border border-[#e4e4e7] dark:border-[#27272a] text-[#c4c4c4] dark:text-[#4a4a4a] cursor-not-allowed"
                    : "border border-[#e4e4e7] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:border-[#0a0a0a] dark:hover:border-white hover:text-[#0a0a0a] dark:hover:text-white"
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-[12px] text-[#a1a1aa]">
          These feed the niche-matching logic on Home and Discover. Pick at least 1, up to 5.
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Save & Continue →
      </button>
    </div>
  )
}
