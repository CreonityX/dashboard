import { Typography } from "@heroui/react"
import { Building2, ChevronRight, CreditCard, PlusCircle } from "lucide-react"

export function PayoutSettings() {
  return (
    <div className="flex flex-col rounded-2xl p-6 border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a] w-full">
      <div className="flex items-center justify-between mb-5">
        <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white text-[18px]">
          Payout Methods
        </Typography>
        <button className="text-[13px] font-semibold text-[#0ea5e9] flex items-center gap-1 hover:underline">
          <PlusCircle className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {/* Connected Bank Account */}
        <div className="group flex items-center justify-between p-4 rounded-xl border border-[#0ea5e9]/30 bg-[#0ea5e9]/5 cursor-pointer transition-all hover:bg-[#0ea5e9]/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#0ea5e9]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white flex items-center gap-2">
                HDFC Bank
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#0ea5e9]/20 text-[#0ea5e9]">Primary</span>
              </span>
              <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa] font-medium">Checking •••• 4012</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#a1a1aa] group-hover:text-[#0ea5e9] transition-colors" />
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#e4e4e7] dark:bg-[#27272a] mb-8" />

      {/* PAYOUT BEHAVIOR */}
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">Payout Behavior</h3>
          <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Choose how you want to receive your earnings.</p>
        </div>
        
        <div className="flex flex-col gap-0 border border-[#e4e4e7] dark:border-[#27272a] rounded-xl overflow-hidden bg-white dark:bg-[#111111]">
          <label className="flex items-start gap-3 p-4 border-b border-[#e4e4e7] dark:border-[#27272a] cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]">
            <input type="radio" name="payout" defaultChecked className="mt-1 w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]" />
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Auto-withdrawal</span>
              <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Automatically transfer earnings to your primary bank account at the end of each month.</span>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]">
            <input type="radio" name="payout" className="mt-1 w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]" />
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Manual Accumulation</span>
              <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Keep funds in your Creonity Wallet and manually withdraw when you want.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#e4e4e7] dark:bg-[#27272a] mb-8" />

      {/* INVOICE DEFAULTS */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">Invoice Defaults</h3>
          <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Used when automatically generating invoices for completed milestones.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa] uppercase tracking-wider">Business Name / Full Name</label>
            <input type="text" defaultValue="John Doe Creations" className="bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-medium text-[#0a0a0a] dark:text-white rounded-lg h-10 px-3 outline-none focus:ring-2 focus:ring-[#0ea5e9]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa] uppercase tracking-wider">Tax ID (GSTIN/PAN)</label>
            <input type="text" defaultValue="" placeholder="Optional" className="bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-medium text-[#0a0a0a] dark:text-white rounded-lg h-10 px-3 outline-none focus:ring-2 focus:ring-[#0ea5e9]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa] uppercase tracking-wider">Billing Address</label>
            <textarea className="bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-medium text-[#0a0a0a] dark:text-white rounded-lg p-3 min-h-[80px] outline-none resize-none focus:ring-2 focus:ring-[#0ea5e9]" defaultValue="123 Creator Street, Suite 4B&#10;Mumbai, MH 400001&#10;India" />
          </div>
        </div>
      </div>
    </div>
  )
}
