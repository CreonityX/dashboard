"use client"

import { Icon } from "@iconify/react"
import { Typography } from "@heroui/react"
import { cn } from "@/lib/utils"
import { CalendarEvent, EVENT_TYPE_CONFIG, PLATFORM_CONFIG, formatTime } from "@/lib/calendar-data"

interface EventChipProps {
  event: CalendarEvent
  variant: "chip" | "block" | "row"
  onClick?: () => void
}

export function EventChip({ event, variant, onClick }: EventChipProps) {
  const config = EVENT_TYPE_CONFIG[event.type]
  const platformCfg = event.platform ? PLATFORM_CONFIG[event.platform] : null

  if (variant === "chip") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs cursor-pointer select-none overflow-hidden",
          "border transition-opacity hover:opacity-80",
          config.bg,
          config.border,
          config.darkBg,
          config.darkBorder,
          event.completed && "opacity-50"
        )}
        style={{ borderLeft: `3px solid ${config.color}` }}
      >
        {platformCfg && (
          <Icon icon={platformCfg.iconId} className="w-3.5 h-3.5 shrink-0" />
        )}
        <span
          className={cn(
            "truncate font-medium leading-tight",
            event.completed && "line-through"
          )}
          style={{ color: config.color }}
        >
          {event.title}
        </span>
      </div>
    )
  }

  if (variant === "block") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "absolute inset-x-0.5 rounded-lg px-2 py-1.5 cursor-pointer overflow-hidden",
          "border transition-opacity hover:opacity-80",
          config.bg,
          config.border,
          config.darkBg,
          config.darkBorder,
          event.completed && "opacity-50"
        )}
        style={{ borderLeft: `3px solid ${config.color}` }}
      >
        <p
          className={cn(
            "text-xs font-semibold leading-tight truncate",
            event.completed && "line-through"
          )}
          style={{ color: config.color }}
        >
          {event.title}
        </p>
        {event.startTime && (
          <Typography type="body-xs" className="text-gray-500 dark:text-gray-400 mt-0.5">
            {formatTime(event.startTime)}
            {event.endTime && ` \u2013 ${formatTime(event.endTime)}`}
          </Typography>
        )}
        {event.brand && (
          <Typography type="body-xs" className="text-gray-400 truncate">{event.brand}</Typography>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer",
        "border transition-all hover:opacity-80 hover:shadow-sm",
        config.bg,
        config.border,
        config.darkBg,
        config.darkBorder,
        event.completed && "opacity-50"
      )}
      style={{ borderLeft: `3px solid ${config.color}` }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: config.color }}
      />
      <Typography type="body-xs"
        className="font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0"
        style={{ color: config.color, backgroundColor: `${config.color}18` }}
      >
        {config.label}
      </Typography>
      {platformCfg && (
        <Icon icon={platformCfg.iconId} className="w-3.5 h-3.5 shrink-0" />
      )}
      <span
        className={cn(
          "flex-1 text-sm font-medium truncate",
          event.completed && "line-through"
        )}
      >
        {event.title}
      </span>
      {event.startTime && (
        <span className="text-xs text-gray-400 shrink-0">
          {formatTime(event.startTime)}
          {event.endTime && ` \u2013 ${formatTime(event.endTime)}`}
        </span>
      )}
      {event.brand && (
        <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
          {event.brand}
        </span>
      )}
    </div>
  )
}
