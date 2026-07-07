import { cn } from "@/lib/utils"

export function TypingIndicator({ 
  avatar = "AI", 
  text = "Thinking...", 
  className 
}: { 
  avatar?: string, 
  text?: string, 
  className?: string 
}) {
  return (
    <div className={cn("flex items-start gap-4 w-full", className)}>
      <div className="h-8 w-8 shrink-0 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center mt-1">
        <span className="text-[12px] font-medium text-[#0a0a0a] dark:text-white">
          {avatar}
        </span>
      </div>
      <div className="flex flex-col items-start pt-1.5">
        <span className="text-[14.5px] text-[#737373] dark:text-[#a1a1aa] leading-none mb-2.5">
          {text}
        </span>
        <div className="flex items-center gap-1.5 pl-1">
          <div className="size-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:-0.3s]" />
          <div className="size-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:-0.15s]" />
          <div className="size-1.5 rounded-full bg-[#a1a1aa] animate-bounce" />
        </div>
      </div>
    </div>
  )
}
