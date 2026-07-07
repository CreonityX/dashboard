"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
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
  // Step 1
  name: string
  email: string
  phone: string
  phoneVerified: boolean
  category: string
  socialHandle: string
  // Step 2
  securityMethod: "passkey" | "password"
  password: string
  confirmPassword: string
  // Step 3
  photo: File | null
  photoPreview: string | null
  bio: string
  location: string
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
  revisionRounds: string
  usageRights: string
  responseTime: string
  responseTimeUnit: string
  blackoutDates: string
  // Step 8
  notifyEmail: boolean
  notifyPush: boolean
}

const defaultData: OnboardingData = {
  name: "Aryan Kapoor",
  email: "aryan.kapoor@gmail.com",
  phone: "9876543210",
  phoneVerified: false,
  category: "lifestyle",
  socialHandle: "@aryankapoor",
  securityMethod: "passkey",
  password: "",
  confirmPassword: "",
  photo: null,
  photoPreview: null,
  bio: "",
  location: "",
  nicheTags: [],
  connectedPlatforms: [],
  calendarConnected: false,
  panNumber: "",
  bankAccount: "",
  bankAccountConfirm: "",
  ifsc: "",
  startingPrice: "",
  revisionRounds: "1",
  usageRights: "platform",
  responseTime: "24",
  responseTimeUnit: "hours",
  blackoutDates: "",
  notifyEmail: true,
  notifyPush: true,
}

const STEPS = [
  { id: 1, label: "Welcome", icon: "gravity-ui:persons" },
  { id: 2, label: "Security", icon: "gravity-ui:shield-check" },
  { id: 3, label: "Profile", icon: "gravity-ui:person" },
  { id: 4, label: "Platforms", icon: "gravity-ui:display-pulse" },
  { id: 5, label: "Calendar", icon: "gravity-ui:calendar" },
  { id: 6, label: "Payouts", icon: "gravity-ui:credit-card" },
  { id: 7, label: "Preferences", icon: "gravity-ui:sliders" },
  { id: 8, label: "Review", icon: "gravity-ui:list-check" },
]

export type StepProps = {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  onNext: () => void
}

export function OnboardingShell() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [data, setData] = useState<OnboardingData>(defaultData)

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const goNext = () => {
    setCompletedSteps(prev => new Set([...prev, step]))
    if (step < 8) {
      setStep(step + 1)
      // Scroll right panel to top
      const panel = document.getElementById("onboarding-right-panel")
      if (panel) panel.scrollTop = 0
    } else {
      router.push("/")
    }
  }

  const goTo = (targetStep: number) => {
    if (completedSteps.has(targetStep)) {
      setStep(targetStep)
    }
  }

  const stepProps: StepProps = { data, onChange: updateData, onNext: goNext }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Welcome {...stepProps} />
      case 2: return <Step2Security {...stepProps} />
      case 3: return <Step3Profile {...stepProps} />
      case 4: return <Step4Platforms {...stepProps} />
      case 5: return <Step5Calendar {...stepProps} />
      case 6: return <Step6KYC {...stepProps} />
      case 7: return <Step7Preferences {...stepProps} />
      case 8: return <Step8Review {...stepProps} />
      default: return null
    }
  }

  return (
    <div className="flex h-[100dvh] w-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
      
      {/* ─── Left Rail (Nav) ─── */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 h-screen p-3 lg:pr-1.5">
        <div className="flex-1 w-full h-full rounded-3xl border border-[#e4e4e7] dark:border-[#1f1f1f] bg-white dark:bg-[#0a0a0a] flex flex-col overflow-hidden relative">
          {/* Logo */}
          <div className="px-8 pt-10 pb-8">
            <span className="text-[20px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Creonity</span>
          </div>

          {/* Step list */}
          <div className="flex-1 px-5 overflow-y-auto flex flex-col justify-center">
            <div className="w-full my-auto py-8">
              <StepNav
                steps={STEPS}
                currentStep={step}
                completedSteps={completedSteps}
                onSelect={goTo}
                data={data}
              />
            </div>
          </div>


        </div>
      </div>

      {/* ─── Right Panel (Inputs) ─── */}
      <div className="flex flex-col flex-1 relative p-3 lg:pl-1.5">
        <div id="onboarding-right-panel" className="flex-1 w-full h-full rounded-3xl border border-[#e4e4e7] dark:border-[#1f1f1f] bg-white dark:bg-[#111111] overflow-y-auto scroll-smooth">
          {/* Mobile progress bar */}
          <div className="lg:hidden h-1 w-full bg-[#e4e4e7] dark:bg-[#2a2a2a] sticky top-0 z-10">
            <div
              className="h-1 bg-[#0a0a0a] dark:bg-white transition-all duration-500"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>

          <div
            key={step}
            className="max-w-[600px] mx-auto px-6 py-12 lg:py-14 animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            {renderStep()}
          </div>
        </div>
      </div>

    </div>
  )
}
