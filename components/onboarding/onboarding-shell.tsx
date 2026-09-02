"use client"

import React, { useState, useMemo } from "react"
import { Icon } from "@iconify/react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/context/onboarding-context"
import { StepNav } from "./step-nav"
import { Step1Welcome } from "./steps/step1-welcome"
import { Step2Security } from "./steps/step2-security"
import { Step3Profile } from "./steps/step3-profile"
import { Step4Platforms } from "./steps/step4-platforms"
import { Step5Calendar } from "./steps/step5-calendar"
import { Step6KYC } from "./steps/step6-kyc"
import { Step7Preferences } from "./steps/step7-preferences"
import { Step8Review } from "./steps/step8-review"

export type OnboardingData = {
  // Step 2
  securityMethod: "passkey" | "password" | null
  password?: string
  confirmPassword?: string

  // Step 3
  photo: File | null
  photoPreview: string | null
  name: string
  socialHandle: string
  location: string
  bio: string
  nicheTags: string[]

  // Step 4
  connectedPlatforms: string[]

  // Step 5
  calendarConnected: boolean

  // Step 6
  panNumber: string
  bankAccount: string
  bankAccountConfirm: string
  ifsc: string

  // Step 7
  startingPrice: string
  responseTime: string
  responseTimeUnit: string
  revisionRounds: string
  usageRights: string
  blackoutDates: string
}

const defaultData: OnboardingData = {
  securityMethod: null,
  password: "",
  confirmPassword: "",
  photo: null,
  photoPreview: null,
  name: "",
  socialHandle: "",
  location: "",
  bio: "",
  nicheTags: [],
  connectedPlatforms: [],
  calendarConnected: false,
  panNumber: "",
  bankAccount: "",
  bankAccountConfirm: "",
  ifsc: "",
  startingPrice: "",
  responseTime: "24",
  responseTimeUnit: "hours",
  revisionRounds: "1",
  usageRights: "30_days",
  blackoutDates: "",
}

const STEPS = [
  { id: 1, label: "Welcome", component: Step1Welcome },
  { id: 2, label: "Security", component: Step2Security },
  { id: 3, label: "Profile", component: Step3Profile },
  { id: 4, label: "Social", component: Step4Platforms },
  { id: 5, label: "Calendar", component: Step5Calendar },
  { id: 6, label: "KYC & Payouts", component: Step6KYC },
  { id: 7, label: "Preferences", component: Step7Preferences },
  { id: 8, label: "Review", component: Step8Review },
]

export type StepProps = {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  onNext: () => void
}

export function OnboardingShell() {
  const router = useRouter()
  const { status } = useOnboarding()
  
  const initialStep = useMemo(() => {
    if (!status.currentStep) return 1
    switch (status.currentStep) {
      case "profile_basics":
      case "expertise_tags":
        return 3
      case "social_connect":
        return 4
      case "payout_method":
        return 6
      case "availability":
        return 7
      case "team_setup":
        return 8
      default:
        return 1
    }
  }, [status.currentStep])

  const [step, setStep] = useState(initialStep)
  
  const initialCompleted = useMemo(() => {
    const s = new Set<number>()
    for (const cs of status.completedSteps) {
      if (cs === "profile_basics" || cs === "expertise_tags") s.add(3)
      if (cs === "social_connect") s.add(4)
      if (cs === "payout_method") s.add(6)
      if (cs === "availability") s.add(7)
      if (cs === "team_setup") s.add(8)
    }
    for (let i = 1; i < initialStep; i++) s.add(i)
    return s
  }, [status.completedSteps, initialStep])

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(initialCompleted)
  const [data, setData] = useState<OnboardingData>(defaultData)

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const goNext = () => {
    setCompletedSteps(prev => new Set(prev).add(step))
    if (step < STEPS.length) {
      setStep(s => s + 1)
      const panel = document.getElementById("onboarding-right-panel")
      if (panel) panel.scrollTop = 0
    }
  }

  const CurrentStepComponent = STEPS[step - 1].component

  return (
    <div className="flex min-h-screen w-full bg-[#f4f4f5] dark:bg-[#0a0a0a]">
      {/* Left fixed panel */}
      <div className="hidden lg:flex w-[320px] shrink-0 flex-col border-r border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] h-screen sticky top-0">
        <div className="p-6">
          <Icon icon="gravity-ui:triangle-right-fill" className="size-8 text-[#0a0a0a] dark:text-white" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 mt-4">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-4">Onboarding Progress</div>
          <StepNav currentStep={step} completedSteps={completedSteps} steps={STEPS} onStepClick={setStep} />
        </div>
        <div className="p-6 border-t border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <Icon icon="gravity-ui:face-smile" className="size-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Need help?</div>
              <a href="#" className="text-[12px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Chat with support</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right scrollable panel */}
      <div id="onboarding-right-panel" className="flex-1 overflow-y-auto h-screen relative">
        <div className="lg:hidden absolute top-4 left-4 z-10">
          <Icon icon="gravity-ui:triangle-right-fill" className="size-8 text-[#0a0a0a] dark:text-white" />
        </div>

        <div className="mx-auto max-w-[600px] px-6 py-24 sm:px-12 lg:px-16 min-h-full flex flex-col">
          <CurrentStepComponent data={data} onChange={updateData} onNext={goNext} />
          
          <div className="mt-auto pt-16 flex items-center justify-center gap-6">
            <div className="text-[12px] font-medium text-[#a1a1aa]">© {new Date().getFullYear()} Creonity</div>
            <a href="#" className="text-[12px] font-medium text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white">Privacy</a>
            <a href="#" className="text-[12px] font-medium text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </div>
  )
}
