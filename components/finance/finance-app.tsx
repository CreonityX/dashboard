"use client"

import { useMemo, useState } from "react"
import { Typography } from "@heroui/react"
import { toast } from "sonner"
import { ChevronDown, ArrowDownToLine, FileText, Wallet, Calendar } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { useAccount } from "@/context/account-context"
import { getFinanceData } from "./finance-data"
import { AvailableCard, EscrowCard, TotalEarnedCard, TaxSummaryCard } from "./finance-overview"
import { BrandAvailableCard, BrandCampaignBudgetCard, BrandEscrowCard, BrandTaxSummaryCard } from "./brand-finance-overview"
import { RevenueChart } from "./revenue-chart"
import { IncomeBreakdown } from "./income-breakdown"
import { TransactionTable } from "./transaction-table"
import { UpcomingPayouts } from "./upcoming-payouts"
import { TaxCompliance } from "./tax-compliance"
import { PayoutSettings } from "./payout-settings"

export function FinanceApp() {
  const data = useMemo(() => getFinanceData(), [])
  const { isBrand, brandFinance } = useAccount()
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [period, setPeriod] = useState("This Month")

  const now = new Date()
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = monthNames[now.getMonth()]
  const prevMonth = monthNames[(now.getMonth() - 1 + 12) % 12]
  const currentQuarter = `Q${Math.floor(now.getMonth() / 3) + 1}`
  const currentYear = now.getFullYear().toString()

  const PERIODS = [
    { id: "This Month", label: currentMonth },
    { id: "Last Month", label: prevMonth },
    { id: "This Quarter", label: currentQuarter },
    { id: "This Year", label: currentYear },
  ]

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0a0a0a] overflow-y-auto">
      <div className="flex flex-col px-6 pt-8 pb-6 w-full">
        <div className="flex items-center justify-between mb-8 w-full">
          <Typography type="h2" className="font-bold text-[#0a0a0a] dark:text-white tracking-tight text-3xl">
            {isBrand ? "Finance" : "Earnings"}
          </Typography>
          
          <div className="flex items-center gap-3">
            {isBrand && (
              <div className="flex w-full items-center overflow-hidden rounded-xl border border-[#efefef] bg-[#f4f4f5] p-0.5 dark:border-[#27272a] dark:bg-[#111111] sm:w-auto sm:shrink-0">
                {PERIODS.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setPeriod(tf.id)}
                    className={cn(
                      "flex h-[30px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] text-[12.5px] font-medium transition-all sm:w-[60px] sm:flex-none uppercase",
                      period === tf.id
                        ? "bg-white dark:bg-[#27272a] text-[#0a0a0a] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                        : "text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white"
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            )}
            <div className="relative z-[90]">
              <button 
                onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-[#111111] dark:hover:bg-white/10 text-[#0a0a0a] dark:text-white rounded-xl transition-colors font-semibold text-[14px]"
              >
                Quick actions
                <ChevronDown className={cn("size-4 text-[#737373] dark:text-[#a1a1aa] transition-transform", isQuickActionsOpen && "rotate-180")} />
              </button>

              {isQuickActionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl flex flex-col p-1.5 overflow-hidden">
                  {isBrand ? (
                    <>
                      <button 
                        onClick={() => {
                          setIsQuickActionsOpen(false);
                          // We'll open the add funds modal here soon
                          toast("Add funds modal will open");
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[#0a0a0a] dark:text-white bg-gray-100 dark:bg-[#27272a] hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl transition-colors mb-1"
                      >
                        <Wallet className="size-4 text-[#0a0a0a] dark:text-white" />
                        Add funds to wallet
                      </button>
                      <button 
                        onClick={() => {
                          setIsQuickActionsOpen(false);
                          toast.promise(
                            new Promise(resolve => setTimeout(resolve, 1500)),
                            {
                              loading: 'Generating spend report...',
                              success: 'Spend report downloaded successfully',
                              error: 'Failed to generate report',
                            }
                          );
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors mb-0.5"
                      >
                        <FileText className="size-4 text-[#737373] dark:text-[#a1a1aa]" />
                        Download spend report
                      </button>
                      <button 
                        onClick={() => {
                          setIsQuickActionsOpen(false);
                          toast.promise(
                            new Promise(resolve => setTimeout(resolve, 1500)),
                            {
                              loading: 'Preparing invoices...',
                              success: 'Invoices downloaded successfully',
                              error: 'Failed to download invoices',
                            }
                          );
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <ArrowDownToLine className="size-4 text-[#737373] dark:text-[#a1a1aa]" />
                        Download all invoices
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setIsQuickActionsOpen(false);
                          toast.success("Withdrawal initiated", { description: "Your entire available balance will be transferred." });
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[#0a0a0a] dark:text-white bg-gray-100 dark:bg-[#27272a] hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl transition-colors mb-1"
                      >
                        <Wallet className="size-4 text-[#0a0a0a] dark:text-white" />
                        Withdraw available balance
                      </button>
                      <button 
                        onClick={() => {
                          setIsQuickActionsOpen(false);
                          toast.promise(
                            new Promise(resolve => setTimeout(resolve, 2500)),
                            {
                              loading: 'Preparing invoices for download...',
                              success: 'Invoices downloaded successfully',
                              error: 'Failed to download invoices',
                            }
                          );
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors mb-0.5"
                      >
                        <ArrowDownToLine className="size-4 text-[#737373] dark:text-[#a1a1aa]" />
                        Download all invoices
                      </button>
                      <button 
                        onClick={() => {
                          setIsQuickActionsOpen(false);
                          toast.promise(
                            new Promise(resolve => setTimeout(resolve, 2500)),
                            {
                              loading: 'Generating tax summary PDF...',
                              success: 'Tax summary downloaded successfully',
                              error: 'Failed to generate PDF',
                            }
                          );
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <FileText className="size-4 text-[#737373] dark:text-[#a1a1aa]" />
                        Download tax summary PDF
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 1. Masonry Top Section */}
        <div className="flex flex-col gap-5 shrink-0 mb-6 w-full">
          {/* Top Half: Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
            {/* Column 1: Available & Tax/Pending */}
            <div className="flex flex-col gap-5">
              {isBrand ? <BrandAvailableCard /> : <AvailableCard data={data.overview} />}
              {isBrand ? <BrandTaxSummaryCard /> : <TaxSummaryCard />}
            </div>

            {/* Column 2: Budget */}
            <div className="flex flex-col gap-5 h-full">
              {isBrand ? <BrandCampaignBudgetCard /> : <EscrowCard data={data.overview} />}
            </div>

            {/* Column 3: Escrow (For brands, or empty for creators if they don't have a 3rd col) */}
            <div className="flex flex-col gap-5 h-full">
              {isBrand && <BrandEscrowCard />}
            </div>
          </div>

          {/* Bottom Half: Transaction Table */}
          <div className="w-full flex flex-col min-h-0 h-[600px] xl:h-auto">
            <TransactionTable data={isBrand ? brandFinance.transactions as any : data.recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
