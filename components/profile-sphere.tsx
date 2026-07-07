import { cn } from "@/lib/utils"

export function ProfileSphere({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block rounded-full", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle at 32% 30%, #d9f0b8 0%, #a9e08a 22%, #6fd0a6 48%, #4aa6d6 72%, #2f6fd0 100%)",
        boxShadow: "inset -1px -2px 4px rgba(0,0,0,0.18), inset 1px 2px 3px rgba(255,255,255,0.45)",
      }}
    />
  )
}
