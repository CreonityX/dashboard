"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { AgendaContext, AgendaState } from "./agenda-context"

interface AgendaProps extends AgendaState {
  children: React.ReactNode
  className?: string
}

export function Agenda({ children, className, ...props }: AgendaProps) {
  return (
    <AgendaContext.Provider value={props}>
      <div className={cn("flex flex-col h-full bg-white dark:bg-[#0a0a0a] overflow-hidden", className)}>
        {children}
      </div>
    </AgendaContext.Provider>
  )
}
