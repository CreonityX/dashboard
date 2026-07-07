import { Typography } from "@heroui/react"
import { UpcomingPayout } from "./finance-data"
import { CalendarDays, CheckCircle2, Loader2, Landmark } from "lucide-react"

export function UpcomingPayouts({ data }: { data: UpcomingPayout[] }) {
  return (
    <div className="flex flex-col rounded-2xl p-6 border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a] w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white text-[18px]">
          Upcoming Payouts
        </Typography>
      </div>

      <div className="flex flex-col relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#e4e4e7] dark:before:via-[#27272a] before:to-transparent">
        {data.map((payout, index) => (
          <div key={payout.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active ${index !== data.length - 1 ? 'mb-8' : ''}`}>
            {/* Icon Marker */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a0a0a] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_2px_12px_rgba(0,0,0,0.08)] z-10 ${payout.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-[#18181b] text-emerald-500'}`}>
              {payout.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            
            {/* Card Content */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">{payout.brand}</span>
                <span className="text-[14px] font-bold text-emerald-500">+₹{payout.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Expected by {new Date(payout.expectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[#e4e4e7] dark:border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
            <Landmark className="w-4 h-4 text-[#737373] dark:text-[#a1a1aa]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Auto-deposit enabled</span>
            <span className="text-[11px] text-[#737373] dark:text-[#a1a1aa]">HDFC Bank ending in ••4012</span>
          </div>
        </div>
      </div>
    </div>
  )
}
