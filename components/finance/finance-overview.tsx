"use client"

import { Typography, Input } from "@heroui/react"
import { toast } from "sonner"
import { Wallet, BriefcaseBusiness, ChevronDown, Landmark, Info, Receipt, Plus, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FinanceOverviewData } from "./finance-data"
import { useState } from "react"
import { BrandLogo } from "@/components/ui/brand-logo"
import { Icon } from "@iconify/react"

export function AvailableCard({ data }: { data: FinanceOverviewData }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWithdrawVerifyModalOpen, setIsWithdrawVerifyModalOpen] = useState(false)
  const [selectedMethodType, setSelectedMethodType] = useState<string | null>(null)
  
  const paymentMethods = [
    { id: 1, bank: "HDFC", type: "Debit", last4: "2345", domain: "hdfcbank.com", iconUrl: "https://www.google.com/s2/favicons?domain=hdfcbank.com&sz=128" },
    { id: 2, bank: "ICICI", type: "Account", last4: "9876", domain: "icicibank.com", iconUrl: "https://www.google.com/s2/favicons?domain=icicibank.com&sz=128" },
  ]
  
  const [selectedMethodId, setSelectedMethodId] = useState(1)
  const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId) || paymentMethods[0]

  return (
    <div className="flex flex-col rounded-2xl p-6 relative overflow-visible transition-all duration-300 w-full border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a] h-[345px] shrink-0">
      <div className="flex flex-col z-10 w-full relative">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="text-[#a1a1aa] dark:text-[#737373] size-5" />
          <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Available to Payout</Typography>
        </div>
        <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">
          {data.currency}{(data.availableWallet).toLocaleString()}
        </Typography>
        <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
          <span className="text-emerald-500">↑ 12.5%</span>
          <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">last month</span>
        </div>
        
        <div className="flex flex-col gap-2 mt-5">
           <div className="flex items-center justify-between">
             <span className="text-[13px] text-[#a1a1aa] dark:text-[#737373] font-medium">TDS deducted (10%)</span>
             <span className="text-[13px] text-red-500 font-semibold">-₹1,550</span>
           </div>
           <div className="flex items-center justify-between">
             <span className="text-[13px] text-[#a1a1aa] dark:text-[#737373] font-medium">Platform fee (10%)</span>
             <span className="text-[13px] text-red-500 font-semibold">-₹1,550</span>
           </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col pt-4 -mx-3 -mb-3 relative">
        <div className="flex flex-col relative w-full">
          {/* Payment Method Chip (Extension) */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-6 rounded-t-[16px] border border-[#e4e4e7] dark:border-[#27272a] border-b-0 bg-[#fafafa] dark:bg-[#111111]/80 w-full -mb-4 relative z-0">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedMethod.iconUrl} alt={selectedMethod.bank} className="size-5 object-contain" />
              <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{selectedMethod.bank} {selectedMethod.type}</span>
              <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa] ml-1">•••• {selectedMethod.last4}</span>
            </div>
            
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-[12px] font-semibold text-red-500 hover:text-red-600 transition-colors relative z-20"
            >
              Change account
            </button>
          </div>

          {/* Withdraw Button */}
          <button 
            onClick={() => setIsWithdrawVerifyModalOpen(true)}
            className="w-full bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-semibold text-[14px] h-[48px] rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center shrink-0 z-10 relative shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-none"
          >
            Withdraw Funds
          </button>
          
          {/* Full-width Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-0 left-0 w-full bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-[100] flex flex-col py-1.5">
              {paymentMethods.map(method => (
                <button 
                  key={method.id}
                  onClick={() => { 
                    setSelectedMethodId(method.id); 
                    setIsDropdownOpen(false); 
                    toast.success("Payment method changed", { description: `You are now using ${method.bank} •••• ${method.last4}` });
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-lg text-left transition-colors",
                    selectedMethodId === method.id ? "bg-[#f4f4f5] dark:bg-[#27272a]" : "hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={method.iconUrl} alt={method.bank} className="size-5 object-contain shrink-0" />
                  <span className={cn("text-[14px] font-medium", selectedMethodId === method.id ? "text-[#0a0a0a] dark:text-white" : "text-[#737373] dark:text-[#a1a1aa]")}>
                    {method.bank} •••• {method.last4}
                  </span>
                </button>
              ))}
              <div className="h-px bg-gray-100 dark:bg-white/10 my-1 mx-4" />
              <button 
                onClick={() => { setIsDropdownOpen(false); setIsModalOpen(true); }}
                className="flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="size-[18px] rounded-sm border border-gray-200 dark:border-white/20 flex items-center justify-center shrink-0">
                  <Plus className="size-3 text-[#737373] dark:text-[#a1a1aa]" />
                </div>
                <span className="text-[14px] font-medium text-[#737373] dark:text-[#a1a1aa]">Add payment method</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Withdraw / Add Payment Method Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111111] rounded-[24px] p-7 w-full max-w-md relative animate-in zoom-in-95 duration-200 shadow-2xl border border-[#e4e4e7] dark:border-[#27272a]">
            <button 
              onClick={() => { setIsModalOpen(false); setSelectedMethodType(null); }} 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
            >
              <Icon icon="gravity-ui:xmark" className="w-4 h-4" />
            </button>

            {!selectedMethodType ? (
              <>
                <h3 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white mb-2">Add Payment Method</h3>
                <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] mb-6">
                  Choose how you'd like to pay or receive payouts.
                </p>

                <div className="flex flex-col gap-3">
                  {[
                    { id: "card", name: "Credit / Debit Card", icon: "lucide:credit-card", desc: "Visa, Mastercard, Amex" },
                    { id: "bank", name: "Bank Account", icon: "lucide:building-2", desc: "Direct deposit (ACH)" },
                    { id: "upi", name: "UPI", icon: "lucide:smartphone", desc: "Google Pay, PhonePe, Paytm" },
                    { id: "paypal", name: "PayPal", icon: "simple-icons:paypal", desc: "Connect your PayPal account" },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethodType(method.id)}
                      className="flex items-center gap-4 p-4 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] hover:border-[#0a0a0a] dark:hover:border-white transition-colors group text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] group-hover:bg-[#0a0a0a] dark:group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                        <Icon icon={method.icon} className="w-5 h-5 text-[#0a0a0a] dark:text-white group-hover:text-white dark:group-hover:text-[#0a0a0a] transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{method.name}</span>
                        <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">{method.desc}</span>
                      </div>
                      <Icon icon="gravity-ui:chevron-right" className="w-4 h-4 text-[#a1a1aa] ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setSelectedMethodType(null)} 
                  className="flex items-center gap-2 text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white mb-4 transition-colors"
                >
                  <Icon icon="gravity-ui:arrow-left" className="w-4 h-4" /> Back to methods
                </button>
                
                <h3 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white mb-2">
                  {selectedMethodType === "card" && "Add Card Details"}
                  {selectedMethodType === "bank" && "Add Bank Account"}
                  {selectedMethodType === "upi" && "Add UPI ID"}
                  {selectedMethodType === "paypal" && "Connect PayPal"}
                </h3>
                <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] mb-6">
                  Enter your details below securely.
                </p>
                
                <div className="flex flex-col gap-4">
                  {selectedMethodType === "card" && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">CVC</label>
                          <input type="text" placeholder="123" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedMethodType === "bank" && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Account Name</label>
                        <input type="text" placeholder="John Doe" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Account Number</label>
                        <input type="text" placeholder="000000000000" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Routing / IFSC Code</label>
                        <input type="text" placeholder="ABCD0123456" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                      </div>
                    </>
                  )}
                  
                  {selectedMethodType === "upi" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">UPI ID</label>
                      <input type="text" placeholder="username@bank" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                    </div>
                  )}
                  
                  {selectedMethodType === "paypal" && (
                    <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
                      <Icon icon="simple-icons:paypal" className="w-12 h-12 text-[#00457C]" />
                      <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa]">You will be redirected to PayPal to securely link your account.</p>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      toast.success("Payment method added", { description: "Your new payment method is ready to use." });
                      setIsModalOpen(false);
                      setSelectedMethodType(null);
                    }}
                    className="w-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] font-medium rounded-xl h-11 mt-4 transition-opacity hover:opacity-90"
                  >
                    {selectedMethodType === "paypal" ? "Continue to PayPal" : "Save Payment Method"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Verify Withdraw Modal */}
      {isWithdrawVerifyModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111111] rounded-[24px] p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200 shadow-2xl border border-[#e4e4e7] dark:border-[#27272a] flex flex-col items-center text-center">
            <button 
              onClick={() => setIsWithdrawVerifyModalOpen(false)} 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
            >
              <Icon icon="gravity-ui:xmark" className="w-4 h-4" />
            </button>
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6">
              <Icon icon="ic:baseline-whatsapp" className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h3 className="text-[22px] font-bold text-[#0a0a0a] dark:text-white mb-2">Security Verification</h3>
            <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] mb-8 leading-relaxed px-2">
              To authorize this withdrawal, please enter the 6-digit code we just sent to your WhatsApp number ending in <span className="font-semibold text-[#0a0a0a] dark:text-white">**78</span>.
            </p>

            <div className="flex gap-2 mb-8 justify-center w-full">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input 
                  key={i}
                  type="text" 
                  maxLength={1}
                  className="w-12 h-14 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-center text-[20px] font-bold text-[#0a0a0a] dark:text-white outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors shadow-sm"
                />
              ))}
            </div>

            <button 
              onClick={() => {
                toast.success("Withdrawal Processing", { description: "Your funds will arrive in 1-3 business days." });
                setIsWithdrawVerifyModalOpen(false);
              }}
              className="w-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] font-semibold rounded-xl h-12 transition-opacity hover:opacity-90 text-[15px]"
            >
              Verify & Withdraw
            </button>
            
            <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa] mt-6">
              Didn't receive the code? <button onClick={() => toast.success("Verification code resent via SMS")} className="font-semibold text-[#0a0a0a] dark:text-white hover:underline">Resend via SMS</button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function EscrowCard({ data }: { data: FinanceOverviewData }) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const escrowCampaigns = [
    { id: 1, name: "Summer Skincare Campaign", brand: "L'Oreal", domain: "loreal.com", amount: 15000, date: "Jul 15, 2026", status: "Awaiting Brand Approval" },
    { id: 2, name: "Running Challenge", brand: "Nike", domain: "nike.com", amount: 19500, date: "Jul 22, 2026", status: "Content Under Review" },
  ]

  return (
    <div className="flex flex-col rounded-2xl py-6 relative overflow-hidden transition-all duration-300 w-full border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a] h-auto xl:h-[627px] shrink-0">
      <div className="flex flex-col z-10 w-full relative shrink-0 mb-6 px-6">
        <div className="flex items-center gap-2 mb-2">
          <BriefcaseBusiness className="text-[#a1a1aa] dark:text-[#737373] size-5" />
          <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Held in Escrow</Typography>
        </div>
        <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">
          {data.currency}{data.inEscrow.toLocaleString()}
        </Typography>
        <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
          <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">Unlocks upon campaign approvals</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto gap-1 px-3">
        {escrowCampaigns.map((camp) => {
          const isExpanded = expandedId === camp.id;
          return (
            <div 
              key={camp.id} 
              className={cn(
                "flex flex-col transition-all duration-200 overflow-hidden rounded-xl relative",
                isExpanded ? "bg-transparent" : "hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <div 
                className="flex items-center justify-between p-3 select-none cursor-pointer relative z-10"
                onClick={() => setExpandedId(isExpanded ? null : camp.id)}
              >
                <div className="flex items-center gap-3.5 pr-3 min-w-0">
                  <div className="size-11 rounded-[14px] overflow-hidden shrink-0 flex items-center justify-center bg-white border border-gray-100 dark:border-white/10 shadow-sm">
                     <BrandLogo domain={camp.domain} name={camp.brand} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white truncate leading-tight">{camp.brand}</span>
                    <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa] leading-tight truncate">{camp.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">{data.currency}{camp.amount.toLocaleString()}</span>
                  <ChevronDown className={cn("size-[18px] text-[#a1a1aa] transition-transform shrink-0", isExpanded && "rotate-180")} />
                </div>
              </div>
              
              {isExpanded && (
                <div className="flex relative pb-4 pt-1 w-full">
                  {/* Timeline vertical line */}
                  <div className="absolute left-[33.5px] top-0 bottom-[28px] w-[2px] bg-gray-200 dark:bg-white/10 rounded-full" />
                  
                  {/* Timeline hollow circle */}
                  <div className="absolute left-[29.5px] bottom-[28px] size-2.5 rounded-full border-2 border-gray-300 dark:border-white/20 bg-white dark:bg-[#0a0a0a] z-10" />
                  
                  <div className="flex flex-col gap-3.5 pl-[58px] pr-2 w-full min-w-0">
                    <div className="text-[13.5px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
                      Currently <span className="font-medium text-[#0a0a0a] dark:text-white lowercase">{camp.status}</span>. Expected payment release is <span className="font-medium text-[#0a0a0a] dark:text-white">{camp.date}</span>.
                    </div>
                    
                    <button className="flex items-center justify-between bg-[#f4f4f5] dark:bg-[#111111] rounded-xl px-3.5 py-3 cursor-pointer hover:bg-[#efefef] dark:hover:bg-white/10 transition-colors group min-w-0">
                      <span className="text-[13.5px] font-semibold text-[#0a0a0a] dark:text-white truncate pr-2">{camp.name}</span>
                      <ArrowUpRight className="size-4 text-[#a1a1aa] group-hover:text-[#0a0a0a] dark:group-hover:text-white transition-colors shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TaxSummaryCard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState("FY 25-26")

  return (
    <div className="flex flex-col rounded-2xl p-6 relative overflow-visible transition-all duration-300 w-full border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a] h-[262px] shrink-0">
      <div className="flex items-center justify-between z-10 relative mb-5 w-full">
        <div className="flex items-center gap-2">
          <Receipt className="text-[#a1a1aa] dark:text-[#737373] size-5" />
          <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Tax & Fees</Typography>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 bg-[#f4f4f5] dark:bg-[#111111] px-2.5 py-1 rounded-md text-[11.5px] font-semibold text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
          >
            {selectedYear}
            <ChevronDown className={cn("size-3.5 transition-transform", isDropdownOpen && "rotate-180")} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-28 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
              <button onClick={() => { setSelectedYear("FY 25-26"); setIsDropdownOpen(false) }} className={cn("w-full text-left px-3 py-1.5 text-[11.5px] font-medium transition-colors", selectedYear === "FY 25-26" ? "bg-gray-50 dark:bg-white/10 text-[#0a0a0a] dark:text-white" : "hover:bg-gray-50 dark:hover:bg-white/5 text-[#737373] dark:text-[#a1a1aa]")}>FY 25-26</button>
              <button onClick={() => { setSelectedYear("FY 24-25"); setIsDropdownOpen(false) }} className={cn("w-full text-left px-3 py-1.5 text-[11.5px] font-medium transition-colors", selectedYear === "FY 24-25" ? "bg-gray-50 dark:bg-white/10 text-[#0a0a0a] dark:text-white" : "hover:bg-gray-50 dark:hover:bg-white/5 text-[#737373] dark:text-[#a1a1aa]")}>FY 24-25</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa]">Gross earnings</span>
          <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">₹2,45,800</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa]">TDS deducted (10%)</span>
          <span className="text-[13px] font-semibold text-red-500">-₹24,580</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-[#efefef] dark:border-[#27272a]">
          <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa]">Creonity platform fee</span>
          <span className="text-[13px] font-semibold text-red-500">-₹22,122</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Net received</span>
          <span className="text-[14px] font-bold text-emerald-500">₹1,99,098</span>
        </div>
      </div>
    </div>
  )
}
