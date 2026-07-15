"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomCalendarProps {
  value?: string // "YYYY-MM-DD"
  onChange?: (val: string) => void
  className?: string
}

export function CustomCalendar({ value, onChange, className }: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const [y, m, d] = value.split("-").map(Number)
      return new Date(y, m - 1, d)
    }
    return new Date()
  })

  // Sync with value prop if it changes externally
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-").map(Number)
      setCurrentDate(new Date(y, m - 1, d))
    }
  }, [value])

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  // Current today reference for highlighting
  const todayObj = new Date()
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`

  return (
    <div className={cn("w-full min-w-[260px] max-w-[320px] select-none p-2", className)}>
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">
          {monthName} {year}
        </h2>
        <div className="flex gap-1">
          <button 
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#0a0a0a] dark:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#0a0a0a] dark:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-[12px] font-bold text-[#737373] dark:text-[#a1a1aa]">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />
          
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isSelected = value === dateStr
          const isToday = todayStr === dateStr

          return (
            <div key={i} className="flex justify-center items-center h-9">
              <button
                type="button"
                onClick={() => onChange?.(dateStr)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full text-[14px] font-medium transition-all",
                  isSelected 
                    ? "bg-black text-white dark:bg-white dark:text-[#0a0a0a] font-bold shadow-md scale-110" 
                    : "text-[#0a0a0a] dark:text-[#e4e4e7] hover:bg-black/5 dark:hover:bg-white/10",
                  isToday && !isSelected && "bg-[#f4f4f5] dark:bg-[#27272a] text-black dark:text-white font-bold"
                )}
              >
                {d}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
