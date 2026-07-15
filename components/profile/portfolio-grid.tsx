"use client"

import { useState } from "react"
import { PostDetailModal } from "@/components/shared/post-detail-modal"
const workItems = [
  { id: 1, title: "Can-Am", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
  { id: 2, title: "FANTASMAGORIE", image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80" },
  { id: 3, title: "EXIT ÀÉÖ 2AM", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80" },
  { id: 4, title: "UI Components", image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80" },
  { id: 5, title: "ROSES", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80" },
  { id: 6, title: "Netflix Icon", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80" },
  { id: 7, title: "Crypto Dash", image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80" },
  { id: 8, title: "Workspace", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" }
]

export function PortfolioGrid() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 mt-6 pb-20">
        {workItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedPost({
              id: item.id,
              title: item.title,
              image: item.image,
              platform: "ig",
              type: "image",
              reach: 12500,
              likes: 1200,
              comments: 84,
              saves: 15,
              shares: 10,
              er: 10.4,
              accent: "#ec4899",
              date: "Aug 15",
              viewDuration: "N/A"
            })}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#f4f4f5] dark:bg-[#111111] cursor-pointer"
          >
            {/* Image */}
            <img 
              src={item.image} 
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-[16px] font-bold text-white truncate">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <PostDetailModal 
          selectedPost={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  )
}
