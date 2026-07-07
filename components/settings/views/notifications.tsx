import { useState } from "react"
import { Icon } from "@iconify/react"
import { Dropdown } from "@heroui/react"
import { toast } from "sonner"

const NOTIFICATION_SETTINGS = [
  {
    category: "Campaigns",
    items: [
      { id: "camp-new", label: "New campaign matches", defaultMethods: ["push", "email"] },
      { id: "camp-deadline", label: "Campaign deadline reminders", defaultMethods: ["email"] },
      { id: "camp-bid", label: "Bid status updates", defaultMethods: ["push"] },
    ]
  },
  {
    category: "Messages",
    items: [
      { id: "msg-dm", label: "Brand direct messages", defaultMethods: ["push", "email"] },
      { id: "msg-nego", label: "Negotiation replies", defaultMethods: ["whatsapp"] },
      { id: "msg-sys", label: "System announcements", defaultMethods: ["push"] },
    ]
  },
  {
    category: "Payments",
    items: [
      { id: "pay-recv", label: "Payment received", defaultMethods: ["sms", "email"], hasSms: true },
      { id: "pay-out", label: "Payout successful", defaultMethods: ["email"], hasSms: true },
      { id: "pay-inv", label: "New invoice generated", defaultMethods: ["email"], hasSms: true },
    ]
  },
  {
    category: "Support",
    items: [
      { id: "sup-tkt", label: "Ticket updates", defaultMethods: ["whatsapp"], hasSms: true },
      { id: "sup-res", label: "Resolution provided", defaultMethods: ["sms"], hasSms: true },
    ]
  },
  {
    category: "Marketing",
    items: [
      { id: "mkt-news", label: "Weekly newsletter", defaultMethods: ["email"] },
      { id: "mkt-prod", label: "Product updates", defaultMethods: ["email"] },
    ]
  }
]

function NotificationDropdown({ defaultMethods, hasSms }: { defaultMethods: string[], hasSms?: boolean }) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(defaultMethods))

  const getDisplayText = () => {
    if (selectedKeys.size === 0) return "None"
    
    return Array.from(selectedKeys).map(key => {
      if (key === "sms") return "SMS"
      if (key === "whatsapp") return "WhatsApp"
      return key.charAt(0).toUpperCase() + key.slice(1)
    }).join(', ')
  }

  const renderCheckbox = (key: string) => (
    <div className={`flex items-center justify-center w-[20px] h-[20px] shrink-0 rounded-[6px] transition-colors border ${selectedKeys.has(key) ? 'bg-[#007AFF] border-[#007AFF]' : 'bg-transparent border-[#e4e4e7] dark:border-[#3f3f46]'}`}>
      {selectedKeys.has(key) && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px] text-white">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  )

  return (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <button className="relative w-[240px] h-10 px-4 bg-transparent border border-[#e4e4e7] dark:border-[#27272a] hover:bg-[#e4e4e7]/50 dark:hover:bg-[#27272a]/50 rounded-xl text-[14px] font-medium text-[#0a0a0a] dark:text-white transition-colors cursor-pointer outline-none flex items-center justify-between">
          <span className="truncate pr-4 text-left w-full">{getDisplayText()}</span>
          <Icon icon="gravity-ui:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-[240px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]">
        <Dropdown.Menu 
          className="p-1" 
          selectionMode="multiple" 
          selectedKeys={selectedKeys as any}
          onSelectionChange={(keys) => {
            setSelectedKeys(keys as Set<string>);
            toast.success("Notification preferences updated");
          }}
        >
          <Dropdown.Item id="push" textValue="Push" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Push</span>
              {renderCheckbox("push")}
            </div>
          </Dropdown.Item>
          
          <Dropdown.Item id="email" textValue="Email" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Email</span>
              {renderCheckbox("email")}
            </div>
          </Dropdown.Item>

          <Dropdown.Item id="whatsapp" textValue="WhatsApp" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">WhatsApp</span>
              {renderCheckbox("whatsapp")}
            </div>
          </Dropdown.Item>

          {hasSms && (
            <Dropdown.Item id="sms" textValue="SMS" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">SMS</span>
                {renderCheckbox("sms")}
              </div>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export function NotificationsView({ onBack }: { onBack?: () => void }) {
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
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">Notifications</h1>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="flex flex-col gap-10">

        {NOTIFICATION_SETTINGS.map((section) => (
          <div key={section.category} className="flex flex-col gap-4">
            
            {/* Category Title Outside Box */}
            <h3 className="text-[17px] font-bold tracking-tight text-[#0a0a0a] dark:text-white px-1">
              {section.category}
            </h3>
            
            {/* Settings Box */}
            <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0">
                  <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">{item.label}</span>
                  <NotificationDropdown defaultMethods={item.defaultMethods} hasSms={item.hasSms} />
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}
