import { CircleCheckFill } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"

export type AvatarTone =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red"
  | "teal"
  | "pink"
  | "gray"

const GRADIENTS: Record<AvatarTone, string> = {
  blue: "radial-gradient(circle at 32% 28%, #cfe6ff 0%, #93c1ff 30%, #4f8ff5 62%, #2f5fd0 100%)",
  purple: "radial-gradient(circle at 32% 28%, #e6dcff 0%, #c0a9f5 32%, #8a6fe0 64%, #5b3fc0 100%)",
  green: "radial-gradient(circle at 32% 28%, #d9f0b8 0%, #a9e08a 26%, #6fd0a6 56%, #3fae8a 100%)",
  orange: "radial-gradient(circle at 32% 28%, #ffe7c2 0%, #ffcf8a 30%, #f5a64f 64%, #e07a2f 100%)",
  red: "radial-gradient(circle at 32% 28%, #ffd6cf 0%, #ff9d8a 32%, #f5604f 64%, #d63f3f 100%)",
  teal: "radial-gradient(circle at 32% 28%, #c2f0ec 0%, #8ae0d6 30%, #4fc6d0 62%, #2f9bb0 100%)",
  pink: "radial-gradient(circle at 32% 28%, #ffd9ec 0%, #ffa9d0 32%, #f56fb0 64%, #d63f8a 100%)",
  gray: "radial-gradient(circle at 32% 28%, #ededed 0%, #c9c9c9 32%, #8f8f8f 64%, #4f4f4f 100%)",
}

export function GradientAvatar({
  tone,
  className,
  online,
  verified,
  isCommunity,
  unread,
}: {
  tone: AvatarTone
  className?: string
  online?: boolean
  verified?: boolean
  isCommunity?: boolean
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      {isCommunity ? (
        <>
          <span
            aria-hidden="true"
            className="absolute -left-1 -top-1 block h-full w-full rounded-[25%] opacity-40"
            style={{ backgroundImage: GRADIENTS[tone] }}
          />
          <span
            aria-hidden="true"
            className="absolute -left-0.5 -top-0.5 block h-full w-full rounded-[25%] opacity-70"
            style={{ backgroundImage: GRADIENTS[tone] }}
          />
          <span
            aria-hidden="true"
            className="relative z-10 block h-full w-full rounded-[25%]"
            style={{
              backgroundImage: GRADIENTS[tone],
              boxShadow:
                "inset -1px -2px 4px rgba(0,0,0,0.18), inset 1px 2px 3px rgba(255,255,255,0.45)",
            }}
          />
        </>
      ) : (
        <span
          aria-hidden="true"
          className="block h-full w-full rounded-full"
          style={{
            backgroundImage: GRADIENTS[tone],
            boxShadow:
              "inset -1px -2px 4px rgba(0,0,0,0.18), inset 1px 2px 3px rgba(255,255,255,0.45)",
          }}
        />
      )}
      {online && (
        <span className="absolute bottom-0 right-0 z-20 h-[28%] w-[28%] rounded-full bg-[#22c55e] ring-2 ring-white" />
      )}
      {verified && (
        <CircleCheckFill className="absolute -bottom-0.5 -right-0.5 z-20 h-[40%] w-[40%] text-[#3897f0]" />
      )}
    </span>
  )
}
