import { Typography } from "@heroui/react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { RevenueSeries } from "./finance-data"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[150px] z-[100] relative">
        <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white mb-1 border-b border-gray-100 dark:border-white/10 pb-1">{label}</span>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] capitalize">{entry.name}</span>
            </div>
            <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">
              ₹{(entry.value / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

import { useAccount } from "@/context/account-context"
import { useState } from "react"

const brandChartData = [
  { month: "Jan", spend: 40000, attributed: 45000 },
  { month: "Feb", spend: 35000, attributed: 42000 },
  { month: "Mar", spend: 50000, attributed: 68000 },
  { month: "Apr", spend: 48000, attributed: 75000 },
  { month: "May", spend: 60000, attributed: 95000 },
  { month: "Jun", spend: 55000, attributed: 110000 },
  { month: "Jul", spend: 70000, attributed: 140000 },
]

export function RevenueChart({ data }: { data: RevenueSeries[] }) {
  const { isBrand } = useAccount()
  const [isSecondaryView, setIsSecondaryView] = useState(false) // For toggle if needed

  return (
    <div className="flex flex-col rounded-2xl p-6 border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a] relative overflow-hidden w-full h-[340px]">
      <div className="flex items-center justify-between mb-6 z-10 relative">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#a1a1aa] dark:text-[#737373]">
            <line x1="12" x2="12" y1="20" y2="10"/>
            <line x1="18" x2="18" y1="20" y2="4"/>
            <line x1="6" x2="6" y1="20" y2="16"/>
          </svg>
          <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">
            {isBrand ? "Spend vs ROI" : "Revenue Over Time"}
          </Typography>
        </div>
        
        {isBrand && (
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 p-1 rounded-lg">
            <button 
              onClick={() => setIsSecondaryView(false)}
              className={cn("text-[11px] font-bold px-2 py-1 rounded-md transition-colors", !isSecondaryView ? "bg-white dark:bg-[#27272a] shadow-sm text-[#0a0a0a] dark:text-white" : "text-[#737373] hover:text-[#0a0a0a] dark:hover:text-white")}
            >
              Spend vs ROI
            </button>
            <button 
              onClick={() => setIsSecondaryView(true)}
              className={cn("text-[11px] font-bold px-2 py-1 rounded-md transition-colors", isSecondaryView ? "bg-white dark:bg-[#27272a] shadow-sm text-[#0a0a0a] dark:text-white" : "text-[#737373] hover:text-[#0a0a0a] dark:hover:text-white")}
            >
              Budget vs Paid
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 w-full h-full relative z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={isBrand ? brandChartData : data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              {/* Creator Gradients */}
              <linearGradient id="colorCampaigns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAffiliates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e1306c" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e1306c" stopOpacity={0}/>
              </linearGradient>
              
              {/* Brand Gradients */}
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAttributed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a1a1aa', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            {isBrand ? (
              <>
                <Area type="monotone" dataKey={isSecondaryView ? "spend" : "spend"} name="Spend" stackId="1" stroke="#f97316" strokeWidth={2.5} fill="url(#colorSpend)" />
                <Area type="monotone" dataKey={isSecondaryView ? "attributed" : "attributed"} name={isSecondaryView ? "Budget" : "ROI Value"} stackId="1" stroke="#10b981" strokeWidth={2.5} fill="url(#colorAttributed)" />
              </>
            ) : (
              <>
                <Area type="monotone" dataKey="campaigns" stackId="1" stroke="#84cc16" strokeWidth={2.5} fill="url(#colorCampaigns)" />
                <Area type="monotone" dataKey="platform" stackId="1" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#colorPlatform)" />
                <Area type="monotone" dataKey="affiliates" stackId="1" stroke="#e1306c" strokeWidth={2.5} fill="url(#colorAffiliates)" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
