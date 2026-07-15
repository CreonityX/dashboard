"use client"

import React from "react"
import { Wallet, ArrowUp } from "lucide-react"

export function AvailablePayoutCard() {
  return (
    <div className="w-full max-w-[380px] bg-white rounded-[24px] border border-gray-200 shadow-sm p-6 flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-[18px] h-[18px] text-[#9ca3af]" />
        <span className="font-semibold text-[#6b7280] text-[15px]">Available to Payout</span>
      </div>

      {/* Amount */}
      <div className="text-[44px] font-bold text-[#0a0a0a] tracking-tight leading-none mb-3">
        ₹12,400
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 text-[15px] mb-8">
        <div className="flex items-center font-bold text-[#10b981]">
          <ArrowUp className="w-[14px] h-[14px] mr-0.5" strokeWidth={3} />
          12.5%
        </div>
        <span className="text-[#9ca3af] font-medium">last month</span>
      </div>

      {/* Deductions Breakdown */}
      <div className="flex flex-col gap-3.5 mb-10">
        <div className="flex items-center justify-between text-[15px] font-medium">
          <span className="text-[#9ca3af]">TDS deducted (10%)</span>
          <span className="text-[#ef4444] font-bold">-₹1,550</span>
        </div>
        <div className="flex items-center justify-between text-[15px] font-medium">
          <span className="text-[#9ca3af]">Platform fee (10%)</span>
          <span className="text-[#ef4444] font-bold">-₹1,550</span>
        </div>
      </div>

      {/* Action / Payment Method Area */}
      <div className="mt-auto p-4 rounded-[20px] border border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            {/* Bank Logo Placeholder (HDFC style) */}
            <div className="w-[20px] h-[20px] bg-white border border-gray-100 rounded-sm overflow-hidden flex items-center justify-center p-0.5 shadow-sm">
              <div className="w-full h-full bg-blue-600 rounded-[1px] relative">
                <div className="absolute inset-[3px] bg-red-500 rounded-[1px]" />
              </div>
            </div>
            
            <span className="text-[14px] font-bold text-[#0a0a0a]">HDFC Debit</span>
            <span className="text-[14px] font-bold text-[#9ca3af] tracking-widest ml-1">•••• <span className="font-medium tracking-normal">2345</span></span>
          </div>
          
          <button className="text-[13px] font-bold text-[#ef4444] hover:text-[#dc2626] transition-colors">
            Change account
          </button>
        </div>
        
        <button className="w-full h-[52px] rounded-[14px] bg-[#0a0a0a] hover:bg-black text-white font-semibold text-[16px] transition-colors shadow-md hover:shadow-lg">
          Withdraw Funds
        </button>
      </div>

    </div>
  )
}
