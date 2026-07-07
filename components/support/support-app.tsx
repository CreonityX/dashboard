"use client"

import { useRouter } from "next/navigation"
import { SupportSidebar } from "./support-sidebar"
import { SupportContent } from "./support-content"

export function SupportApp({ initialActiveId }: { initialActiveId: string }) {
  const router = useRouter()
  const activeId = initialActiveId

  const handleNavigate = (id: string) => {
    if (id) {
      router.push(`/support/${id}`)
    } else {
      router.push("/support")
    }
  }

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#0a0a0a]">
      {/* Sidebar: Hidden on mobile when a view is selected, unless we implement mobile stack routing. 
          For now, just standard responsive split (side by side on lg, full width toggle on mobile if needed) 
          To match Instagram: on mobile, picking an item pushes the view. Since we don't have a complex mobile router set up right now, 
          let's just show side-by-side on lg+ and maybe a basic toggle on small screens. 
          Actually, Instagram shows the sidebar as the main view on mobile, and clicking an item opens the content view.
          We can simulate that with state. */}
          
      <div className={`h-full w-full lg:w-auto lg:shrink-0 ${activeId ? 'hidden lg:block' : 'block'}`}>
        <SupportSidebar activeId={activeId} onSelect={handleNavigate} />
      </div>
      
      <div className={`h-full w-full flex-1 bg-white dark:bg-[#0a0a0a] flex flex-col ${!activeId ? 'hidden lg:block' : 'block'}`}>
        <SupportContent activeId={activeId} onBack={() => handleNavigate("")} onNavigate={handleNavigate} />
      </div>
    </div>
  )
}
