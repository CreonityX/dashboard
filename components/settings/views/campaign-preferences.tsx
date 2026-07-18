"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Button, Switch, Dropdown } from "@heroui/react"

const DropdownSelect = ({ value, options, onChange }: any) => {
  const selected = options.find((o: any) => o.id === value) || options[0]
  return (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <button type="button" className="flex items-center justify-between shrink-0 bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-xl h-10 pl-4 pr-3 text-[14px] font-medium text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer min-w-[160px] outline-none">
          {selected.label}
          <Icon icon="gravity-ui:chevron-down" className="size-4 text-[#a1a1aa] ml-2 shrink-0" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-[160px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]">
        <Dropdown.Menu 
          aria-label="Options" 
          className="p-1"
          onAction={(key) => onChange(key as string)}
        >
          {options.map((opt: any) => (
            <Dropdown.Item key={opt.id} textValue={opt.label} className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
              <span className="font-medium text-[13px] text-[#0a0a0a] dark:text-white">{opt.label}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export function CampaignPreferencesView({ onBack }: { onBack?: () => void }) {
  const [category, setCategory] = useState("lifestyle")
  const [priceFloor, setPriceFloor] = useState("5000")
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(["ig", "yt"]))
  const [rounds, setRounds] = useState("1")
  const [usage, setUsage] = useState("30")
  const [responseTime, setResponseTime] = useState("24")
  const [responseTimeUnit, setResponseTimeUnit] = useState("hours")
  const [duration, setDuration] = useState("30")
  const [durationUnit, setDurationUnit] = useState("mins")

  const categories = [
    { id: "tech", label: "Technology" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "fashion", label: "Fashion & Beauty" },
    { id: "gaming", label: "Gaming" }
  ]
  const prices = [
    { id: "0", label: "Any Budget" },
    { id: "1000", label: "₹1,000+" },
    { id: "5000", label: "₹5,000+" },
    { id: "20000", label: "₹20,000+" }
  ]
  const platforms = [
    { id: "ig", label: "Instagram" },
    { id: "tk", label: "TikTok" },
    { id: "yt", label: "YouTube" }
  ]

  const getPlatformText = () => {
    if (selectedPlatforms.size === 0) return "None"
    if (selectedPlatforms.size === platforms.length) return "All Platforms"
    return Array.from(selectedPlatforms).map(key => platforms.find(p => p.id === key)?.label).join(', ')
  }

  const renderCheckbox = (key: string) => (
    <div className={`flex items-center justify-center w-[20px] h-[20px] shrink-0 rounded-[6px] transition-colors border ${selectedPlatforms.has(key) ? 'bg-[#007AFF] border-[#007AFF]' : 'bg-transparent border-[#e4e4e7] dark:border-[#3f3f46]'}`}>
      {selectedPlatforms.has(key) && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px] text-white">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  )
  const revisionRounds = [
    { id: "0", label: "0 Rounds (As-Is)" },
    { id: "1", label: "1 Round" },
    { id: "2", label: "2 Rounds" },
    { id: "unlimited", label: "Unlimited" }
  ]
  const usageRights = [
    { id: "none", label: "No Usage Rights" },
    { id: "30", label: "30 Days Digital" },
    { id: "90", label: "90 Days Digital" },
    { id: "perpetual", label: "Perpetual" }
  ]
  const responseTimes = [
    { id: "1", label: "Within 1 Hour" },
    { id: "12", label: "Within 12 Hours" },
    { id: "24", label: "Within 24 Hours" }
  ]
  const durations = [
    { id: "15", label: "15 minutes" },
    { id: "30", label: "30 minutes" },
    { id: "60", label: "60 minutes" }
  ]

  return (
    <div className="mx-auto max-w-5xl pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <Icon icon="gravity-ui:chevron-left" className="size-5 text-[#0a0a0a] dark:text-white" />
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">Campaign Preferences</h1>
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
        
        {/* DISCOVER & MATCHING */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Discover & Matching</h3>
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Primary Content Category</span>
              </div>
              <div className="shrink-0 ml-4">
                <DropdownSelect value={category} options={categories} onChange={setCategory} />
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Auto-Decline Price Floor</span>
              </div>
              <div className="flex flex-col items-end justify-center w-[160px] gap-1.5 mt-1 shrink-0">
                <span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa] leading-none">{priceFloor === "0" ? "Any Budget" : `₹${Number(priceFloor).toLocaleString()}+`}</span>
                <div className="relative w-full h-[18px] bg-[#e4e4e7] dark:bg-[#27272a] rounded-full">
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#339CFF] rounded-full pointer-events-none"
                    style={{ width: `calc(${(Number(priceFloor) / 50000) * 100}% - ${(Number(priceFloor) / 50000) * 18}px + 18px)` }}
                  >
                    <div className="absolute right-[2px] top-[2px] w-[14px] h-[14px] bg-white rounded-full" />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    step="1000"
                    value={priceFloor} 
                    onChange={(e) => setPriceFloor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 p-0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Preferred Platform</span>
              </div>
              <div className="shrink-0 ml-4">
                <Dropdown placement="bottom-end">
                  <Dropdown.Trigger>
                    <button className="flex items-center justify-between shrink-0 bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-xl h-10 pl-4 pr-3 text-[14px] font-medium text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer min-w-[160px] max-w-[200px]">
                      <span className="truncate pr-2">{getPlatformText()}</span>
                      <Icon icon="gravity-ui:chevron-down" className="size-4 text-[#a1a1aa] shrink-0" />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Popover className="min-w-[200px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]">
                    <Dropdown.Menu 
                      className="p-1" 
                      selectionMode="multiple" 
                      selectedKeys={selectedPlatforms as any}
                      onSelectionChange={(keys) => setSelectedPlatforms(keys as Set<string>)}
                    >
                      {platforms.map(p => (
                        <Dropdown.Item key={p.id} textValue={p.label} className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">{p.label}</span>
                            {renderCheckbox(p.id)}
                          </div>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            </div>

          </div>
        </div>

        {/* BIDDING DEFAULTS */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Bidding Defaults</h3>
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            
            <div className="flex flex-col px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-3">
              <div className="flex flex-col gap-0.5 min-w-0 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Default Pitch Template</span>
              </div>
              <textarea
                defaultValue="Hi there! I absolutely love what your brand is doing. My audience of highly engaged followers would be a perfect fit for this campaign..."
                className="w-full min-h-[104px] p-3 text-[13.5px] font-medium text-[#0a0a0a] dark:text-white bg-transparent border border-[#e4e4e7] dark:border-[#27272a] rounded-xl outline-none resize-y hover:border-[#d4d4d8] focus:border-[#0a0a0a] dark:hover:border-[#3f3f46] dark:focus:border-white transition-colors"
                placeholder="Write your default cover letter..."
              />
            </div>

            <div className="flex flex-col px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-3">
              <div className="flex flex-col gap-0.5 min-w-0 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Standard Deliverables Package</span>
              </div>
              <textarea
                defaultValue="- 1x Instagram Reel (15-30s)&#10;- 2x Instagram Stories with Link"
                className="w-full min-h-[104px] p-3 text-[13.5px] font-mono font-medium text-[#0a0a0a] dark:text-white bg-transparent border border-[#e4e4e7] dark:border-[#27272a] rounded-xl outline-none resize-y hover:border-[#d4d4d8] focus:border-[#0a0a0a] dark:hover:border-[#3f3f46] dark:focus:border-white transition-colors"
                placeholder="List your standard deliverables..."
              />
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Default Revision Rounds</span>
              </div>
              <div className="shrink-0 ml-4">
                <div className="flex items-center justify-between w-[140px] h-[48px] px-4 border border-[#e4e4e7] dark:border-[#27272a] bg-transparent rounded-2xl focus-within:border-[#0a0a0a] dark:focus-within:border-white transition-colors">
                  <input 
                    type="text" 
                    value={rounds} 
                    onChange={(e) => setRounds(e.target.value)}
                    className="w-full bg-transparent outline-none text-[16px] font-medium text-[#0a0a0a] dark:text-white"
                  />
                  <span className="text-[14px] text-[#737373] dark:text-[#a1a1aa] ml-2 shrink-0 pointer-events-none">rounds</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Default Usage Rights Ask</span>
              </div>
              <div className="shrink-0 ml-4">
                <div className="flex items-center justify-between w-[140px] h-[48px] px-4 border border-[#e4e4e7] dark:border-[#27272a] bg-transparent rounded-2xl focus-within:border-[#0a0a0a] dark:focus-within:border-white transition-colors">
                  <input 
                    type="text" 
                    value={usage} 
                    onChange={(e) => setUsage(e.target.value)}
                    className="w-full bg-transparent outline-none text-[16px] font-medium text-[#0a0a0a] dark:text-white"
                  />
                  <span className="text-[14px] text-[#737373] dark:text-[#a1a1aa] ml-2 shrink-0 pointer-events-none">days</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOOKING & AVAILABILITY */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Booking & Availability</h3>
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Expected Response Time</span>
              </div>
              <div className="shrink-0 ml-4">
                <div className="flex items-center justify-between w-[150px] h-[48px] px-3 border border-[#e4e4e7] dark:border-[#27272a] bg-transparent rounded-2xl focus-within:border-[#0a0a0a] dark:focus-within:border-white transition-colors">
                  <input 
                    type="text" 
                    value={responseTime} 
                    onChange={(e) => setResponseTime(e.target.value)}
                    className="w-full bg-transparent outline-none text-[16px] font-medium text-[#0a0a0a] dark:text-white px-1"
                  />
                  <button 
                    onClick={() => setResponseTimeUnit(prev => prev === "hours" ? "mins" : "hours")}
                    className="flex items-center justify-center h-7 px-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa] transition-colors ml-2 shrink-0 select-none"
                  >
                    {responseTimeUnit === "hours" ? (responseTime === "1" ? "hr" : "hrs") : "min"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Default Meeting Duration</span>
              </div>
              <div className="shrink-0 ml-4">
                <div className="flex items-center justify-between w-[150px] h-[48px] px-3 border border-[#e4e4e7] dark:border-[#27272a] bg-transparent rounded-2xl focus-within:border-[#0a0a0a] dark:focus-within:border-white transition-colors">
                  <input 
                    type="text" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-transparent outline-none text-[16px] font-medium text-[#0a0a0a] dark:text-white px-1"
                  />
                  <button 
                    onClick={() => setDurationUnit(prev => prev === "hours" ? "mins" : "hours")}
                    className="flex items-center justify-center h-7 px-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa] transition-colors ml-2 shrink-0 select-none"
                  >
                    {durationUnit === "hours" ? (duration === "1" ? "hr" : "hrs") : "min"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-3">
              <div className="flex flex-col gap-0.5 min-w-0 justify-center">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Blackout Dates</span>
              </div>
              <textarea
                placeholder="List dates you are unavailable..."
                className="w-full min-h-[80px] p-3 text-[13.5px] font-medium text-[#0a0a0a] dark:text-white bg-transparent border border-[#e4e4e7] dark:border-[#27272a] rounded-xl outline-none resize-y hover:border-[#d4d4d8] focus:border-[#0a0a0a] dark:hover:border-[#3f3f46] dark:focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                  <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Auto-Reply (Outside Active Hours)</span>
                </div>
                <div className="shrink-0 ml-4">
                  <Switch defaultSelected color="success" size="sm" />
                </div>
              </div>
              <div className="px-6 pb-4">
                <textarea
                  defaultValue="Thanks for reaching out! I'm currently offline but will get back to you soon."
                  className="w-full min-h-[80px] p-3 text-[13.5px] text-[#0a0a0a] dark:text-white bg-white dark:bg-[#0a0a0a] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl outline-none resize-y hover:border-[#d4d4d8] focus:border-[#0a0a0a] dark:hover:border-[#3f3f46] dark:focus:border-white transition-colors"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
