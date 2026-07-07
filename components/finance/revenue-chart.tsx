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

export function RevenueChart({ data }: { data: RevenueSeries[] }) {
  return (
    <div className="flex flex-col rounded-2xl p-6 border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a] relative overflow-hidden w-full h-[340px]">
      <div className="flex items-center gap-2 mb-6 z-10 relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#a1a1aa] dark:text-[#737373]">
          <line x1="12" x2="12" y1="20" y2="10"/>
          <line x1="18" x2="18" y1="20" y2="4"/>
          <line x1="6" x2="6" y1="20" y2="16"/>
        </svg>
        <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">
          Revenue Over Time
        </Typography>
      </div>

      <div className="flex-1 w-full h-full relative z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
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
            <Area type="monotone" dataKey="campaigns" stackId="1" stroke="#84cc16" strokeWidth={2.5} fill="url(#colorCampaigns)" />
            <Area type="monotone" dataKey="platform" stackId="1" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#colorPlatform)" />
            <Area type="monotone" dataKey="affiliates" stackId="1" stroke="#e1306c" strokeWidth={2.5} fill="url(#colorAffiliates)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
