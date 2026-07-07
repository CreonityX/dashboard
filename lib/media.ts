export type MediaProvider = "direct" | "youtube" | "instagram" | "facebook" | "x" | "image" | "unknown"

export type MediaKind = "video" | "image" | "embed"

export type MediaSource = {
  url: string
  title?: string
  poster?: string
  provider?: MediaProvider
  kind?: MediaKind
}

export type NormalizedMedia = Required<Pick<MediaSource, "url">> & {
  title: string
  poster?: string
  provider: MediaProvider
  kind: MediaKind
  embedUrl?: string
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".m3u8"]
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"]

export function normalizeMediaSource(source: MediaSource): NormalizedMedia {
  const provider = source.provider ?? detectMediaProvider(source.url)
  const kind = source.kind ?? detectMediaKind(source.url, provider)
  const embedUrl = getEmbedUrl(source.url, provider)

  return {
    url: source.url,
    title: source.title ?? mediaProviderLabel(provider),
    poster: source.poster,
    provider,
    kind,
    embedUrl,
  }
}

export function detectMediaProvider(url: string): MediaProvider {
  const normalized = safeUrl(url)
  if (!normalized) {
    if (hasExtension(url, IMAGE_EXTENSIONS)) return "image"
    if (hasExtension(url, VIDEO_EXTENSIONS)) return "direct"
    return "unknown"
  }

  const host = normalized.hostname.replace(/^www\./, "")
  if (host === "youtu.be" || host.endsWith("youtube.com")) return "youtube"
  if (host.endsWith("instagram.com") || host.endsWith("threads.net")) return "instagram"
  if (host === "x.com" || host.endsWith("twitter.com")) return "x"
  if (host.endsWith("facebook.com") || host.endsWith("fb.watch")) return "facebook"
  if (hasExtension(normalized.pathname, IMAGE_EXTENSIONS)) return "image"
  if (hasExtension(normalized.pathname, VIDEO_EXTENSIONS)) return "direct"
  return "unknown"
}

export function detectMediaKind(url: string, provider = detectMediaProvider(url)): MediaKind {
  if (provider === "image") return "image"
  if (provider === "direct") return "video"
  if (provider === "youtube" || provider === "instagram" || provider === "facebook" || provider === "x") return "embed"
  if (hasExtension(url, IMAGE_EXTENSIONS)) return "image"
  return "video"
}

export function mediaProviderLabel(provider: MediaProvider) {
  switch (provider) {
    case "youtube":
      return "YouTube"
    case "instagram":
      return "Instagram"
    case "facebook":
      return "Meta"
    case "x":
      return "X"
    case "image":
      return "Image"
    case "direct":
      return "Video"
    default:
      return "Media"
  }
}

export function getEmbedUrl(url: string, provider = detectMediaProvider(url)) {
  if (provider === "youtube") {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1` : undefined
  }

  if (provider === "facebook") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=1280`
  }

  return undefined
}

export function getYouTubeId(url: string) {
  const parsed = safeUrl(url)
  if (!parsed) return null

  if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null
  if (parsed.pathname === "/watch") return parsed.searchParams.get("v")
  if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2] || null
  if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] || null
  return null
}

function safeUrl(url: string) {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

function hasExtension(value: string, extensions: string[]) {
  const clean = value.split("?")[0]?.toLowerCase() ?? value.toLowerCase()
  return extensions.some((extension) => clean.endsWith(extension))
}
