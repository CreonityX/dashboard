import { NextResponse } from "next/server"
import { detectMediaProvider, mediaProviderLabel } from "@/lib/media"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  const provider = detectMediaProvider(url)
  const endpoint = getOEmbedEndpoint(url, provider)

  if (!endpoint) {
    return NextResponse.json({
      provider,
      title: mediaProviderLabel(provider),
      html: null,
    })
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Creonity Media Viewer",
      },
      next: { revalidate: 60 * 60 },
    })

    if (!response.ok) {
      return NextResponse.json({ provider, error: "Unable to load embed metadata" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      provider,
      title: data.title ?? mediaProviderLabel(provider),
      authorName: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      html: data.html ?? null,
      width: data.width,
      height: data.height,
    })
  } catch {
    return NextResponse.json({ provider, error: "Unable to load embed metadata" }, { status: 502 })
  }
}

function getOEmbedEndpoint(url: string, provider: ReturnType<typeof detectMediaProvider>) {
  const encoded = encodeURIComponent(url)

  if (provider === "youtube") {
    return `https://www.youtube.com/oembed?url=${encoded}&format=json`
  }

  if (provider === "x") {
    return `https://publish.twitter.com/oembed?url=${encoded}&omit_script=true&dnt=true`
  }

  if (provider === "instagram") {
    const token = process.env.META_OEMBED_ACCESS_TOKEN
    return token ? `https://graph.facebook.com/v19.0/instagram_oembed?url=${encoded}&access_token=${encodeURIComponent(token)}` : null
  }

  if (provider === "facebook") {
    const token = process.env.META_OEMBED_ACCESS_TOKEN
    return token ? `https://graph.facebook.com/v19.0/oembed_video?url=${encoded}&access_token=${encodeURIComponent(token)}` : null
  }

  return null
}
