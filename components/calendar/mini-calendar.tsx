"use client"

import React from "react"
import { Calendar, Tabs } from "@heroui/react"
import { parseDate } from "@internationalized/date"

function toCalendarDateStr(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function MiniCalendar({ value, onChange }: { value: Date, onChange: (date: Date) => void }) {
  const calValue = parseDate(toCalendarDateStr(value))

  const handleChange = (newDate: any) => {
    if (!newDate) return
    const d = new Date(newDate.year, newDate.month - 1, newDate.day)
    onChange(d)
  }

  return (
    <div className="flex flex-col w-full">
      <Calendar 
        aria-label="Mini calendar" 
        value={calValue} 
        onChange={handleChange}
        className="w-full max-w-full border-none shadow-none bg-transparent p-0"
        classNames={{
          base: "w-full max-w-full",
          content: "w-full",
          headerWrapper: "w-full flex justify-end pb-2 md:justify-between md:pb-0",
          gridWrapper: "w-full max-w-full",
          grid: "w-full table-fixed",
          cell: "w-full h-12 md:h-8 text-center",
          cellButton: "w-10 h-10 md:w-8 md:h-8 text-[16px] md:text-[14px] mx-auto",
        }}
      >
        <Calendar.Header className="px-1 md:px-0">
          <Calendar.Heading className="text-[15px] hidden md:block" />
          <div className="hidden md:flex items-center gap-2 md:gap-0">
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </div>
        </Calendar.Header>
        <Calendar.Grid className="w-full">
          <Calendar.GridHeader>
            {(day) => <Calendar.HeaderCell className="text-[13px] font-semibold text-gray-400 dark:text-gray-500 pb-2 md:pb-0">{day}</Calendar.HeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>
            {(date) => <Calendar.Cell date={date} className="text-[16px] md:text-[14px] data-[outside-month=true]:text-gray-400 dark:data-[outside-month=true]:text-gray-500 text-[#0a0a0a] dark:text-gray-200" />}
          </Calendar.GridBody>
        </Calendar.Grid>
      </Calendar>
      
      {/* Mobile Month Tabs */}
      <div className="md:hidden w-full mt-2">
        <Tabs 
          className="w-full"
          selectedKey={`${value.getFullYear()}-${value.getMonth()}`}
          onSelectionChange={(key) => {
            const strKey = key.toString()
            if (strKey.startsWith("year-")) return
            const [y, m] = strKey.split("-").map(Number)
            const d = new Date(y, m, 1) // default to 1st of month to avoid overflow
            onChange(d)
          }}
        >
          <Tabs.ListContainer className="overflow-x-auto scrollbar-none w-full">
            <Tabs.List
              aria-label="Months"
              className="bg-transparent w-max flex *:h-8 *:w-fit *:px-3 *:text-sm *:font-medium *:text-[#737373] dark:*:text-[#a1a1aa] *:data-[selected=true]:text-white dark:*:data-[selected=true]:text-[#0a0a0a]"
            >
              {[value.getFullYear() - 1, value.getFullYear(), value.getFullYear() + 1].flatMap((year) => [
                <Tabs.Tab key={`year-${year}`} id={`year-${year}`} className="!text-gray-300 dark:!text-gray-600 font-bold px-1 pointer-events-none">
                  {year}
                </Tabs.Tab>,
                ...["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                  <Tabs.Tab key={`${year}-${i}`} id={`${year}-${i}`}>
                    {m}
                    <Tabs.Indicator className="bg-[#0a0a0a] dark:bg-white" />
                  </Tabs.Tab>
                ))
              ])}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>
    </div>
  )
}
