"use client"

import { useState, useEffect } from "react"
import { SettingsSidebar } from "./settings-sidebar"
import { SettingsContent } from "./settings-content"

export function SettingsApp({ initialActiveId }: { initialActiveId: string }) {
  const [activeId, setActiveId] = useState(initialActiveId)

  useEffect(() => {
    setActiveId(initialActiveId)
  }, [initialActiveId])

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const parts = path.split('/')
      if (parts[1] === 'settings') {
        setActiveId(parts[2] || "")
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleNavigate = (id: string) => {
    setActiveId(id)
    const url = id ? `/settings/${id}` : "/settings"
    window.history.pushState(null, "", url)
  }

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#0a0a0a]">
      {/* Sidebar: hidden on mobile when a view is selected (unless it's the root 'settings' with empty activeId) 
          But for settings, root means account view, so activeId="" is effectively the account view.
          If we want to show sidebar on mobile, we need a special state or we treat activeId="" as sidebar on mobile.
          Let's treat activeId="" as the sidebar menu on mobile, and any specific ID as the view.
          However, to match support exactly:
          If activeId is empty, we show sidebar on mobile. If activeId has a value, we hide sidebar on mobile.
          On desktop, we always show sidebar.
      */}
      <div className={`h-full w-full lg:w-auto lg:shrink-0 ${activeId ? 'hidden lg:block' : 'block'}`}>
        <SettingsSidebar activeId={activeId} onSelect={handleNavigate} />
      </div>
      
      {/* Content: hidden on mobile when no view selected */}
      <div className={`h-full w-full flex-1 bg-white dark:bg-[#0a0a0a] flex flex-col ${!activeId ? 'hidden lg:block' : 'block'}`}>
        <SettingsContent activeId={activeId} onBack={() => handleNavigate("")} onNavigate={handleNavigate} />
      </div>
    </div>
  )
}
