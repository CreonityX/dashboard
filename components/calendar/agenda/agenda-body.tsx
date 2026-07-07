"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function AgendaBody({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 overflow-hidden flex flex-col relative", className)}>
      {children}
    </div>
  )
}
