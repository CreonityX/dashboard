import { Typography } from "@heroui/react"
import { TaxData } from "./finance-data"
import { FileDown, FileWarning, Receipt } from "lucide-react"

export function TaxCompliance({ data }: { data: TaxData }) {
  return (
    <div className="flex flex-col rounded-2xl p-6 border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a] w-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
          <Receipt className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white text-[16px] leading-tight">
            Tax & Compliance
          </Typography>
          <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa] font-medium">FY {data.year} - {data.year + 1}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-[#e4e4e7] dark:border-[#27272a]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-semibold text-[#737373] dark:text-[#a1a1aa]">Estimated Tax Deducted (TDS)</span>
          </div>
          <span className="text-[24px] font-bold text-[#0a0a0a] dark:text-white tracking-tight">
            ₹{data.estimatedTax.toLocaleString()}
          </span>
          <p className="text-[12px] text-[#737373] dark:text-[#a1a1aa] mt-2 flex items-start gap-1.5">
            <FileWarning className="w-4 h-4 shrink-0 text-amber-500" />
            Tax is estimated based on completed campaigns and is subject to your final tax filing.
          </p>
        </div>

        <button 
          disabled={!data.taxFormsAvailable}
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
            data.taxFormsAvailable 
              ? "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] hover:bg-black/80 dark:hover:bg-white/90 shadow-sm" 
              : "bg-gray-100 dark:bg-white/5 text-[#a1a1aa] dark:text-[#737373] cursor-not-allowed"
          }`}
        >
          <FileDown className="w-4 h-4" />
          {data.taxFormsAvailable ? "Download Form 16A" : "Form 16A Not Ready Yet"}
        </button>
      </div>
    </div>
  )
}
