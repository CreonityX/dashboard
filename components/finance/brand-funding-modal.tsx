"use client"

import { useState } from "react"
import { Typography } from "@heroui/react"
import { Wallet, CheckCircle2 } from "lucide-react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useAccount } from "@/context/account-context"
import { toast } from "sonner"

export function BrandFundingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { brandFinance, addFundsToWallet } = useAccount()
  const [amountStr, setAmountStr] = useState("")
  
  if (!isOpen) return null

  const amount = parseInt(amountStr.replace(/,/g, '') || "0", 10)
  
  // Default to first payment method
  const selectedMethod = brandFinance.paymentMethods[0]
  
  const handleFund = () => {
    if (amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    
    // Process funding
    addFundsToWallet(amount, selectedMethod.id)
    toast.success(`Successfully added ₹${amount.toLocaleString()} to wallet`, {
      icon: <CheckCircle2 className="size-5 text-emerald-500" />
    })
    onClose()
    setAmountStr("")
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
          <Wallet className="size-5 text-emerald-500" /> Add Funds
        </h3>
        <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] mb-6">
          Fund your wallet to quickly approve creator payments.
        </p>
        
        <div className="flex flex-col gap-5">
          {/* Funding Source Selection */}
          <div className="flex flex-col gap-2">
             <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Funding Source</label>
             <div className="flex items-center justify-between p-4 rounded-xl border border-[#0a0a0a] dark:border-white bg-[#fafafa] dark:bg-white/5">
                <div className="flex items-center gap-3">
                   <Icon icon={selectedMethod.type === "card" ? "lucide:credit-card" : "lucide:building-2"} className="size-5 text-[#0a0a0a] dark:text-white" />
                   <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{selectedMethod.name}</span>
                      <span className="text-[12px] text-[#737373]">•••• {selectedMethod.last4}</span>
                   </div>
                </div>
                <button className="text-[12px] font-semibold text-blue-500 hover:underline">Change</button>
             </div>
          </div>

          {/* Amount Entry */}
          <div className="flex flex-col gap-2">
             <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Amount (₹)</label>
             <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a1aa] text-[18px] font-semibold">₹</span>
                <input 
                  type="text" 
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val) {
                      setAmountStr(parseInt(val, 10).toLocaleString());
                    } else {
                      setAmountStr("");
                    }
                  }}
                  className="w-full h-14 pl-10 pr-4 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[18px] font-bold text-[#0a0a0a] dark:text-white outline-none focus:border-emerald-500 transition-colors" 
                />
             </div>
          </div>
          
          <button 
            onClick={handleFund}
            className="w-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] font-semibold rounded-xl h-12 mt-2 transition-opacity hover:opacity-90"
          >
            Confirm & Add Funds
          </button>
        </div>
      </div>
    </div>
  )
}
