"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  /** The root domain of the brand, e.g. "loreal.com" or "nike.com" */
  domain: string
  /** Short name used for the letter fallback avatar */
  name: string
  className?: string
  /** Extra classes applied to the letter avatar fallback */
  fallbackClassName?: string
  /**
   * "icon" — small app icon (favicons). Best for chips ≤24px.
   * "logo" — full brand logo via Clearbit. Best for ≥32px displays.
   * Defaults to "logo".
   */
  variant?: "icon" | "logo"
}

// Clearbit is the gold standard: square PNGs, high-res, no API key, ~200x200px.
// Google Favicons is a bulletproof CDN fallback for every domain on the internet.
const DOMAIN_OVERRIDES: Record<string, string> = {
  "loreal.com": "https://upload.wikimedia.org/wikipedia/commons/9/9d/L%27Or%C3%A9al_logo.svg",
  "wise.com": "https://upload.wikimedia.org/wikipedia/commons/7/77/Wise_Logo_%282023%29.svg",
}

function getSources(domain: string, variant: "icon" | "logo"): string[] {
  const overrides = DOMAIN_OVERRIDES[domain] ? [DOMAIN_OVERRIDES[domain]] : []
  
  if (variant === "icon") {
    return [
      ...overrides,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ]
  }
  return [
    ...overrides,
    // Clearbit: best quality, square brand logos, free, no key required
    `https://logo.clearbit.com/${domain}`,
    // Google Favicons: rock-solid CDN fallback
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ]
}

export function BrandLogo({
  domain,
  name,
  className,
  fallbackClassName,
  variant = "logo",
}: BrandLogoProps) {
  const sources = getSources(domain, variant)
  const [sourceIndex, setSourceIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    const next = sourceIndex + 1
    if (next < sources.length) {
      setSourceIndex(next)
    } else {
      setFailed(true)
    }
  }

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 font-bold text-zinc-600 dark:text-zinc-300 select-none",
          fallbackClassName ?? className
        )}
        aria-label={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={sources[sourceIndex]}
      src={sources[sourceIndex]}
      alt={name}
      className={className}
      onError={handleError}
    />
  )
}
