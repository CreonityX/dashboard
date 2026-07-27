"use client"

import { useState } from "react"
import { Wallet, CheckCircle2, AlertCircle } from "lucide-react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useAccount } from "@/context/account-context"
import { toast } from "sonner"
import type { BrandCreatorPayment } from "./brand-finance-data"

export function BrandPaymentReleaseModal({ 
  payment, 
  isOpen, 
  onClose 
}: { 
  payment: BrandCreatorPayment | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const { brandFinance, releaseCreatorPayment } = useAccount()
  const [useWallet, setUseWallet] = useState(true)
  
  if (!isOpen || !payment) return null

  const selectedMethod = brandFinance.paymentMethods[0]
  const hasEnoughBalance = brandFinance.walletBalance >= payment.amount

  const handleRelease = () => {
    if (useWallet && !hasEnoughBalance) {
      toast.error("Insufficient wallet balance. Please add funds or use another method.")
      return
    }
    
    // Process payment release
    releaseCreatorPayment(payment.id, useWallet ? undefined : selectedMethod.id)
    toast.success(`Payment of ₹${payment.amount.toLocaleString()} released to ${payment.creatorName}`, {
      icon: <CheckCircle2 className="size-5 text-emerald-500" />
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111111] rounded-[24px] p-7 w-full max-w-md relative animate-in zoom-in-95 duration-200 shadow-2xl border border-[#e4e4e7] dark:border-[#27272a]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
        >
          <Icon icon="gravity-ui:xmark" className="w-4 h-4" />
        </button>

        <h3 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white mb-2 flex items-center gap-2">
           Release Payment
        </h3>
        <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] mb-6">
          Approve and release funds for completed work.
        </p>
        
        <div className="flex flex-col gap-5">
          
          {/* Payment Details */}
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-white/5">
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#737373]">Creator</span>
                <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{payment.creatorName}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#737373]">Campaign</span>
                <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{payment.campaignName}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#737373]">Milestone</span>
                <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{payment.milestone}</span>
             </div>
             <div className="w-full h-px bg-[#e4e4e7] dark:bg-[#27272a] my-1" />
             <div className="flex justify-between items-center">
                <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Amount due</span>
                <span className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">₹{payment.amount.toLocaleString()}</span>
             </div>
          </div>

          {/* Source Selection */}
          <div className="flex flex-col gap-2">
             <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Pay from</label>
             <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setUseWallet(true)}
                  className={cn("flex items-center gap-3 p-3.5 rounded-xl border transition-colors text-left", useWallet ? "border-[#0a0a0a] dark:border-white bg-[#fafafa] dark:bg-white/10" : "border-[#e4e4e7] dark:border-[#27272a] hover:border-gray-400")}
                >
                   <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-white/30 flex items-center justify-center shrink-0">
                      {useWallet && <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] dark:bg-white" />}
                   </div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Creonity Wallet</span>
                      <span className={cn("text-[12px]", hasEnoughBalance ? "text-[#737373]" : "text-red-500 font-medium")}>
                        Available: ₹{brandFinance.walletBalance.toLocaleString()}
                      </span>
                   </div>
                </button>

                <button 
                  onClick={() => setUseWallet(false)}
                  className={cn("flex items-center gap-3 p-3.5 rounded-xl border transition-colors text-left", !useWallet ? "border-[#0a0a0a] dark:border-white bg-[#fafafa] dark:bg-white/10" : "border-[#e4e4e7] dark:border-[#27272a] hover:border-gray-400")}
                >
                   <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-white/30 flex items-center justify-center shrink-0">
                      {!useWallet && <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] dark:bg-white" />}
                   </div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{selectedMethod.name}</span>
                      <span className="text-[12px] text-[#737373]">Pay per release •••• {selectedMethod.last4}</span>
                   </div>
                </button>
             </div>
          </div>
          
          <button 
            onClick={handleRelease}
            disabled={useWallet && !hasEnoughBalance}
            className="w-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] font-semibold rounded-xl h-12 mt-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Release Payment
          </button>
        </div>
      </div>
    </div>
  )
}
