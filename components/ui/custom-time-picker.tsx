"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CustomTimePickerProps {
  value?: string // "HH:MM" 24hr format
  onChange?: (val: string) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function CustomTimePicker({ value, onChange, disabled, label, className }: CustomTimePickerProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 flex-1", disabled && "opacity-40", className)}>
      {label && <span className="text-[12px] font-bold text-[#737373] dark:text-[#a1a1aa] px-1">{label}</span>}
      <div className={cn(
        "flex items-center px-3 h-9 bg-[#f4f4f5] dark:bg-[#27272a] rounded-[10px] border border-transparent transition-colors",
        !disabled && "hover:bg-[#e4e4e7] dark:hover:bg-[#3f3f46] focus-within:border-black dark:focus-within:border-white focus-within:bg-white dark:focus-within:bg-[#0a0a0a]"
      )}>
        <input 
          type="time" 
          disabled={disabled}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-transparent w-full outline-none text-[14px] font-semibold text-[#0a0a0a] dark:text-white disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}
