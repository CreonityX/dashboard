"use client"

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"
import { Icon } from "@iconify/react"
import { Switch, Dropdown } from "@heroui/react"
import { cn } from "@/lib/utils"

type SettingsPageProps = {
  title: string
  description?: string
  onBack?: () => void
  action?: ReactNode
  children: ReactNode
  size?: "normal" | "wide"
}

export function SettingsPage({ title, description, onBack, action, children, size = "normal" }: SettingsPageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500",
        size === "wide" ? "max-w-[1120px]" : "max-w-5xl"
      )}
    >
      <SettingsHeader title={title} description={description} onBack={onBack} action={action} />
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  )
}

export function SettingsHeader({
  title,
  description,
  onBack,
  action,
}: {
  title: string
  description?: string
  onBack?: () => void
  action?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="-ml-1.5 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
            aria-label="Back to settings"
          >
            <Icon icon="gravity-ui:chevron-left" className="size-5 text-[#0a0a0a] dark:text-white" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function SettingsSection({
  title,
  description,
  children,
}: {
  title?: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 max-w-3xl">
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title ? <h2 className="text-[16px] font-semibold tracking-tight text-[#0a0a0a] dark:text-white">{title}</h2> : null}
          {description ? <p className="text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  )
}

export function SettingsCard({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode
  className?: string
  tone?: "default" | "soft" | "danger" | "info"
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        tone === "default" && "border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111]",
        tone === "soft" && "border-[#e4e4e7] bg-[#fafafa] dark:border-[#27272a] dark:bg-[#111111]",
        tone === "danger" && "border-rose-200 bg-rose-50/60 dark:border-rose-500/25 dark:bg-rose-950/20",
        tone === "info" && "border-sky-200 bg-sky-50/70 dark:border-sky-500/25 dark:bg-sky-950/20",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SettingsRow({
  icon,
  title,
  description,
  meta,
  action,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-2xl border border-[#e4e4e7] bg-white p-4 dark:border-[#27272a] dark:bg-[#111111]", className)}>
      <div className="flex min-w-0 items-center gap-3.5">
        {icon ? <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f4f4f5] text-[#0a0a0a] dark:bg-[#1f1f1f] dark:text-white">{icon}</div> : null}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{title}{meta}</div>
          {description ? <div className="mt-0.5 text-[13px] leading-5 text-[#71717a] dark:text-[#a1a1aa]">{description}</div> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function SettingsField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]">{label}</span>
      {children}
    </label>
  )
}

const fieldClass =
  "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white disabled:cursor-not-allowed disabled:opacity-70"

export function SettingsInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />
}

export function SettingsSelect({ className, options, value, onChange }: { className?: string, options: string[], value: string, onChange: (val: string) => void }) {
  return (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <button type="button" className={cn(fieldClass, "flex items-center justify-between cursor-pointer outline-none bg-transparent appearance-none", className)}>
          {value}
          <Icon icon="gravity-ui:chevron-down" className="size-4 text-[#a1a1aa] shrink-0 ml-2" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-[160px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]">
        <Dropdown.Menu
          aria-label="Options"
          className="p-1"
          onAction={(key) => onChange(key as string)}
          selectedKeys={new Set([value])}
          selectionMode="single"
        >
          {options.map((opt) => (
            <Dropdown.Item key={opt} textValue={opt} className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-white/10">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-[13px] text-[#0a0a0a] dark:text-white">{opt}</span>
                {value === opt && <Icon icon="gravity-ui:check" className="size-3.5 text-[#0a0a0a] dark:text-white" />}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export function SettingsTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, "min-h-[104px] resize-y py-3 leading-6", className)}
      {...props}
    />
  )
}

export function SettingsSwitchRow({
  title,
  description,
  defaultSelected,
  tone,
}: {
  title: string
  description?: string
  defaultSelected?: boolean
  tone?: "default" | "danger"
}) {
  return (
    <SettingsRow
      className={tone === "danger" ? "border-rose-200 bg-rose-50/50 dark:border-rose-500/25 dark:bg-rose-950/20" : undefined}
      title={title}
      description={description}
      action={<Switch defaultSelected={defaultSelected} size="sm" color={tone === "danger" ? "danger" : "success"} />}
    />
  )
}

export function SettingsBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "success" | "warning" | "danger" | "info"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider",
        tone === "neutral" && "bg-[#f4f4f5] text-[#71717a] dark:bg-[#27272a] dark:text-[#d4d4d8]",
        tone === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        tone === "warning" && "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
        tone === "danger" && "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
        tone === "info" && "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
      )}
    >
      {children}
    </span>
  )
}

export function SettingsActionButton({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" | "dangerSoft" }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-[#0a0a0a] text-white hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90",
        variant === "secondary" && "border border-[#e4e4e7] bg-white text-[#0a0a0a] hover:bg-[#fafafa] dark:border-[#27272a] dark:bg-[#111111] dark:text-white dark:hover:bg-[#1f1f1f]",
        variant === "ghost" && "text-[#0a0a0a] hover:bg-[#f4f4f5] dark:text-white dark:hover:bg-[#1f1f1f]",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700",
        variant === "dangerSoft" && "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20",
        className
      )}
      {...props}
    />
  )
}
