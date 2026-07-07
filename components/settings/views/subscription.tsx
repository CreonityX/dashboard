"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Button } from "@heroui/react"
import { Check, ArrowUpRightFromSquare, Sparkles, CircleCheck } from "@gravity-ui/icons"
import { toast } from "sonner"

const BILLING_HISTORY = [
  { id: "inv-001", date: "Jul 01, 2026", desc: "Creonity Pro - Monthly", amount: "₹999.00", status: "Paid" },
  { id: "inv-002", date: "Jun 01, 2026", desc: "Creonity Pro - Monthly", amount: "₹999.00", status: "Paid" },
  { id: "inv-003", date: "May 01, 2026", desc: "Creonity Pro - Monthly", amount: "₹999.00", status: "Paid" },
  { id: "inv-004", date: "Apr 01, 2026", desc: "Creonity Pro - Monthly", amount: "₹999.00", status: "Paid" },
]

export function SubscriptionView({ onBack }: { onBack?: () => void }) {
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
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
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">Subscription & Billing</h1>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="flex flex-col gap-10">
        
        {/* CURRENT PLAN */}
        <div className="flex flex-col gap-6 w-full">
          <h3 className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white">Current Plan</h3>
          
          <div 
            className="flex flex-col lg:flex-row gap-6 p-8 rounded-3xl border border-[#efefef] dark:border-[#27272a] overflow-hidden relative bg-[#0a0a0a]"
            style={{ backgroundImage: "url('/images/pro-bg-full.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            {/* Dark overlay for extra readability in light mode (since the image is dark) */}
            <div className="absolute inset-0 bg-black/40 dark:bg-transparent pointer-events-none" />
            
            <div className="flex-1 flex flex-col gap-6 relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-[24px] font-bold text-white flex items-center gap-2">
                    Creonity Pro
                    <Sparkles className="w-5 h-5 text-[#ff5733]" />
                  </h2>
                </div>
                <p className="text-[14px] text-gray-300">Your plan renews on <span className="font-medium text-white">August 1, 2026</span> for <span className="font-medium text-white">₹999.00</span>.</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[14px] text-white font-medium">Unlimited campaign applications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[14px] text-white font-medium">Priority placement in brand search</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[14px] text-white font-medium">Advanced portfolio analytics</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Button onClick={() => toast.success("Opening plan manager...")} className="bg-white text-black font-medium rounded-xl h-10 px-6">
                  Manage Plan
                </Button>
                <Button onClick={() => toast.success("Plan switched to annual successfully")} variant="bordered" className="border-white/20 bg-white/10 text-white font-medium rounded-xl h-10">
                  Switch to Annual (Save 20%)
                </Button>
              </div>
            </div>
            
          </div>
        </div>

        {/* BILLING OPTIONS */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white">Billing Options</h3>
            <p className="text-[14px] text-[#737373] dark:text-[#a1a1aa]">Manage how you pay and get paid.</p>
          </div>
          
          <div className="flex flex-col rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] overflow-hidden">
            
            {/* Payment Method */}
            <div className="flex items-center justify-between p-4 px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-[#e4e4e7] dark:border-[#27272a]">
                  <Icon icon="logos:visa" className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Visa ending in 4242</span>
                  <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Primary Payment Method</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => toast.success("Edit mode enabled")} size="sm" variant="light" className="font-medium">Edit</Button>
                <Button onClick={() => toast.success("Payment method removed")} size="sm" color="danger" variant="flat" className="font-medium bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hidden sm:flex">Remove</Button>
              </div>
            </div>

            {/* Payout Method */}
            <div className="flex items-center justify-between p-4 px-6 h-[72px] border-[#f4f4f5] dark:border-[#1f1f1f] gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-[#e4e4e7] dark:border-[#27272a]">
                  <Icon icon="lucide:building-2" className="w-5 h-5 text-[#52525b] dark:text-[#a1a1aa]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">HDFC Bank ending in 4012</span>
                  <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Primary Payout Method</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => toast.success("Edit mode enabled")} size="sm" variant="light" className="font-medium">Edit</Button>
                <Button onClick={() => toast.success("Payout method removed")} size="sm" color="danger" variant="flat" className="font-medium bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hidden sm:flex">Remove</Button>
              </div>
            </div>

          </div>

          <Button 
            variant="light"
            className="w-fit font-semibold text-[#0060ff] px-3 -ml-3 hover:bg-[#0060ff]/10 dark:hover:bg-[#0060ff]/20 transition-colors"
            startContent={<Icon icon="gravity-ui:plus" className="w-4 h-4" />}
            onClick={() => setAddModalOpen(true)}
          >
            Add payment method
          </Button>
        </div>

        {/* BILLING HISTORY */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white">Billing History</h3>
          </div>
          
          <div className="w-full flex flex-col bg-[#f4f4f5] dark:bg-[#111111] rounded-2xl shadow-none border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden">
            {/* TABLE HEADER */}
            <div className="flex w-full h-[52px] shrink-0 items-center">
              <div className="w-[100px] shrink-0 px-5 flex items-center justify-center text-center">
                <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">ID</span>
              </div>
              <div className="flex-1 min-w-0 px-4 flex items-center justify-start text-left">
                <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Description</span>
              </div>
              <div className="hidden sm:flex w-[130px] shrink-0 px-4 items-center justify-center text-center">
                <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Date</span>
              </div>
              <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
                <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Amount</span>
              </div>
              <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
                <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Status</span>
              </div>
              <div className="w-[56px] shrink-0" />
            </div>

            {/* TABLE ROWS */}
            <div className="flex flex-col w-full bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden flex-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border-t border-b border-[#efefef] dark:border-[#27272a]">
              <div className="flex flex-col w-full divide-y divide-[#efefef] dark:divide-[#27272a]">
                {BILLING_HISTORY.map((invoice) => (
                  <div key={invoice.id} className="w-full flex flex-col transition-all overflow-hidden border-l-[3px] border-l-transparent hover:bg-black/[0.025] dark:hover:bg-white/[0.03] cursor-pointer">
                    <div className="flex w-full items-center min-h-[64px] group">
                      {/* ID */}
                      <div className="w-[100px] shrink-0 px-5 flex items-center justify-center text-center">
                        <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white tabular-nums uppercase">
                          #{invoice.id.split('-')[1]}
                        </span>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="flex-1 min-w-0 px-4 flex flex-col justify-center items-start text-left py-3">
                        <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white leading-snug">
                          {invoice.desc}
                        </span>
                        {/* Mobile-only status + date */}
                        <div className="flex items-center justify-start gap-2 mt-1 sm:hidden">
                          <span className="text-[11px] text-[#a1a1aa]">{invoice.date}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600">PAID</span>
                        </div>
                      </div>

                      {/* DATE */}
                      <div className="hidden sm:flex w-[130px] shrink-0 px-4 items-center justify-center text-center">
                        <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{invoice.date}</span>
                      </div>

                      {/* AMOUNT */}
                      <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
                        <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white tabular-nums">
                          {invoice.amount}
                        </span>
                      </div>

                      {/* STATUS */}
                      <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {invoice.status}
                        </span>
                      </div>

                      {/* ACTION / DOWNLOAD */}
                      <div className="w-[56px] shrink-0 flex items-center justify-center pr-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#0a0a0a] dark:hover:text-white transition-colors">
                          <Icon icon="ph:download-simple" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111111] rounded-[24px] p-7 w-full max-w-md relative animate-in zoom-in-95 duration-200 shadow-2xl border border-[#e4e4e7] dark:border-[#27272a]">
            <button 
              onClick={() => { setAddModalOpen(false); setSelectedMethod(null); }} 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
            >
              <Icon icon="gravity-ui:xmark" className="w-4 h-4" />
            </button>

            {!selectedMethod ? (
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
                      onClick={() => setSelectedMethod(method.id)}
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
                  onClick={() => setSelectedMethod(null)} 
                  className="flex items-center gap-2 text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white mb-4 transition-colors"
                >
                  <Icon icon="gravity-ui:arrow-left" className="w-4 h-4" /> Back to methods
                </button>
                
                <h3 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white mb-2">
                  {selectedMethod === "card" && "Add Card Details"}
                  {selectedMethod === "bank" && "Add Bank Account"}
                  {selectedMethod === "upi" && "Add UPI ID"}
                  {selectedMethod === "paypal" && "Connect PayPal"}
                </h3>
                <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] mb-6">
                  Enter your details below securely.
                </p>
                
                <div className="flex flex-col gap-4">
                  {selectedMethod === "card" && (
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
                  
                  {selectedMethod === "bank" && (
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
                  
                  {selectedMethod === "upi" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">UPI ID</label>
                      <input type="text" placeholder="username@bank" className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" />
                    </div>
                  )}
                  
                  {selectedMethod === "paypal" && (
                    <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
                      <Icon icon="simple-icons:paypal" className="w-12 h-12 text-[#00457C]" />
                      <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa]">You will be redirected to PayPal to securely link your account.</p>
                    </div>
                  )}

                  <Button className="w-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] font-medium rounded-xl h-11 mt-4" onClick={() => { setAddModalOpen(false); setSelectedMethod(null); }}>
                    {selectedMethod === "paypal" ? "Continue to PayPal" : "Save Payment Method"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
