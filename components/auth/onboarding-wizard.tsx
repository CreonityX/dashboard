"use client"

import React, { useState } from "react"
import { Form, Input, Button, Checkbox, Avatar, Fieldset } from "@heroui/react"
import { ArrowUpRight, Calendar, Check, ChevronRight, Handset, Person } from "@gravity-ui/icons"

interface OnboardingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  socialLink: string
}

export function OnboardingWizard({ initialData }: { initialData: OnboardingData }) {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(s => s + 1)
    }, 800)
  }

  return (
    <div className="w-full max-w-lg mx-auto p-8 sm:p-10 rounded-[24px] bg-white dark:bg-[#0a0a0a] border border-[#efefef] dark:border-[#27272a] shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
      
      {/* Progress indicators */}
      {step < 3 && (
        <div className="flex gap-2 mb-8 justify-center">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step ? "w-8 bg-black dark:bg-white" : 
                i < step ? "w-4 bg-black/40 dark:bg-white/40" : "w-4 bg-gray-200 dark:bg-white/10"
              }`}
            />
          ))}
        </div>
      )}

      {/* Step 0: Verification & Password */}
      {step === 0 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {initialData.firstName}!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">We're thrilled you're here. Let's finish setting up your account.</p>
          </div>

          <Form onSubmit={handleNext} className="flex flex-col gap-6" validationBehavior="native">
            <Fieldset className="w-full border border-gray-200 dark:border-[#27272a] p-4 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
              <Fieldset.Legend className="text-sm font-semibold mb-2">Verify your details</Fieldset.Legend>
              <Fieldset.Group>
                <div className="grid grid-cols-2 gap-4">
                  <Input isRequired label="First Name" defaultValue={initialData.firstName} size="sm" variant="bordered" />
                  <Input isRequired label="Last Name" defaultValue={initialData.lastName} size="sm" variant="bordered" />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Input isRequired type="email" label="Email" defaultValue={initialData.email} size="sm" variant="bordered" />
                  <Input type="tel" label="Phone Number" defaultValue={initialData.phone} size="sm" variant="bordered" />
                  <Input type="url" label="Primary Social Link" defaultValue={initialData.socialLink} size="sm" variant="bordered" />
                </div>
              </Fieldset.Group>
            </Fieldset>

            <Fieldset className="w-full">
              <Fieldset.Legend className="text-sm font-semibold mb-2">Secure your account</Fieldset.Legend>
              <Fieldset.Group>
                <Input
                  isRequired
                  type="password"
                  label="Create Password"
                  placeholder="••••••••"
                  variant="bordered"
                  className="w-full"
                  description="Must be at least 8 characters long."
                />
              </Fieldset.Group>
            </Fieldset>

            <Button 
              type="submit" 
              className="w-full bg-black text-white dark:bg-white dark:text-black font-medium mt-2"
              isLoading={isLoading}
              endContent={!isLoading && <ChevronRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </Form>
        </div>
      )}

      {/* Step 1: Profile & Persona */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Build your persona</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Upload a photo and pick a unique handle.</p>
          </div>

          <Form onSubmit={handleNext} className="flex flex-col gap-8" validationBehavior="native">
            <div className="flex flex-col items-center gap-4 w-full">
              <Avatar 
                className="w-24 h-24 text-large bg-gray-100 dark:bg-white/10" 
                fallback={<span className="text-3xl text-gray-400">{initialData.firstName[0]}</span>}
              />
              <Button size="sm" variant="flat" startContent={<Person className="w-4 h-4" />} className="font-medium">
                Upload Photo
              </Button>
            </div>

            <div className="w-full">
              <Input
                isRequired
                label="Choose your handle"
                placeholder="username"
                startContent={<span className="text-gray-400 text-sm mr-1">@</span>}
                variant="bordered"
                size="lg"
                description="This will be your unique identifier on Creonity."
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black text-white dark:bg-white dark:text-black font-medium mt-4"
              isLoading={isLoading}
              endContent={!isLoading && <ChevronRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          </Form>
        </div>
      )}

      {/* Step 2: Integrations */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Connect your tools</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Sync your calendar and socials to get the most out of Creonity.</p>
          </div>

          <Form onSubmit={handleNext} className="flex flex-col gap-6" validationBehavior="native">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] transition-all hover:border-gray-300 dark:hover:border-gray-700">
                <div className="mt-1">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Google Calendar</h3>
                  <p className="text-xs text-gray-500 mt-1">Sync your meetings and deadlines automatically.</p>
                </div>
                <Checkbox size="lg" />
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] transition-all hover:border-gray-300 dark:hover:border-gray-700">
                <div className="mt-1">
                  <ArrowUpRight className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Social Analytics</h3>
                  <p className="text-xs text-gray-500 mt-1">Connect Instagram and TikTok to pull live stats.</p>
                </div>
                <Checkbox size="lg" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black text-white dark:bg-white dark:text-black font-medium mt-4"
              isLoading={isLoading}
            >
              Complete Setup
            </Button>
            <button 
              type="button" 
              onClick={(e) => handleNext(e as any)}
              className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </Form>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center text-center py-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You're all set!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
            Your account has been successfully created. We're redirecting you to your new workspace...
          </p>
          <Button 
            className="bg-black text-white dark:bg-white dark:text-black font-medium"
            onClick={() => window.location.href = '/calendar'}
          >
            Go to Dashboard
          </Button>
        </div>
      )}

    </div>
  )
}
