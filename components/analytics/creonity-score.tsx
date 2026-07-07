"use client"

import { Typography } from "@heroui/react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Target } from "@gravity-ui/icons"

export function CreonityScore({ scoreData }: { scoreData: Array<{ metric: string, score: number }> }) {
  const overallScore = Math.round(scoreData.reduce((acc, curr) => acc + curr.score, 0) / scoreData.length);

  return (
    <div className="sm:col-span-1 flex flex-col rounded-2xl p-6 border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a] relative overflow-hidden aspect-square sm:aspect-auto min-h-[300px] sm:min-h-0 h-auto sm:h-full">
      <div className="flex items-center gap-2 mb-2 z-10 relative">
        <Target className="text-[#a1a1aa] dark:text-[#737373] size-5" />
        <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">
          Creonity Score
        </Typography>
      </div>

      <div className="relative w-full flex-1 mt-2 z-10 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scoreData}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            <PolarGrid stroke="#e4e4e7" className="dark:stroke-[#27272a]" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: '#737373', fontSize: 11, fontWeight: 500 }} 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0a0a0a] dark:bg-white px-2.5 py-1 rounded-[8px] shadow-lg">
                      <span className="text-[14px] font-bold text-white dark:text-[#0a0a0a]">
                        {payload[0].value}
                      </span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#scoreGradient)"
              isAnimationActive={true}
            />
            
            {/* SVG Text Cutout for Central Score */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-[56px] font-black stroke-white dark:stroke-[#0a0a0a] fill-transparent pointer-events-none" strokeWidth="8" strokeLinejoin="round">
              {overallScore}
            </text>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-[56px] font-black fill-[#0a0a0a] dark:fill-white pointer-events-none">
              {overallScore}
            </text>
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0ea5e9]/5 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
