"use client"

import { useEffect, useMemo, useState } from "react"
import { Icon } from "@iconify/react"
import { ArrowUpRightFromSquare, Xmark } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { mediaProviderLabel, normalizeMediaSource, type MediaSource } from "@/lib/media"
import { VideoJsPlayer } from "./video-js-player"

type OEmbedState = {
  title?: string
  authorName?: string
  thumbnailUrl?: string
  html?: string | null
  error?: string
}

export function MediaViewer({
  source,
  open,
  onOpenChange,
}: {
  source: MediaSource | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const media = useMemo(() => (source ? normalizeMediaSource(source) : null), [source])
  const [embed, setEmbed] = useState<OEmbedState | null>(null)

  useEffect(() => {
    if (!open || !media) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [media, onOpenChange, open])

  useEffect(() => {
    if (!open || !media || media.kind !== "embed") {
      setEmbed(null)
      return
    }

    let cancelled = false
    setEmbed(null)

    fetch(`/api/media/oembed?url=${encodeURIComponent(media.url)}`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setEmbed(data)
      })
      .catch(() => {
        if (!cancelled) setEmbed({ error: "Unable to load embed metadata" })
      })

    return () => {
      cancelled = true
    }
  }, [media, open])

  if (!open || !media) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default" aria-label="Close media viewer" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-white">{embed?.title ?? media.title}</p>
            <p className="mt-0.5 text-[12px] text-white/55">{embed?.authorName ?? mediaProviderLabel(media.provider)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={media.url}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Open source"
            >
              <ArrowUpRightFromSquare className="size-4" />
            </a>
            <button
              onClick={() => onOpenChange(false)}
              className="flex size-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <Xmark className="size-5" />
            </button>
          </div>
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center bg-black sm:min-h-[520px]">
          <MediaViewerBody media={media} embed={embed} />
        </div>
      </div>
    </div>
  )
}

function MediaViewerBody({ media, embed }: { media: ReturnType<typeof normalizeMediaSource>; embed: OEmbedState | null }) {
  if (media.kind === "image") {
    return <img src={media.url} alt={media.title} className="max-h-[78vh] w-auto max-w-full object-contain" />
  }

  if (media.kind === "video") {
    return (
      <div className="aspect-video w-full">
        <VideoJsPlayer src={media.url} poster={media.poster} />
      </div>
    )
  }

  if (media.embedUrl) {
    return (
      <iframe
        src={media.embedUrl}
        title={media.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="aspect-video w-full"
      />
    )
  }

  if (embed?.html) {
    return (
      <div
        className={cn(
          "media-oembed flex max-h-[78vh] w-full max-w-[720px] justify-center overflow-y-auto rounded-2xl bg-white p-4 text-black",
          media.provider === "x" && "max-w-[560px]"
        )}
        dangerouslySetInnerHTML={{ __html: embed.html }}
      />
    )
  }

  return (
    <div className="flex max-w-sm flex-col items-center gap-3 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white">
        <Icon icon="gravity-ui:play-fill" className="size-6" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-white">Open media source</p>
        <p className="mt-1 text-[13px] leading-5 text-white/55">
          This platform needs an oEmbed token or does not allow inline playback for this URL yet.
        </p>
      </div>
      <a href={media.url} target="_blank" rel="noreferrer" className="rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-black">
        Open original
      </a>
    </div>
  )
}
