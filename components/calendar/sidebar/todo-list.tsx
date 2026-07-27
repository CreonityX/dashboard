"use client"

import React, { useState } from "react"
import { CalendarEvent, formatDisplayDate } from "@/lib/calendar-data"
import { cn } from "@/lib/utils"
import { ChevronDown, Clock, AlignLeft, Bell, Pencil, Trash2, ChevronLeft } from "lucide-react"
import { Typography } from "@heroui/react"
import { toast } from "sonner"

export function TodoList({ isMobileFullScreen, onClose, initialTasks = [], onComplete }: { isMobileFullScreen?: boolean, onClose?: () => void, initialTasks?: CalendarEvent[], onComplete?: (id: string) => void }) {
  // Initialize from calendarEvents for demo purposes
  const [tasks, setTasks] = useState<CalendarEvent[]>(
    initialTasks.filter(e => e.type === "personal" && !e.completed)
  )
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => 
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    )
    
    // Check if we are marking it as complete
    const isNowCompleted = !tasks.find(t => t.id === id)?.completed
    if (isNowCompleted) {
      toast.success("Task completed")
      onComplete?.(id)
    }

    // In a real app, we'd wait for a bit to show the animation, then remove it
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== id))
    }, 1000)
  }

  if (tasks.length === 0) return null

  return (
    <div className={cn("flex flex-col h-full min-h-0", isMobileFullScreen ? "w-full" : "mt-4 -mx-4")}>
      <div className={cn("overflow-hidden flex flex-col flex-1", !isMobileFullScreen && "bg-white dark:bg-[#0a0a0a] rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#efefef] dark:border-[#27272a]")}>
        
        {/* Header inside the box */}
        {!isMobileFullScreen && (
          <div className="flex items-center justify-between shrink-0 px-4 pt-4 pb-2 border-b border-[#efefef] dark:border-[#27272a]">
            <Typography type="h6" className="font-semibold text-[#0a0a0a] dark:text-white">To-do</Typography>
            <Typography type="body-xs" className="font-medium text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
              {tasks.length}
            </Typography>
          </div>
        )}
        
        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {tasks.map((task) => {
            const isExpanded = expandedTaskId === task.id
            const isCompleted = task.completed

            return (
              <div
                key={task.id}
                className={cn(
                  "w-full flex flex-col transition-all duration-300 overflow-hidden",
                  isExpanded ? "bg-gray-50/50 dark:bg-white/[0.02]" : "hover:bg-gray-50/50 dark:hover:bg-white/[0.02] cursor-pointer",
                  isCompleted && "opacity-50"
                )}
              >
                {/* Collapsed Row */}
                <div className="flex items-center w-full min-h-[48px] px-4 py-2 group border-b border-transparent hover:border-[#f4f4f5] dark:hover:border-white/5" onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}>
                  
                  {/* Checkbox */}
                  <div 
                    className="w-[22px] shrink-0 flex items-center justify-center mr-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTaskComplete(task.id)
                    }}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-[4px] border transition-colors flex items-center justify-center cursor-pointer",
                      isCompleted 
                        ? "bg-[#3897f0] border-[#3897f0]" 
                        : "border-gray-300 dark:border-gray-600 group-hover:border-[#3897f0]"
                    )}>
                      {isCompleted && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0 pr-2">
                    <Typography type="body-sm" className={cn(
                      "font-medium text-[#0a0a0a] dark:text-white truncate block transition-all",
                      isCompleted && "line-through text-gray-400 dark:text-gray-500"
                    )}>
                      {task.title}
                    </Typography>
                  </div>

                  {/* Chevron */}
                  <div className="w-5 shrink-0 flex items-center justify-center">
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-300 text-gray-400",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="flex flex-col w-full px-4 pb-4 pt-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    
                    {/* Due Date */}
                    <div className="flex items-center gap-3 py-1.5 mt-1">
                      <Clock className="size-4 text-gray-400 shrink-0" />
                      <Typography type="body-sm" className="text-gray-600 dark:text-gray-300">
                        {formatDisplayDate(task.date)} {task.startTime ? `at ${task.startTime}` : ""}
                      </Typography>
                    </div>

                    {/* Reminder */}
                    {task.reminder && (
                      <div className="flex items-center gap-3 py-1.5">
                        <Bell className="size-4 text-gray-400 shrink-0" />
                        <Typography type="body-sm" className="text-gray-600 dark:text-gray-300">
                          {task.reminder}
                        </Typography>
                      </div>
                    )}

                    {/* Description */}
                    {task.description && (
                      <div className="flex items-start gap-3 py-1.5 mt-1">
                        <AlignLeft className="size-4 text-gray-400 shrink-0 mt-0.5" />
                        <Typography type="body-sm" className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {task.description}
                        </Typography>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 ml-7">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors text-[12px] font-medium">
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors text-[12px] font-medium">
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
