"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Story, StoryViewerModal } from "./story-viewer-modal"

// Mock Data for Stories
const MOCK_STORIES: Story[] = [
  {
    id: "story-1",
    username: "Wallet ready",
    avatarUrl: "/images/story-icon-wallet.jpg",
    isSeen: false,
    slides: [
      {
        id: "s1-1",
        type: "text",
        content: "Wallet is ready for withdrawal! 💰",
        duration: 4000,
        date: "Just now",
      },
    ],
  },
  {
    id: "story-2",
    username: "New invite",
    avatarUrl: "/images/story-icon-invite.jpg",
    isSeen: false,
    slides: [
      {
        id: "s2-1",
        type: "text",
        content: "You have a new campaign invite waiting! 📩",
        duration: 4000,
        date: "5h",
      },
    ],
  },
  {
    id: "story-3",
    username: "Reach up 24%",
    avatarUrl: "/images/story-icon-chart.jpg",
    isSeen: false,
    slides: [
      {
        id: "s3-1",
        type: "text",
        content: "Your reach is up 24% this week! 🚀",
        duration: 4000,
        date: "8h",
      },
    ],
  },
  {
    id: "story-4",
    username: "3 today",
    avatarUrl: "/images/story-icon-calendar.jpg",
    isSeen: true,
    slides: [
      {
        id: "s4-1",
        type: "text",
        content: "3 urgent tasks need your attention today.",
        duration: 3000,
        date: "12h",
      },
    ],
  },
  {
    id: "story-5",
    username: "Top 15%",
    avatarUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    isSeen: true,
    slides: [
      {
        id: "s5-1",
        type: "text",
        content: "Congratulations! You're in the top 15% of creators! 🏆",
        duration: 4000,
        date: "1d",
      },
    ],
  },
]

export function StoriesBar() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  
  // Sort stories so unseen are first
  const sortedStories = [...MOCK_STORIES].sort((a, b) => {
    if (a.isSeen === b.isSeen) return 0
    return a.isSeen ? 1 : -1
  })

  return (
    <>
      <div className="w-full overflow-hidden mb-6">
        <div className="flex items-center gap-5 md:gap-7 overflow-x-auto no-scrollbar scroll-smooth px-2 pb-4 pt-2">
          {sortedStories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center gap-2.5 shrink-0 group focus:outline-none"
            >
              {/* Avatar Ring Container */}
              <div 
                className={cn(
                  "relative rounded-full transition-transform active:scale-95",
                  !story.isSeen 
                    ? "ring-[3px] ring-[#ccff00] ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]" 
                    : "ring-2 ring-gray-200 dark:ring-white/20 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]"
                )}
              >
                <div className={cn("flex items-center justify-center rounded-full h-16 w-16 sm:h-18 sm:w-18 md:h-[72px] md:w-[72px]", story.bgClass)}>
                  {story.emoji ? (
                    <span className="text-3xl">{story.emoji}</span>
                  ) : (
                    <img 
                      src={story.avatarUrl} 
                      alt={story.username} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
              <span className="text-[11px] md:text-[12px] w-full max-w-[84px] truncate text-center font-medium text-gray-500 dark:text-gray-400">
                {story.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeStoryIndex !== null && (
        <StoryViewerModal 
          stories={sortedStories}
          initialStoryIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}
    </>
  )
}
