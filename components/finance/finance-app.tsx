"use client"

import { useMemo, useState } from "react"
import { Typography } from "@heroui/react"
import { toast } from "sonner"
import { ChevronDown, ArrowDownToLine, FileText, Wallet } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { getFinanceData } from "./finance-data"
import { AvailableCard, EscrowCard, TotalEarnedCard, TaxSummaryCard } from "./finance-overview"
import { RevenueChart } from "./revenue-chart"
import { IncomeBreakdown } from "./income-breakdown"
import { TransactionTable } from "./transaction-table"
import { UpcomingPayouts } from "./upcoming-payouts"
import { TaxCompliance } from "./tax-compliance"
import { PayoutSettings } from "./payout-settings"

export function FinanceApp() {
  const data = useMemo(() => getFinanceData(), [])
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0a0a0a] overflow-y-auto">
      <div className="flex flex-col px-6 pt-8 pb-6 w-full">
        <div className="flex items-center justify-between mb-8 w-full">
          <Typography type="h2" className="font-bold text-[#0a0a0a] dark:text-white tracking-tight text-3xl">
            Earnings
          </Typography>
          
          <div className="relative z-[100]">
            <button 
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-[#111111] dark:hover:bg-white/10 text-[#0a0a0a] dark:text-white rounded-xl transition-colors font-semibold text-[14px]"
            >
              Quick actions
              <ChevronDown className={cn("size-4 text-[#737373] dark:text-[#a1a1aa] transition-transform", isQuickActionsOpen && "rotate-180")} />
            </button>

            {isQuickActionsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl flex flex-col p-1.5 overflow-hidden">
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
              </div>
            )}
          </div>
        </div>

        {/* 1. Masonry Top Section */}
        <div className="flex flex-col lg:flex-row gap-5 mb-8 w-full items-start">
          
          {/* Left Half: Overview Cards */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Column 1: Available & Tax Summary */}
            <div className="flex flex-col gap-5">
              <AvailableCard data={data.overview} />
              <TaxSummaryCard />
            </div>

            {/* Column 2: Escrow */}
            <div className="flex flex-col">
              <EscrowCard data={data.overview} />
            </div>
          </div>

          {/* Right Half: Transaction Table */}
          <div className="w-full lg:w-1/2 flex flex-col min-h-0">
            <TransactionTable data={data.recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
