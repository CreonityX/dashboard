"use client"

import "@videojs/react/video/minimal-skin.css"

import { createPlayer } from "@videojs/react"
import { MinimalVideoSkin, Video, videoFeatures } from "@videojs/react/video"

const Player = createPlayer({ features: videoFeatures })

export function VideoJsPlayer({
  src,
  poster,
}: {
  src: string
  poster?: string
}) {
  return (
    <Player.Provider>
      <MinimalVideoSkin poster={poster}>
        <Video src={src} poster={poster} playsInline preload="metadata" className="h-full w-full bg-black object-contain" />
      </MinimalVideoSkin>
    </Player.Provider>
  )
}
