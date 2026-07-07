import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import type { OnboardingData } from "./onboarding-shell"

type Step = {
  id: number
  label: string
  icon: string
}

interface StepNavProps {
  steps: Step[]
  currentStep: number
  completedSteps: Set<number>
  onSelect: (step: number) => void
  data: OnboardingData
}

function renderStepDetails(stepId: number, data: OnboardingData) {
  switch(stepId) {
    case 1:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Name</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.name || "—"}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Email</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.email || "—"}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Phone</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.phone || "—"}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Category</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white capitalize truncate">{data.category || "—"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Social handle</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.socialHandle || "—"}</div>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div className="col-span-2">
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Method</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white capitalize truncate">{data.securityMethod || "—"}</div>
          </div>
        </div>
      )
    case 3:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div className="col-span-2">
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Bio</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.bio ? "Filled" : "Empty"}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Tags</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.nicheTags.length} selected</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Location</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.location || "—"}</div>
          </div>
        </div>
      )
    case 4:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div className="col-span-2">
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Connected platforms</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.connectedPlatforms.length > 0 ? data.connectedPlatforms.join(", ") : "None"}</div>
          </div>
        </div>
      )
    case 5:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div className="col-span-2">
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Status</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.calendarConnected ? "Connected" : "Skipped"}</div>
          </div>
        </div>
      )
    case 6:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">PAN</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white uppercase truncate">{data.panNumber || "—"}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">IFSC</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white uppercase truncate">{data.ifsc || "—"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Bank account</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.bankAccount || "—"}</div>
          </div>
        </div>
      )
    case 7:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Price</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.startingPrice ? `₹${data.startingPrice}` : "—"}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Revisions</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.revisionRounds} rounds</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Usage rights</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white capitalize truncate">{data.usageRights}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Response time</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.responseTime} {data.responseTimeUnit}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Blackout dates</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.blackoutDates || "—"}</div>
          </div>
        </div>
      )
    case 8:
      return (
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Email alerts</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.notifyEmail ? "On" : "Off"}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#a1a1aa] mb-1">Push alerts</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.notifyPush ? "On" : "Off"}</div>
          </div>
        </div>
      )
  }
}

export function StepNav({ steps, currentStep, completedSteps, onSelect, data }: StepNavProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = completedSteps.has(step.id)
        const isFuture = !isActive && !isCompleted
        const isClickable = isCompleted

        return (
          <div key={step.id} className="relative z-10">
            {/* Connecting line between steps */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-[21px] top-[24px] w-[2px] h-[calc(100%+2px)] z-0 transition-colors duration-300",
                  isCompleted
                    ? "bg-emerald-500"
                    : "bg-[#e4e4e7] dark:bg-[#2a2a2a]"
                )}
              />
            )}

            <div className="relative z-10 w-full px-2 py-2.5">
              <button
                onClick={() => isClickable && onSelect(step.id)}
                disabled={isFuture || isActive}
                className={cn(
                  "flex items-center gap-3 w-full text-left rounded-xl transition-all duration-200 outline-none",
                  isClickable && "hover:opacity-80 cursor-pointer",
                  (isFuture || isActive) && "cursor-default"
                )}
              >
                {/* Circle indicator */}
                <div
                  className={cn(
                    "flex items-center justify-center w-[28px] h-[28px] rounded-full shrink-0 text-[11px] font-bold border-2 transition-all duration-300 bg-white dark:bg-[#0a0a0a] relative z-20",
                    isActive &&
                      "border-[#0a0a0a] dark:border-white text-[#0a0a0a] dark:text-white scale-110",
                    isCompleted &&
                      "bg-emerald-500 dark:bg-emerald-500 border-emerald-500 dark:border-emerald-500 text-white dark:text-white",
                    isFuture &&
                      "border-[#d4d4d8] dark:border-[#3f3f46] text-[#a1a1aa]"
                  )}
                >
                  {isCompleted ? (
                    <Icon icon="gravity-ui:check" className="size-3.5" />
                  ) : (
                    <Icon icon={step.icon} className="size-3.5" />
                  )}
                </div>

                {/* Labels */}
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-[14px] transition-colors",
                      isActive && "font-bold text-[#0a0a0a] dark:text-white",
                      isCompleted && "font-semibold text-[#52525b] dark:text-[#71717a]",
                      isFuture && "font-semibold text-[#b4b4b8] dark:text-[#4f4f4f]"
                    )}
                  >
                    {step.label}
                  </div>
                </div>
              </button>

              {/* Active Step Details Box */}
              {isActive && (
                <div className="ml-[40px] mt-3 mb-2 p-5 rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] relative z-10 animate-in fade-in zoom-in-95 duration-300">
                  {renderStepDetails(step.id, data)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
