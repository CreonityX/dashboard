"use client"

import { useState, type KeyboardEvent, type ReactNode } from "react"
import { Globe, MapPin, Xmark } from "@gravity-ui/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"
import type { BrandData } from "@/components/brand/brand-data"
import { cn } from "@/lib/utils"

const fieldClass = "h-10 w-full rounded-[10px] border border-gray-200 bg-white px-3.5 text-[14px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-white/10 dark:bg-transparent dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10"

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300">{label}</div>
      {children}
    </div>
  )
}

function TagsField({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("")

  const addTag = () => {
    const value = draft.trim().replace(/,$/, "")
    if (value && !tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) onChange([...tags, value])
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addTag()
    } else if (event.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <Field label="Categories">
      <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-xl bg-transparent py-1.5 transition">
        {tags.map((tag) => (
          <span key={tag} className="flex h-7 items-center gap-1.5 rounded-full bg-gray-100 px-3 text-[13px] font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((item) => item !== tag))} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
              <Xmark className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          placeholder={tags.length ? "Add another" : "Type a category and press Enter"}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={addTag}
          className="h-8 min-w-[150px] flex-1 rounded-lg bg-transparent px-2 text-[13px] text-gray-900 outline-none placeholder:text-gray-500 hover:bg-gray-50 focus:bg-gray-50 dark:text-white dark:hover:bg-white/5 dark:focus:bg-white/5"
        />
      </div>
    </Field>
  )
}

export function BrandEditorForm({ value, onChange }: { value: BrandData; onChange: (value: BrandData) => void }) {
  return (
    <div className="flex flex-col gap-5 px-6 py-4">
      <Field label="Brand name">
        <input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} className={fieldClass} />
      </Field>

      <Field label="Domain">
        <input value={value.domain} onChange={(event) => onChange({ ...value, domain: event.target.value })} className={fieldClass} />
      </Field>

      <Field label="About">
        <div className="relative">
          <textarea
            value={value.bio}
            onChange={(event) => onChange({ ...value, bio: event.target.value })}
            className={cn(fieldClass, "min-h-[100px] resize-none py-3")}
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-gray-400">
            {value.bio.length} / 150
          </div>
        </div>
      </Field>

      <Field label="Location">
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={value.location} placeholder="Location" onChange={(event) => onChange({ ...value, location: event.target.value })} className={cn(fieldClass, "pl-10")} />
        </div>
      </Field>

      <Field label="Website">
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="url" value={value.website} placeholder="yourwebsite.com" onChange={(event) => onChange({ ...value, website: event.target.value })} className={cn(fieldClass, "pl-10")} />
        </div>
      </Field>

      <TagsField tags={value.categories} onChange={(categories) => onChange({ ...value, categories })} />
      
      <div className="mt-2 flex flex-col gap-5">
        <div className="mb-1 text-[14px] font-semibold text-gray-900 dark:text-white">Socials</div>

        <Field label="Instagram handle">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 flex items-center justify-center">
              <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
            </div>
            <input value={value.instagram || ""} placeholder="username" onChange={(event) => onChange({ ...value, instagram: event.target.value })} className={cn(fieldClass, "pl-10")} />
          </div>
        </Field>

        <Field label="YouTube handle">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 flex items-center justify-center">
              <FontAwesomeIcon icon={faYoutube} className="h-4 w-4" />
            </div>
            <input value={value.youtube || ""} placeholder="channel" onChange={(event) => onChange({ ...value, youtube: event.target.value })} className={cn(fieldClass, "pl-10")} />
          </div>
        </Field>
      </div>
    </div>
  )
}
