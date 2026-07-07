import { Transaction } from "./finance-data"
import { ChevronDown, Clock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { PaginationBar } from "@/components/support/pagination-bar"

export function TransactionTable({ data }: { data: Transaction[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="flex flex-col w-full h-full">
      {/* TABLE CONTAINER */}
      <div className="w-full flex flex-col bg-[#f4f4f5] dark:bg-[#111111] rounded-2xl shadow-none border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden flex-1">
        
        {/* TABLE HEADER */}
        <div className="flex w-full h-[52px] shrink-0 items-center">
          <div className="w-[90px] sm:w-[100px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">ID</span>
          </div>
          <div className="flex-1 min-w-0 px-4 flex items-center justify-start text-left">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Transaction</span>
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
          <div className="w-[44px] sm:w-[56px] shrink-0" />
        </div>

        {/* TABLE ROWS */}
        <div className="flex flex-col w-full bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden flex-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border-t border-b border-[#efefef] dark:border-[#27272a]">
          <div className="flex flex-col w-full divide-y divide-[#efefef] dark:divide-[#27272a]">
          {paginatedData.map((trx) => {
            const isExpanded = expandedId === trx.id;
            const isResolved = trx.status === "completed";
            const isPending = trx.status === "pending";

            return (
              <div
                key={trx.id}
                className={cn(
                  "w-full flex flex-col transition-all overflow-hidden",
                  isExpanded
                    ? cn(
                        "border-l-[3px]",
                        isResolved
                          ? "border-l-emerald-500 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04]"
                          : isPending
                          ? "border-l-amber-500 bg-amber-500/[0.03] dark:bg-amber-500/[0.04]"
                          : "border-l-red-500 bg-red-500/[0.03] dark:bg-red-500/[0.04]"
                      )
                    : "border-l-[3px] border-l-transparent hover:bg-black/[0.025] dark:hover:bg-white/[0.03] cursor-pointer"
                )}
              >
                {/* COLLAPSED ROW */}
                <div
                  className="flex w-full items-center min-h-[64px] cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : trx.id)}
                >
                  {/* ID */}
                  <div className="w-[90px] sm:w-[100px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center gap-2">
                    <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white tabular-nums">
                      #{trx.id.replace('TRX-', '')}
                    </span>
                  </div>

                  {/* ISSUE */}
                  <div className="flex-1 min-w-0 px-4 flex flex-col justify-center items-start text-left py-3">
                    <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white leading-snug">
                      {trx.description}
                    </span>
                    {/* Mobile-only status + date */}
                    <div className="flex items-center justify-start gap-2 mt-1 sm:hidden">
                      <span className="text-[11px] text-[#a1a1aa]">{new Date(trx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide", isResolved ? "bg-emerald-500/10 text-emerald-600" : isPending ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600")}>{trx.status}</span>
                    </div>
                  </div>

                  {/* DATE — hidden on mobile */}
                  <div className="hidden sm:flex w-[130px] shrink-0 px-4 items-center justify-center text-center">
                    <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{new Date(trx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* AMOUNT — hidden on mobile */}
                  <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
                    <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white tabular-nums">
                      {trx.amount > 0 ? "+" : ""}₹{Math.abs(trx.amount).toLocaleString()}
                    </span>
                  </div>

                  {/* STATUS — hidden on mobile */}
                  <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
                    <span className={cn(
                      "text-[11.5px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide",
                      isResolved ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : isPending ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}>
                      {trx.status}
                    </span>
                  </div>

                  {/* CHEVRON */}
                  <div className="w-[44px] sm:w-[56px] shrink-0 flex items-center justify-center">
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-300 text-[#a1a1aa]",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </div>

                {/* EXPANDED PANEL */}
                {isExpanded && (
                  <div className="flex flex-col sm:flex-row w-full px-5 pb-7 pt-1 gap-8 animate-in slide-in-from-top-1 fade-in duration-250">
                    
                    {/* Left: Timeline */}
                    <div className="flex-1 px-2">
                      <div className="flex items-center gap-2 mb-6">
                        <Clock className="size-4 text-[#a1a1aa]" />
                        <h2 className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Activity</h2>
                      </div>

                      <div className="relative pl-8 space-y-6">
                        {/* Vertical line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />

                        <div className="relative flex flex-col gap-1 text-left items-start">
                          <div className={cn("absolute -left-[27px] top-0.5 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10", isResolved ? "border-emerald-500" : isPending ? "border-amber-500" : "border-red-500")} />
                          <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
                            {new Date(trx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[13.5px] text-[#0a0a0a] dark:text-zinc-300 font-medium">
                            Payment confirmed
                          </span>
                        </div>
                        
                        <div className="relative flex flex-col gap-1 text-left items-start">
                          <div className="absolute -left-[27px] top-0.5 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-emerald-500" />
                          <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
                            {new Date(new Date(trx.date).getTime() - 43200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[13.5px] text-[#0a0a0a] dark:text-zinc-300 font-medium">
                            Payment received by Creonity
                          </span>
                        </div>

                        <div className="relative flex flex-col gap-1 text-left items-start">
                          <div className="absolute -left-[27px] top-0.5 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-[#a1a1aa] dark:border-[#52525b]" />
                          <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
                            {new Date(new Date(trx.date).getTime() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[13.5px] text-[#0a0a0a] dark:text-zinc-300 font-medium">
                            Payment started
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full sm:w-[320px] shrink-0 bg-transparent rounded-xl p-5 flex flex-col gap-5 border border-[#efefef] dark:border-[#27272a] text-left">
                      <h3 className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Transaction Details</h3>
                      
                      <div className="flex flex-col gap-3.5">
                        <div className="flex justify-between items-center">
                           <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Transaction ID</span>
                           <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{trx.id} (UPI)</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">From</span>
                           <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">{trx.brandOrPlatform}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">To</span>
                           <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">Creonity Wallet</span>
                        </div>
                      </div>
                      
                      <button className="flex w-full justify-center items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] rounded-xl hover:opacity-90 transition-opacity shadow-sm mt-1">
                        <FileText className="size-4 text-white dark:text-[#0a0a0a]" />
                        <span className="text-[13px] font-semibold">Download Invoice</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>

        {/* TABLE FOOTER */}
        <div className="flex flex-col sm:flex-row w-full min-h-[52px] sm:h-[52px] shrink-0 items-center justify-between px-6 py-4 sm:py-0 bg-transparent mt-auto gap-4 sm:gap-0">
          <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa] whitespace-nowrap">
            Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, data.length)} of {data.length} <span className="hidden sm:inline">transactions</span>
          </span>
          {totalPages > 1 && (
            <div className="flex items-center">
              <PaginationBar page={page} total={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
