"use client"

import {
  ChartLine,
  Clock,
  Comment,
  Heart,
  PaperPlane,
  Pulse,
  Bookmark as GravityBookmark,
} from "@gravity-ui/icons"

interface PostDetailModalProps {
  selectedPost: any
  onClose: () => void
}

export function PostDetailModal({ selectedPost, onClose }: PostDetailModalProps) {
  if (!selectedPost) return null;

  // Determine layout ratios based on format
  let mediaRatioClass = "aspect-[9/16]" // default Reel
  let containerMaxWidth = "max-w-5xl"
  let mediaWidthClass = "md:w-[50%]"
  let detailsWidthClass = "md:w-[50%]"
  
  // Default values to prevent errors if some fields are missing
  const postType = selectedPost.type || ""
  const typeLower = postType.toLowerCase()
  const platform = selectedPost.platform || "unknown"
  const displayType = selectedPost.displayType || ""
  
  const isReel = platform === "tt" || typeLower.includes("reel") || displayType === "REEL"
  const isYoutubeVideo = platform === "yt" && !typeLower.includes("short")

  if (isReel) {
    mediaRatioClass = "aspect-[9/16]"
    containerMaxWidth = "max-w-6xl"
    mediaWidthClass = "md:w-[50%]"
    detailsWidthClass = "md:w-[50%]"
  } else if (isYoutubeVideo) {
    mediaRatioClass = "aspect-video" // 16:9
    containerMaxWidth = "max-w-8xl"
    mediaWidthClass = "md:w-[55%]"
    detailsWidthClass = "md:w-[45%]"
  } else {
    // Standard Image Post or Carousel -> 4:3 ratio
    mediaRatioClass = "aspect-[4/3]"
    containerMaxWidth = "max-w-8xl"
    mediaWidthClass = "md:w-[50%]"
    detailsWidthClass = "md:w-[50%]"
  }

  // Define class variations based on layout style
  let parentClass = ""
  let leftWrapperClass = ""
  let playerBoxClass = ""
  let detailsClass = ""
  
  if (isReel) {
    parentClass = "w-full h-full md:h-[90vh] md:max-h-[920px] md:w-fit bg-white dark:bg-[#0c0c0e] rounded-none md:rounded-2xl border-0 md:border border-gray-200/80 dark:border-white/10 relative flex flex-col md:flex-row overflow-y-auto md:overflow-hidden cursor-default animate-in zoom-in-95 duration-350 ease-out"
    leftWrapperClass = "p-1.5 sm:p-2 flex items-center justify-center h-full shrink-0"
    playerBoxClass = "bg-black relative flex items-center justify-center overflow-hidden cursor-pointer select-none group/player h-full w-auto aspect-[9/16] rounded-xl border border-gray-150 dark:border-white/5"
    detailsClass = "flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-[#0c0c0e] overflow-y-auto h-full w-full md:w-[520px] shrink-0"
  } else if (isYoutubeVideo) {
    // YT stack layout
    parentClass = "w-full h-full md:h-fit md:max-h-[92vh] bg-white dark:bg-[#0c0c0e] rounded-none md:rounded-2xl border-0 md:border border-gray-200/80 dark:border-white/10 relative flex flex-col overflow-y-auto md:overflow-hidden cursor-default animate-in zoom-in-95 duration-350 ease-out max-w-4xl"
    leftWrapperClass = "p-2 sm:p-2.5 flex items-center justify-center w-full shrink-0"
    playerBoxClass = "bg-black relative flex items-center justify-center overflow-hidden cursor-pointer select-none group/player w-full aspect-video rounded-xl border border-gray-150 dark:border-white/5"
    detailsClass = "flex flex-col justify-between p-6 bg-white dark:bg-[#0c0c0e] overflow-y-auto w-full h-fit"
  } else {
    // Standard Image Post or Carousel
    parentClass = "w-full h-full md:h-[90vh] md:max-h-[850px] md:w-fit bg-white dark:bg-[#0c0c0e] rounded-none md:rounded-2xl border-0 md:border border-gray-200/80 dark:border-white/10 relative flex flex-col md:flex-row overflow-y-auto md:overflow-hidden cursor-default animate-in zoom-in-95 duration-350 ease-out"
    leftWrapperClass = "p-1.5 sm:p-2 flex items-center justify-center h-full shrink-0"
    playerBoxClass = "bg-black relative flex items-center justify-center overflow-hidden cursor-pointer select-none group/player h-full w-auto aspect-[3/4] rounded-xl border border-gray-150 dark:border-white/5"
    detailsClass = "flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-[#0c0c0e] overflow-y-auto h-full w-full md:w-[400px] shrink-0 border-l border-gray-100 dark:border-white/5"
  }

  // Ensure default fallback values for math operations
  const reachVal = Number(selectedPost.reach || 0);
  const likesVal = Number(selectedPost.likes || 0);
  const commentsVal = Number(selectedPost.comments || 0);
  const savesVal = Number(selectedPost.saves || 0);
  const sharesVal = Number(selectedPost.shares || 0);
  
  // Choose an image placeholder based on title
  const titleStr = selectedPost.title || "Post"
  const imgIndex = (titleStr.charCodeAt(0) % 3) + 1;
  const imgSrc = selectedPost.image || `/images/pinterest-${imgIndex}.jpg`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-black/65 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
      onClick={onClose}
    >
      {/* Floating screen viewport top-right close button */}
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[110] text-white/70 hover:text-white transition-colors text-[28px] font-light leading-none p-2"
      >
        ✕
      </button>
      <div 
        className={parentClass}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column Container */}
        <div className={leftWrapperClass}>
          <div className={playerBoxClass}>
            <img 
              src={imgSrc} 
              alt={titleStr} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right Column (Data/Details View) */}
        <div 
          className={detailsClass}
          style={{ minHeight: "auto" }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-[13px] shadow-sm select-none ring-2 ring-white dark:ring-[#0c0c0e]">
                  CR
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-gray-900 dark:text-white leading-none tracking-tight">creonity.app</span>
                    <span className="h-3.5 w-3.5 bg-[#0060ff] text-[8px] flex items-center justify-center rounded-full text-white font-black">✓</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 mt-1">Creator Hub Analytics</span>
                </div>
              </div>
            </div>

            {/* Caption / Description */}
            <div className="flex flex-col">
              {isYoutubeVideo ? (
                <>
                  <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug">{titleStr}</span>
                  <span className="text-[13px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                    In this video, we dive deep into the analytics and performance of our latest drop. Watch till the end for exclusive insights!
                  </span>
                </>
              ) : (
                <span className="text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                  {titleStr} 🎬🍾
                </span>
              )}
              <span className="text-[12px] font-medium text-gray-400 dark:text-gray-500 mt-2">{selectedPost.date || "Today"}, 2026</span>
            </div>

            {/* Detailed Analytics Restructured */}
            <div className="flex flex-col mt-6">
              {/* Hero Stat: Reach */}
              <div className="flex flex-col mb-8">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">Total Reach</h3>
                <span className="text-[38px] font-black text-gray-900 dark:text-white leading-none tracking-tight">
                  {reachVal.toLocaleString()}
                </span>
                <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-500 mt-2.5 flex items-center">
                  <ChartLine className="w-3.5 h-3.5 mr-1.5" />
                  34% above your 30-day average
                </span>
              </div>

              {/* Engagement Section */}
              <div className="flex flex-col pt-5">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">Engagement</h3>
                
                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span className="text-[14px] font-medium">Likes</span>
                    </div>
                    <span className="text-[14px] font-bold text-gray-900 dark:text-white">{likesVal.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                      <Comment className="w-4 h-4 text-gray-400" />
                      <span className="text-[14px] font-medium">Comments</span>
                    </div>
                    <span className="text-[14px] font-bold text-gray-900 dark:text-white">{commentsVal.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                      <GravityBookmark className="w-4 h-4 text-gray-400" />
                      <span className="text-[14px] font-medium">Saved</span>
                    </div>
                    <span className="text-[14px] font-bold text-gray-900 dark:text-white">{savesVal.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                      <PaperPlane className="w-4 h-4 text-gray-400" />
                      <span className="text-[14px] font-medium">Shares</span>
                    </div>
                    <span className="text-[14px] font-bold text-gray-900 dark:text-white">{sharesVal.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                      <Pulse className="w-4 h-4 text-gray-400" />
                      <span className="text-[14px] font-medium">Engagement Rate</span>
                    </div>
                    <span 
                      className="text-[13px] font-bold px-2 py-0.5 rounded-md" 
                      style={{ 
                        color: selectedPost.accent || "#0ea5e9",
                        backgroundColor: `${selectedPost.accent || "#0ea5e9"}15`
                      }}
                    >
                      {selectedPost.er || "0.0"}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings & Performance Section */}
              <div className="flex flex-col pt-5 mt-2">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2">Earnings & Performance</h3>
                
                <div className="flex flex-col">
                  {selectedPost.viewDuration && selectedPost.viewDuration !== "N/A" && (
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-[14px] font-medium">Avg Watch Time</span>
                      </div>
                      <span className="text-[14px] font-bold text-gray-900 dark:text-white">{selectedPost.viewDuration}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                        <ChartLine className="w-4 h-4 text-gray-400" />
                        <span className="text-[14px] font-medium">Est. Revenue</span>
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 ml-6 mt-0.5">Campaign deal</span>
                    </div>
                    <span className="text-[15px] font-bold text-emerald-600 dark:text-emerald-500">₹{(reachVal * 0.18).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
