"use client"

import { useState } from "react"
import { 
  Button, 
  Tooltip, 
  Popover, 
  Form, 
  DatePicker, 
  DateField, 
  Calendar as HeroCalendar, 
  Label, 
  TimeField 
} from "@heroui/react"
import { Handset, Video, Calendar, CircleInfo, Headphones, Clock } from "@gravity-ui/icons"
import { getLocalTimeZone, today } from "@internationalized/date"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import { toast } from "@heroui/react"
import type { Conversation } from "@/lib/messages-data"

function Action({
  label,
  children,
  onPress,
}: {
  label: string
  children: React.ReactNode
  onPress?: () => void
}) {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button isIconOnly variant="ghost" aria-label={label} onPress={onPress} className="text-[#0a0a0a] dark:text-white">
          {children}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip>
  )
}

function ScheduleAction() {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<any>(null)
  const [time, setTime] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsOpen(false)
      setDate(null)
      setTime(null)
      toast.success("Call scheduled successfully", {
        description: `Your call is set for ${date.toString()} at ${time.toString()}`
      })
    }, 800)
  }

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom end">
      <Popover.Trigger>
        <Button isIconOnly variant="ghost" aria-label="Schedule call" className="text-[#0a0a0a] dark:text-white">
          <Calendar className="h-[22px] w-[22px]" />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="p-4 w-[320px]">
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1 w-full text-left">
            <h3 className="font-semibold text-[15px]">Schedule a Call</h3>
            <p className="text-xs text-muted-foreground">Set up a time to chat with this contact.</p>
          </div>
          <DatePicker
            isRequired
            name="date"
            value={date}
            onChange={setDate}
            minValue={today(getLocalTimeZone())}
          >
            <Label className="text-sm font-medium">Date</Label>
            <DateField.Group fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
              <HeroCalendar aria-label="Event date">
                <HeroCalendar.Header>
                  <HeroCalendar.YearPickerTrigger>
                    <HeroCalendar.YearPickerTriggerHeading />
                    <HeroCalendar.YearPickerTriggerIndicator />
                  </HeroCalendar.YearPickerTrigger>
                  <HeroCalendar.NavButton slot="previous" />
                  <HeroCalendar.NavButton slot="next" />
                </HeroCalendar.Header>
                <HeroCalendar.Grid>
                  <HeroCalendar.GridHeader>
                    {(day) => <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>}
                  </HeroCalendar.GridHeader>
                  <HeroCalendar.GridBody>{(d) => <HeroCalendar.Cell date={d} />}</HeroCalendar.GridBody>
                </HeroCalendar.Grid>
                <HeroCalendar.YearPickerGrid>
                  <HeroCalendar.YearPickerGridBody>
                    {({year}) => <HeroCalendar.YearPickerCell year={year} />}
                  </HeroCalendar.YearPickerGridBody>
                </HeroCalendar.YearPickerGrid>
              </HeroCalendar>
            </DatePicker.Popover>
          </DatePicker>
          <TimeField isRequired name="time" value={time} onChange={setTime}>
            <Label className="text-sm font-medium">Time</Label>
            <TimeField.Group fullWidth>
              <TimeField.Prefix>
                <Clock className="h-4 w-4 text-muted-foreground ml-1" />
              </TimeField.Prefix>
              <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
            </TimeField.Group>
          </TimeField>
          <Button 
            type="submit" 
            variant="solid" 
            color="primary" 
            className="w-full mt-2"
            isDisabled={!date || !time}
            isPending={isSubmitting}
          >
            Confirm Schedule
          </Button>
        </Form>
      </Popover.Content>
    </Popover>
  )
}

export function ChatHeader({
  conversation,
  activeChannelId,
  onToggleInfo,
  onBack,
}: {
  conversation: Conversation
  activeChannelId?: string
  onToggleInfo: () => void
  onBack?: () => void
}) {
  const activeChannel = activeChannelId && conversation.channels 
    ? conversation.channels.find(ch => ch.id === activeChannelId) 
    : null

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#efefef] bg-white px-2 md:px-5 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex flex-1 min-w-0 items-center gap-2 md:gap-3">
        {onBack && (
          <Button isIconOnly variant="ghost" aria-label="Back" onPress={onBack} className="md:hidden shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>
        )}
        <div className="relative shrink-0">
          <GradientAvatar
            tone={conversation.tone}
            verified={!activeChannel ? conversation.verified : undefined}
            online={!activeChannel ? conversation.online : undefined}
            isCommunity={!activeChannel && conversation.type === "community"}
            className="h-11 w-11"
          />
          {activeChannel && (
            <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-[6px] bg-white dark:bg-[#0a0a0a]">
              <GradientAvatar tone={conversation.tone} isCommunity className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[16px] font-bold text-[#0a0a0a] dark:text-white">
              {activeChannel ? `# ${activeChannel.name}` : conversation.name}
            </span>
            {conversation.headset && !activeChannel && <Headphones className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />}
          </div>
          <span className="block truncate text-[13px] text-[#737373] dark:text-[#a1a1aa]">
            {activeChannel
              ? conversation.name
              : conversation.representative
                ? `Speaking with ${conversation.representative.name} (${conversation.representative.role})`
                : conversation.online
                  ? "Active now"
                  : conversation.handle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Action label="Voice call" onPress={() => toast.info("Coming Soon", { description: "Voice calls are not yet available." })}>
          <Handset className="h-[22px] w-[22px]" />
        </Action>
        <Action label="Video meeting" onPress={() => toast.info("Coming Soon", { description: "Video meetings are not yet available." })}>
          <Video className="h-[22px] w-[22px]" />
        </Action>
        <ScheduleAction />
        <Action label="Details" onPress={onToggleInfo}>
          <CircleInfo className="h-[22px] w-[22px]" />
        </Action>
      </div>
    </header>
  )
}
