"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Xmark as X, ChevronLeft, ChevronRight, PlayFill, Pause, Heart, PaperPlane } from "@gravity-ui/icons"
import { Volume2, Volume1, VolumeX } from "lucide-react"

export type StorySlide = {
  id: string
  type: "image" | "text" | "video"
  url?: string
  content?: string
  duration: number // milliseconds
  date?: string
}

export type Story = {
  id: string
  username: string
  avatarUrl: string
  emoji?: string
  bgClass?: string
  isSeen?: boolean
  slides: StorySlide[]
}

interface StoryViewerModalProps {
  stories: Story[]
  initialStoryIndex: number
  onClose: () => void
}

export function StoryViewerModal({ stories, initialStoryIndex, onClose }: StoryViewerModalProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  
  const [isPaused, setIsPaused] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0) // 0 to 100

  const currentStory = stories[currentStoryIndex]
  const currentSlide = currentStory?.slides[currentSlideIndex]
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const pausedTimeRef = useRef<number>(0)
  const progressAtPauseRef = useRef<number>(0)

  // Handle slide progression
  useEffect(() => {
    if (!currentSlide) return

    // Reset progress when slide changes
    setProgress(0)
    startTimeRef.current = Date.now()
    progressAtPauseRef.current = 0

    if (isPaused) return

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / currentSlide.duration) * 100, 100)
      
      setProgress(newProgress)

      if (newProgress >= 100) {
        goToNextSlide()
      }
    }

    progressIntervalRef.current = setInterval(updateProgress, 16) // ~60fps

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [currentStoryIndex, currentSlideIndex, isPaused, currentSlide])

  // Pause / Resume Logic
  useEffect(() => {
    if (isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      pausedTimeRef.current = Date.now()
      progressAtPauseRef.current = progress
    } else {
      // adjust start time so it resumes from where it left off
      const timePaused = Date.now() - pausedTimeRef.current
      startTimeRef.current += timePaused
    }
  }, [isPaused])

  const goToNextSlide = () => {
    if (currentSlideIndex < currentStory.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1)
    } else {
      goToNextStory()
    }
  }

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1)
    } else {
      goToPrevStory()
    }
  }

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1)
      setCurrentSlideIndex(0)
    } else {
      onClose()
    }
  }

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
      setCurrentSlideIndex(0) // Should ideally go to last slide, but standard is first slide of prev story for simplicity sometimes, or last. Let's do first.
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNextSlide()
      if (e.key === "ArrowLeft") goToPrevSlide()
      if (e.key === "Escape") onClose()
      if (e.key === " ") setIsPaused(p => !p)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStoryIndex, currentSlideIndex])

  if (!currentStory) return null

  // Helpers to render the stories on left/center/right
  const renderStoryCard = (index: number, offset: number) => {
    const story = stories[index]
    if (!story) return null
    
    const position = offset === 0 ? "center" : offset < 0 ? "left" : "right"

    // If it's a side card, we just show its first slide or thumbnail
    const slideToRender = position === "center" ? currentSlide : story.slides[0]

    return (
      <div 
        key={`story-${index}`}
        className={cn(
          "relative flex items-center justify-center transition-all duration-300 ease-in-out origin-center shrink-0 rounded-[12px] overflow-hidden",
          position === "center" && "h-[95vh] max-h-[900px] aspect-[9/16] shadow-2xl opacity-100 z-10",
          Math.abs(offset) === 1 && "h-[65vh] max-h-[600px] aspect-[9/16] opacity-40 z-0",
          Math.abs(offset) === 2 && "h-[45vh] max-h-[400px] aspect-[9/16] opacity-20 z-0 hidden lg:flex"
        )}
      >
        {/* Slide Background/Media */}
        {slideToRender.type === "image" && slideToRender.url && (
          <img src={slideToRender.url} className="absolute inset-0 w-full h-full object-cover" alt="story" />
        )}
        {slideToRender.type === "text" && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
            <h2 className="text-white text-3xl font-bold text-center leading-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">
              {slideToRender.content}
            </h2>
          </div>
        )}

        {/* Center UI overlays */}
        {position === "center" && (
          <>
            {/* Nav Chevrons */}
            {currentStoryIndex > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrevStory(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition z-50 shadow-md"
              >
                <ChevronLeft className="size-5 mr-0.5" />
              </button>
            )}
            {currentStoryIndex < stories.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goToNextStory(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition z-50 shadow-md"
              >
                <ChevronRight className="size-5 ml-0.5" />
              </button>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
            

            {/* Header Controls */}
            <div className="absolute top-6 right-4 z-20 flex items-center group bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full p-1 transition-all duration-300">
              <div className="w-0 mx-0 opacity-0 overflow-hidden group-hover:w-20 group-hover:mx-2 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center">
                <input 
                  type="range" 
                  min="0" max="1" step="0.01" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
                  style={{
                    background: `linear-gradient(to right, white ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%)`
                  }}
                />
              </div>
              <button 
                className="text-white/90 hover:text-white transition p-2 rounded-full"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setVolume(volume === 0 ? 1 : 0) 
                }}
              >
                {volume === 0 ? <VolumeX className="size-5" /> : volume < 0.5 ? <Volume1 className="size-5" /> : <Volume2 className="size-5" />}
              </button>
            </div>

            {/* Tap areas for navigation */}
            <div 
              className="absolute inset-y-16 left-0 w-1/3 z-10 cursor-pointer"
              onPointerDown={(e) => {
                e.stopPropagation()
                setIsPaused(true)
              }}
              onPointerUp={(e) => {
                e.stopPropagation()
                setIsPaused(false)
                goToPrevSlide()
              }}
              onPointerLeave={() => setIsPaused(false)}
            />
            <div 
              className="absolute inset-y-16 right-0 w-2/3 z-10 cursor-pointer"
              onPointerDown={(e) => {
                e.stopPropagation()
                setIsPaused(true)
              }}
              onPointerUp={(e) => {
                e.stopPropagation()
                setIsPaused(false)
                goToNextSlide()
              }}
              onPointerLeave={() => setIsPaused(false)}
            />

          </>
        )}
        
        {position !== "center" && (
          <>
            <div className="absolute inset-0 bg-black/60 pointer-events-none z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 pointer-events-none">
              <div className="h-[72px] w-[72px] rounded-full border-[3px] border-white/30 overflow-hidden shadow-2xl p-[2px]">
                <div className={cn("w-full h-full rounded-full overflow-hidden flex items-center justify-center", story.bgClass || "bg-[#0a0a0a]")}>
                  {story.emoji ? (
                    <span className="text-3xl">{story.emoji}</span>
                  ) : (
                    <img src={story.avatarUrl} className="w-full h-full object-cover" alt="" />
                  )}
                </div>
              </div>
              <span className="text-white font-bold text-[16px] [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] px-4 text-center">
                {story.username}
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#1a1a1a] flex items-center justify-center animate-in fade-in duration-300">
      
      {/* Top right close button */}
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[210] text-white/80 hover:text-white transition p-2 cursor-pointer"
      >
        <X className="size-8" />
      </button>

      {/* Stories Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        
        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 min-w-max">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const index = currentStoryIndex + offset;
            
            // If the story doesn't exist (e.g. index < 0 or >= stories.length)
            if (index < 0 || index >= stories.length) {
              return (
                <div 
                  key={`empty-${offset}`} 
                  className={cn(
                    "aspect-[9/16] opacity-0 pointer-events-none shrink-0",
                    offset === 0 && "h-[95vh] max-h-[900px]",
                    Math.abs(offset) === 1 && "h-[65vh] max-h-[600px]",
                    Math.abs(offset) === 2 && "h-[45vh] max-h-[400px] hidden lg:block"
                  )} 
                />
              )
            }

            return renderStoryCard(index, offset)
          })}
        </div>

      </div>

    </div>
  )
}
