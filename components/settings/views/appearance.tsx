"use client"

import { Icon } from "@iconify/react"
import { Switch, Slider, Label } from "@heroui/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function AppearanceView({ onBack }: { onBack?: () => void }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [contrast, setContrast] = useState(45)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="mx-auto max-w-5xl pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <Icon icon="gravity-ui:chevron-left" className="size-5 text-[#0a0a0a] dark:text-white" />
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">Appearance</h1>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="flex flex-col gap-10">
        
        {/* Theme Previews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* System */}
          <div className="flex flex-col gap-4 items-center">
            <button onClick={() => setTheme("system")} className={`w-full aspect-[4/3] rounded-[24px] overflow-hidden border-[3px] transition-all ${theme === "system" || !theme ? "border-[#0a0a0a] dark:border-white" : "border-transparent"} flex`}>
              <div className="w-1/2 h-full bg-[#f4f4f5] border-r border-[#e4e4e7] p-5 flex flex-col gap-4">
                 <div className="w-1/2 h-2.5 bg-[#d4d4d8] rounded-full mx-auto" />
                 <div className="w-full h-full bg-white rounded-xl border border-[#e4e4e7] p-3 flex flex-col gap-3">
                   <div className="w-full h-2 bg-[#f4f4f5] rounded-full" />
                   <div className="w-3/4 h-2 bg-[#f4f4f5] rounded-full" />
                   <div className="w-full h-2 bg-[#f4f4f5] rounded-full mt-3" />
                 </div>
              </div>
              <div className="w-1/2 h-full bg-[#18181b] p-5 flex flex-col gap-4">
                 <div className="w-1/2 h-2.5 bg-[#3f3f46] rounded-full mx-auto" />
                 <div className="w-full h-full bg-[#27272a] rounded-xl border border-[#3f3f46] p-3 flex flex-col gap-3">
                   <div className="w-full h-2 bg-[#3f3f46] rounded-full" />
                   <div className="w-3/4 h-2 bg-[#3f3f46] rounded-full" />
                   <div className="w-full h-2 bg-[#3f3f46] rounded-full mt-3" />
                 </div>
              </div>
            </button>
            <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-white">System</span>
          </div>

          {/* Light */}
          <div className="flex flex-col gap-4 items-center">
            <button onClick={() => setTheme("light")} className={`w-full aspect-[4/3] rounded-[24px] overflow-hidden border-[3px] transition-all ${theme === "light" ? "border-[#0a0a0a] dark:border-white" : "border-transparent"}`}>
              <div className="w-full h-full bg-[#f4f4f5] p-5 flex flex-col gap-4">
                 <div className="w-1/3 h-2.5 bg-[#d4d4d8] rounded-full mx-auto" />
                 <div className="w-full h-full bg-white rounded-xl border border-[#e4e4e7] p-5 flex flex-col gap-4">
                   <div className="w-full h-3 bg-[#f4f4f5] rounded-full" />
                   <div className="w-2/3 h-3 bg-[#f4f4f5] rounded-full" />
                   <div className="w-3/4 h-3 bg-[#f4f4f5] rounded-full mt-4" />
                 </div>
              </div>
            </button>
            <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-white">Light</span>
          </div>

          {/* Dark */}
          <div className="flex flex-col gap-4 items-center">
            <button onClick={() => setTheme("dark")} className={`w-full aspect-[4/3] rounded-[24px] overflow-hidden border-[3px] transition-all ${theme === "dark" ? "border-[#0a0a0a] dark:border-white" : "border-transparent"}`}>
              <div className="w-full h-full bg-[#18181b] p-5 flex flex-col gap-4">
                 <div className="w-1/3 h-2.5 bg-[#3f3f46] rounded-full mx-auto" />
                 <div className="w-full h-full bg-[#27272a] rounded-xl border border-[#3f3f46] p-5 flex flex-col gap-4">
                   <div className="w-full h-3 bg-[#3f3f46] rounded-full" />
                   <div className="w-2/3 h-3 bg-[#3f3f46] rounded-full" />
                   <div className="w-3/4 h-3 bg-[#3f3f46] rounded-full mt-4" />
                 </div>
              </div>
            </button>
            <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-white">Dark</span>
          </div>
        </div>

        {/* Settings List */}
        <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
          
          {/* Font */}
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Font</span>
            <button className="w-[140px] h-10 px-3 bg-transparent border border-[#e4e4e7] dark:border-[#27272a] hover:bg-[#e4e4e7]/50 dark:hover:bg-[#27272a]/50 rounded-xl text-[14px] font-medium text-[#0a0a0a] dark:text-white flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-white dark:bg-black border border-[#e4e4e7] dark:border-[#27272a] rounded-md text-[12px] font-bold">Aa</span>
                Inter
              </div>
              <Icon icon="gravity-ui:chevron-down" className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Accent */}
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Accent</span>
            <div className="w-[140px] h-10 px-4 bg-[#339CFF] rounded-xl text-[14px] font-medium text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-[#2b88e6] transition-colors">
              <div className="w-2.5 h-2.5 rounded-full border border-white/40 bg-[#5cafff]" />
              #339CFF
            </div>
          </div>

          {/* Contrast */}
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Contrast</span>
            <div className="flex flex-col items-end justify-center w-[140px] gap-1.5 mt-2">
              <span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa] leading-none">{contrast}</span>
              <div className="relative w-full h-[18px] bg-[#e4e4e7] dark:bg-[#27272a] rounded-full">
                <div 
                  className="absolute left-0 top-0 h-full bg-[#339CFF] rounded-full pointer-events-none"
                  style={{ width: `calc(${contrast}% - ${contrast * 18 / 100}px + 18px)` }}
                >
                  <div className="absolute right-[2px] top-[2px] w-[14px] h-[14px] bg-white rounded-full" />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={contrast} 
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 p-0"
                />
              </div>
            </div>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Reduce motion</span>
            <div className="w-[140px] flex justify-end pr-2">
              <Switch defaultSelected={false} size="sm" classNames={{ wrapper: "bg-[#e4e4e7] dark:bg-[#27272a]" }} />
            </div>
          </div>

          {/* Sidebar Density */}
          <div className="flex items-center justify-between px-6 h-[72px]">
            <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Sidebar density</span>
            <button className="w-[140px] h-10 px-4 bg-transparent border border-[#e4e4e7] dark:border-[#27272a] hover:bg-[#e4e4e7]/50 dark:hover:bg-[#27272a]/50 rounded-xl text-[14px] font-medium text-[#0a0a0a] dark:text-white flex items-center justify-between transition-colors">
              Comfortable
              <Icon icon="gravity-ui:chevron-down" className="w-4 h-4 opacity-50" />
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
