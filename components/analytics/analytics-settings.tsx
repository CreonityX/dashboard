import { Typography } from "@heroui/react"
import { Switch } from "@heroui/react"

export function AnalyticsSettings() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl p-6 rounded-2xl border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex flex-col gap-1 mb-2">
        <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white text-[18px]">
          Reporting & Export Settings
        </Typography>
        <p className="text-[14px] text-[#737373] dark:text-[#a1a1aa]">Configure automated reports and dashboard defaults.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Scheduled Reports</h3>
            <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Receive automated analytics summaries via email.</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-0 border border-[#efefef] dark:border-[#27272a] rounded-xl overflow-hidden bg-white dark:bg-[#111111]">
          <div className="flex items-center justify-between p-4 border-b border-[#efefef] dark:border-[#27272a]">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Weekly Digest</span>
              <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">A quick summary of your performance sent every Monday.</span>
            </div>
            <Switch defaultSelected color="success" size="sm" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Monthly Comprehensive</span>
              <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">A detailed breakdown of audience growth and earnings.</span>
            </div>
            <Switch defaultSelected color="success" size="sm" />
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-4">
          <h3 className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Dashboard Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa] uppercase tracking-wider">Default Date Range</label>
              <select defaultValue="30d" className="bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-medium text-[#0a0a0a] dark:text-white rounded-lg h-10 px-3 outline-none cursor-pointer">
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa] uppercase tracking-wider">Preferred Export Format</label>
              <select defaultValue="csv" className="bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-medium text-[#0a0a0a] dark:text-white rounded-lg h-10 px-3 outline-none cursor-pointer">
                <option value="csv">CSV Document</option>
                <option value="pdf">PDF Report</option>
                <option value="xlsx">Excel (XLSX)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
