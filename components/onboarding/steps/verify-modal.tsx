import { ReactNode } from "react"
import { Icon } from "@iconify/react"
import { Button } from "@heroui/react"

export function OTPInput({ length = 6 }: { length?: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-[20px] font-bold bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] focus:border-[#0a0a0a] dark:focus:border-white rounded-xl outline-none transition-colors text-[#0a0a0a] dark:text-white"
        />
      ))}
    </div>
  )
}

export function VerifyModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onVerify,
  primaryActionText = "Verify",
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: ReactNode; 
  onVerify: () => void;
  primaryActionText?: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c1c] border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-2xl w-full max-w-[480px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#2a2a2a] text-[#52525b] dark:text-[#a1a1aa] transition-colors">
            <Icon icon="ph:x" className="size-5" />
          </button>
        </div>
        <div className="px-6 pb-6 pt-2 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <Button variant="flat" onClick={onClose} className="font-medium bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#0a0a0a] dark:text-white rounded-full">Cancel</Button>
          <Button onClick={onVerify} className="font-medium rounded-full px-6 bg-[#0a0a0a] hover:bg-black/80 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black">{primaryActionText}</Button>
        </div>
      </div>
    </div>
  )
}
