"use client"
import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function VideoSidebar() {
  const [videoNum, setVideoNum] = useState<number | null>(null)
  const [logoColor, setLogoColor] = useState<string>("#FFFFFF")
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasExtracted = useRef(false)
  
  useEffect(() => {
    // Random number between 1 and 7
    setVideoNum(Math.floor(Math.random() * 7) + 1)
  }, [])

  const extractColor = () => {
    if (hasExtracted.current) return
    const video = videoRef.current
    if (!video) return

    try {
      const canvas = document.createElement('canvas')
      canvas.width = 16
      canvas.height = 16
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      
      ctx.drawImage(video, 0, 0, 16, 16)
      const data = ctx.getImageData(0, 0, 16, 16).data
      
      let maxSaturation = -1
      let bestRGB = [255, 255, 255]
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i+1]
        const b = data[i+2]
        
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const l = (max + min) / 2
        
        // Skip too dark or too light pixels to avoid muddy colors
        if (l < 30 || l > 225) continue
        
        // Use HSV saturation (0 to 1) to find the most colorful pixel
        const s = max === 0 ? 0 : (max - min) / max
        
        if (s > maxSaturation) {
          maxSaturation = s
          bestRGB = [r, g, b]
        }
      }
      
      if (maxSaturation !== -1) {
        setLogoColor(`rgb(${bestRGB[0]}, ${bestRGB[1]}, ${bestRGB[2]})`)
        hasExtracted.current = true
      }
    } catch (e) {
      console.error("Error extracting color", e)
    }
  }

  return (
    <div className="flex w-full h-full relative bg-black rounded-[24px] overflow-hidden">
      {videoNum && (
        <video 
          ref={videoRef}
          key={videoNum}
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
          onPlaying={extractColor}
        >
          <source src={`/assets/creators/vid ${videoNum}.mp4`} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="absolute inset-0 p-12 flex flex-col justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontFamily: 'Champ Black, sans-serif', 
            fontSize: '32px', 
            color: logoColor,
            transition: 'color 1s ease-in-out',
            lineHeight: 1
          }}>
            creonity
          </span>
        </Link>
        
        <div className="text-white z-10">
          <motion.h2 
            initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl font-bold mb-4 leading-tight"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
          >
            Welcome back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="text-white/95 text-lg max-w-md font-medium"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
          >
            Access your dashboard, manage your campaigns, and track your creative journey.
          </motion.p>
        </div>
      </div>
    </div>
  )
}
