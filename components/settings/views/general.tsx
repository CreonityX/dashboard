"use client"

import { Icon } from "@iconify/react"
import { Switch, Button, Dropdown } from "@heroui/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Moon, Sun, ShieldCheck } from "@gravity-ui/icons"
import {
  SettingsCard,
  SettingsPage,
  SettingsSection,
} from "../settings-ui"

const DropdownSelect = ({ value, options, onChange, minWidth = "260px" }: any) => {
  const selected = options.find((o: any) => o.id === value)
  return (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <button 
          style={{ minWidth }}
          className="h-10 px-4 bg-transparent border border-[#e4e4e7] dark:border-[#27272a] hover:bg-[#e4e4e7]/50 dark:hover:bg-[#27272a]/50 rounded-xl text-[14px] font-medium text-[#0a0a0a] dark:text-white flex items-center justify-between transition-colors shrink-0 cursor-pointer"
        >
          <span className="truncate pr-2">{selected?.label || "Select..."}</span>
          <Icon icon="gravity-ui:chevron-down" className="w-4 h-4 opacity-50 shrink-0" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]" style={{ minWidth }}>
        <Dropdown.Menu 
          aria-label="Selection" 
          className="p-1 max-h-[300px] overflow-y-auto scrollbar-hide"
          onAction={(key) => onChange(key as string)}
        >
          {options.map((opt: any) => (
            <Dropdown.Item key={opt.id} textValue={opt.label} className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">{opt.label}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export function GeneralView({ onBack }: { onBack?: () => void }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sidebarDensity, setSidebarDensity] = useState("comfortable")
  const [animations, setAnimations] = useState("medium")
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("ist")
  const [dateFormat, setDateFormat] = useState("ddmm")
  const [numberFormat, setNumberFormat] = useState("in")

  const sidebarDensityOptions = [
    { id: "comfortable", label: "Comfortable" },
    { id: "compact", label: "Compact" }
  ]
  const languageOptions = [
    { id: "en", label: "English" },
    { id: "es", label: "Spanish (Español)" },
    { id: "zh", label: "Chinese (中文)" },
    { id: "hi", label: "Hindi (हिन्दी)" },
    { id: "ar", label: "Arabic (العربية)" },
    { id: "pt", label: "Portuguese (Português)" },
    { id: "bn", label: "Bengali (বাংলা)" },
    { id: "ru", label: "Russian (Русский)" },
    { id: "ja", label: "Japanese (日本語)" },
    { id: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
    { id: "de", label: "German (Deutsch)" },
    { id: "fr", label: "French (Français)" },
    { id: "ko", label: "Korean (한국어)" },
    { id: "vi", label: "Vietnamese (Tiếng Việt)" },
    { id: "te", label: "Telugu (తెలుగు)" },
    { id: "mr", label: "Marathi (मराठी)" },
    { id: "ta", label: "Tamil (தமிழ்)" },
    { id: "tr", label: "Turkish (Türkçe)" },
    { id: "ur", label: "Urdu (اردو)" },
    { id: "it", label: "Italian (Italiano)" },
    { id: "th", label: "Thai (ไทย)" },
    { id: "gu", label: "Gujarati (ગુજરાતી)" },
    { id: "fa", label: "Persian (فارسی)" },
    { id: "pl", label: "Polish (Polski)" },
  ]
  const timezoneOptions = [
    { id: "us-hi", label: "Hawaii-Aleutian Time (HST) UTC-10:00" },
    { id: "us-ak", label: "Alaska Time (AKST) UTC-09:00" },
    { id: "pst", label: "Pacific Time (PT) UTC-08:00" },
    { id: "mst", label: "Mountain Time (MT) UTC-07:00" },
    { id: "cst", label: "Central Time (CT) UTC-06:00" },
    { id: "est", label: "Eastern Time (ET) UTC-05:00" },
    { id: "brt", label: "Brasília Time (BRT) UTC-03:00" },
    { id: "gmt", label: "Greenwich Mean Time (GMT) UTC+00:00" },
    { id: "cet", label: "Central European Time (CET) UTC+01:00" },
    { id: "eet", label: "Eastern European Time (EET) UTC+02:00" },
    { id: "msk", label: "Moscow Standard Time (MSK) UTC+03:00" },
    { id: "gst", label: "Gulf Standard Time (GST) UTC+04:00" },
    { id: "pkst", label: "Pakistan Standard Time (PKT) UTC+05:00" },
    { id: "ist", label: "India Standard Time (IST) UTC+05:30" },
    { id: "bst", label: "Bangladesh Standard Time (BST) UTC+06:00" },
    { id: "ict", label: "Indochina Time (ICT) UTC+07:00" },
    { id: "cst-cn", label: "China Standard Time (CST) UTC+08:00" },
    { id: "jst", label: "Japan Standard Time (JST) UTC+09:00" },
    { id: "aest", label: "Australian Eastern Time (AEST) UTC+10:00" },
    { id: "nzt", label: "New Zealand Standard Time (NZST) UTC+12:00" }
  ]
  const dateFormatOptions = [
    { id: "ddmm", label: "31/12/2026 (DD/MM/YYYY)" },
    { id: "mmdd", label: "12/31/2026 (MM/DD/YYYY)" },
    { id: "yyyymm", label: "2026-12-31 (YYYY-MM-DD)" }
  ]
  const numberFormatOptions = [
    { id: "in", label: "1,00,000.00 (Indian)" },
    { id: "us", label: "100,000.00 (International)" },
    { id: "eu", label: "100.000,00 (European)" }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <SettingsPage title="General" onBack={onBack}>
      
      {/* MFA Setup Card */}
      <div className="w-full bg-[#111111] border border-[#27272a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2 max-w-lg">
          <h3 className="text-white text-[18px] font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Two-Factor Authentication
          </h3>
          <p className="text-[#a1a1aa] text-[14.5px] leading-relaxed">
            Add an extra layer of security to your account. We recommend setting up MFA using an authenticator app.
          </p>
        </div>
        <Button onClick={() => toast.success("MFA Setup initiated")} className="relative z-10 bg-white text-black font-semibold rounded-xl h-11 px-6 hover:scale-105 transition-transform">
          Set up MFA
        </Button>
      </div>

      <SettingsSection title="Theme" description="Customize how Creonity looks on your device.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Light Theme Option */}
          <button 
            onClick={() => setTheme("light")}
            className={`flex flex-col gap-3 p-1 rounded-3xl border-2 transition-colors text-left ${theme === "light" ? "border-[#0a0a0a] dark:border-white" : "border-transparent"}`}
          >
            <div className="w-full aspect-[4/3] rounded-2xl border border-[#efefef] bg-[#f4f4f5] overflow-hidden flex flex-col">
              <div className="h-6 border-b border-[#efefef] bg-white flex items-center px-3 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 p-3 flex gap-2">
                <div className="w-1/4 h-full bg-[#efefef] rounded-md" />
                <div className="w-3/4 h-full bg-white rounded-md border border-[#efefef] flex flex-col gap-2 p-2">
                  <div className="w-1/2 h-2 bg-[#efefef] rounded-full" />
                  <div className="w-full h-10 bg-[#f4f4f5] rounded-md mt-auto" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 pb-1">
              <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${theme === "light" ? "border-[#0a0a0a] dark:border-white bg-[#0a0a0a] dark:bg-white" : "border-[#e4e4e7] dark:border-[#27272a]"}`} />
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white flex items-center gap-1.5"><Sun className="w-4 h-4" /> Light</span>
            </div>
          </button>

          {/* Dark Theme Option */}
          <button 
            onClick={() => setTheme("dark")}
            className={`flex flex-col gap-3 p-1 rounded-3xl border-2 transition-colors text-left ${theme === "dark" ? "border-[#0a0a0a] dark:border-white" : "border-transparent"}`}
          >
            <div className="w-full aspect-[4/3] rounded-2xl border border-[#27272a] bg-[#0a0a0a] overflow-hidden flex flex-col">
              <div className="h-6 border-b border-[#27272a] bg-[#111111] flex items-center px-3 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#27272a]" />
                <div className="w-2 h-2 rounded-full bg-[#27272a]" />
                <div className="w-2 h-2 rounded-full bg-[#27272a]" />
              </div>
              <div className="flex-1 p-3 flex gap-2">
                <div className="w-1/4 h-full bg-[#1f1f1f] rounded-md" />
                <div className="w-3/4 h-full bg-[#111111] rounded-md border border-[#27272a] flex flex-col gap-2 p-2">
                  <div className="w-1/2 h-2 bg-[#27272a] rounded-full" />
                  <div className="w-full h-10 bg-[#1f1f1f] rounded-md mt-auto" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 pb-1">
              <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${theme === "dark" ? "border-[#0a0a0a] dark:border-white bg-[#0a0a0a] dark:bg-white" : "border-[#e4e4e7] dark:border-[#27272a]"}`} />
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white flex items-center gap-1.5"><Moon className="w-4 h-4" /> Dark</span>
            </div>
          </button>

          {/* System Theme Option */}
          <button 
            onClick={() => setTheme("system")}
            className={`flex flex-col gap-3 p-1 rounded-3xl border-2 transition-colors text-left ${theme === "system" ? "border-[#0a0a0a] dark:border-white" : "border-transparent"}`}
          >
            <div className="w-full aspect-[4/3] rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#0a0a0a] overflow-hidden flex">
              <div className="w-1/2 h-full bg-[#f4f4f5] flex flex-col">
                <div className="h-6 border-b border-[#efefef] bg-white flex items-center px-3 gap-1.5" />
                <div className="flex-1 p-3 pr-1.5 flex gap-2">
                  <div className="w-full h-full bg-white rounded-md border border-[#efefef] flex flex-col gap-2 p-2">
                    <div className="w-1/2 h-2 bg-[#efefef] rounded-full" />
                  </div>
                </div>
              </div>
              <div className="w-1/2 h-full bg-[#0a0a0a] flex flex-col border-l border-[#27272a]">
                <div className="h-6 border-b border-[#27272a] bg-[#111111] flex items-center px-3 gap-1.5" />
                <div className="flex-1 p-3 pl-1.5 flex gap-2">
                  <div className="w-full h-full bg-[#111111] rounded-md border border-[#27272a] flex flex-col gap-2 p-2">
                    <div className="w-1/2 h-2 bg-[#27272a] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 pb-1">
              <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${theme === "system" ? "border-[#0a0a0a] dark:border-white bg-[#0a0a0a] dark:bg-white" : "border-[#e4e4e7] dark:border-[#27272a]"}`} />
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white flex items-center gap-1.5"><Icon icon="ph:desktop" className="w-4 h-4" /> System</span>
            </div>
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Display Settings">
        <SettingsCard className="flex flex-col p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Sidebar Density</span>
            <div className="shrink-0 ml-4 flex items-center">
              <DropdownSelect value={sidebarDensity} options={sidebarDensityOptions} onChange={setSidebarDensity} minWidth="140px" />
            </div>
          </div>
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Animations</span>
            <div className="shrink-0 ml-4 flex items-center">
              <div className="flex w-full items-center overflow-hidden rounded-[14px] border border-[#efefef] bg-[#f4f4f5] p-1 dark:border-[#27272a] dark:bg-[#111111] sm:w-auto sm:shrink-0">
                {[
                  { id: "low", label: "Low" },
                  { id: "medium", label: "Medium" },
                  { id: "high", label: "High" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAnimations(opt.id)}
                    className={`flex h-[32px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-4 text-[13px] font-medium transition-all sm:flex-none ${animations === opt.id ? "bg-white text-[#0a0a0a] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-[#27272a] dark:text-white" : "text-[#737373] hover:text-[#0a0a0a] dark:text-[#a1a1aa] dark:hover:text-white"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Localization">
        <SettingsCard className="flex flex-col p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Display Language</span>
            <div className="shrink-0 ml-4">
              <DropdownSelect value={language} options={languageOptions} onChange={setLanguage} minWidth="280px" />
            </div>
          </div>
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Timezone</span>
            <div className="shrink-0 ml-4">
              <DropdownSelect value={timezone} options={timezoneOptions} onChange={setTimezone} minWidth="280px" />
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Date & Number Formats">
        <SettingsCard className="flex flex-col p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Date Format</span>
            <div className="shrink-0 ml-4">
              <DropdownSelect value={dateFormat} options={dateFormatOptions} onChange={setDateFormat} minWidth="280px" />
            </div>
          </div>
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Number Format</span>
            <div className="shrink-0 ml-4">
              <DropdownSelect value={numberFormat} options={numberFormatOptions} onChange={setNumberFormat} minWidth="280px" />
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

    </SettingsPage>
  )
}
