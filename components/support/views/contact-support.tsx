"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Popover, Calendar, TimeField, Label, DatePicker, DateField, FieldError, TextField, TextArea } from "@heroui/react";
import { useSupportChat } from "@/components/support/support-chat-provider";
import { PaginationBar } from "@/components/support/pagination-bar";
import { Handset, ClockArrowRotateLeft, Calendar as CalendarIcon } from "@gravity-ui/icons";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────
interface ChatMessage {
  id: number;
  role: "user" | "agent";
  text: string;
  time: string;
}

interface HistoryEntry {
  id: string;
  title: string;
  channelIcon: string | React.FC<{ className?: string }>;
  date: string;
  description: string;
  solution: string;
  assignee: { name: string; initials: string };
}

// ─── Mock History ────────────────────────────────────────────
const HISTORY: HistoryEntry[] = [
  { id: "SH-8821", title: "Cannot access dashboard", channelIcon: "gravity-ui:comment", date: "Jun 24, 2025", description: "When I log in, the dashboard just shows a white screen and loading spinner forever.", solution: "Cleared edge cache for the region and restarted the front-end serving nodes. User confirmed it works.", assignee: { name: "Sarah M.", initials: "SM" } },
  { id: "SH-8743", title: "Billing issue", channelIcon: Handset, date: "Jun 17, 2025", description: "Charged twice for the pro plan this month.", solution: "Refunded the duplicate charge and fixed the stripe webhooks processing bug.", assignee: { name: "Kate Moore", initials: "KM" } },
  { id: "SH-8601", title: "API rate limit exceeded", channelIcon: "gravity-ui:envelope", date: "Jun 10, 2025", description: "Consistently hitting the 10,000 requests/min rate limit during peak deployment windows.", solution: "Increased limit to 20,000 for production environment on their enterprise tier.", assignee: { name: "Alex Chen", initials: "AC" } },
  { id: "SH-8512", title: "Request enterprise quote", channelIcon: Calendar, date: "Jun 3, 2025", description: "Need pricing for 500+ users with SSO support.", solution: "Provided custom pricing matrix and assigned account executive.", assignee: { name: "Sales Team", initials: "ST" } },
  { id: "SH-8430", title: "Integration bug", channelIcon: "gravity-ui:comment", date: "May 28, 2025", description: "Slack integration fails to post alerts.", solution: "OAuth token had expired. Sent user instructions to re-authenticate.", assignee: { name: "Sarah M.", initials: "SM" } },
  { id: "SH-8321", title: "Feature request", channelIcon: "gravity-ui:envelope", date: "May 19, 2025", description: "Add dark mode support for embedded widgets.", solution: "Logged in product backlog. Target Q4.", assignee: { name: "Product Team", initials: "PT" } },
  { id: "SH-8200", title: "Account suspended", channelIcon: Handset, date: "May 10, 2025", description: "Account suspended for TOS violation by mistake.", solution: "Reviewed activity and removed false positive flag. Restored access.", assignee: { name: "Trust & Safety", initials: "TS" } },
];

const AGENT_REPLIES = [
  "Thanks for reaching out! I'm looking into that for you right now.",
  "Got it, I can see the issue. Let me pull up your account details.",
  "That's a great question — let me check with the team and get back to you in just a moment.",
  "I can see what's happening here. Give me one moment to apply the fix.",
  "Happy to help! Can you confirm your account email so I can take a look?",
];

type ActivePanel = "chat" | "call" | "critical" | "history";

// ─── Tab Button Group ─────────────────────────────────────────
const TABS: { id: ActivePanel; label: string; icon: string | React.FC<{ className?: string }>; danger?: boolean }[] = [
  { id: "chat", label: "Live Chat", icon: "gravity-ui:comment" },
  { id: "call", label: "Call", icon: Handset },
  { id: "critical", label: "Critical Issue", icon: "gravity-ui:triangle-exclamation-fill", danger: true },
];

// ─── Back Button (matches app pattern) ───────────────────────
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
      aria-label="Back"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </button>
  );
}

// ─── Live Chat Panel ──────────────────────────────────────────
function LiveChatPanel() {
  const { isOngoing, startChat, endChat, messages, sendMessage, setIsNativeChatMounted } = useSupportChat();
  const [input, setInput] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsNativeChatMounted(true);
    return () => setIsNativeChatMounted(false);
  }, [setIsNativeChatMounted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOngoing]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    toast.success("Message sent");
  };

  const attachOptions = [
    { icon: "gravity-ui:image", label: "Photo" },
    { icon: "gravity-ui:file", label: "Document" },
    { icon: "gravity-ui:link", label: "Link" },
  ];

  if (!isOngoing) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full animate-in fade-in duration-300">
        <div className="h-16 w-16 rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] flex items-center justify-center mb-4">
          <Icon icon="gravity-ui:comment" className="size-8 text-[#0a0a0a] dark:text-white" />
        </div>
        <h2 className="text-[20px] font-semibold text-[#0a0a0a] dark:text-white mb-2">Live Support</h2>
        <p className="text-[14px] text-[#737373] dark:text-[#a1a1aa] mb-6 max-w-xs text-center leading-relaxed">
          Connect instantly with one of our support agents. We usually reply within a few minutes.
        </p>
        <button 
          onClick={startChat}
          className="h-10 px-6 rounded-full bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-semibold transition-transform active:scale-95"
        >
          Start Live Chat
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 h-full" style={{ minHeight: 0 }}>
      {/* Agent header */}
      <div className="flex items-center justify-between border-b border-[#efefef] dark:border-[#27272a] px-5 h-[60px] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center">
              <span className="text-[12px] font-semibold text-[#0a0a0a] dark:text-white">SM</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0a0a0a] ring-1 ring-emerald-500/20" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white leading-none">Sarah M.</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-[11.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">Online · Support Agent</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={endChat} className="mr-2 px-3 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[13px] font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            End Chat
          </button>
          <button className="h-8 w-8 rounded-xl flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] hover:text-[#0a0a0a] dark:hover:text-white transition-colors" aria-label="Voice call">
            <Handset className="size-4" />
          </button>
          <button className="h-8 w-8 rounded-xl flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] hover:text-[#0a0a0a] dark:hover:text-white transition-colors" aria-label="Video call">
            <Icon icon="gravity-ui:video" className="size-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 scrollbar-none">
        {messages.map((msg) => {
          const isUser = msg.sender === "me";
          return (
            <div key={msg.id} className={cn("flex gap-4 w-full animate-in fade-in slide-in-from-bottom-1 duration-200", isUser ? "justify-end" : "justify-start")}>
              {!isUser && (
                <div className="h-8 w-8 shrink-0 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center mt-1">
                  <span className="text-[12px] font-medium text-[#0a0a0a] dark:text-white">SM</span>
                </div>
              )}
              <div className={cn("flex flex-col max-w-[85%]", isUser ? "items-end" : "items-start")}>
                <div className={cn("text-[14.5px] leading-relaxed", isUser ? "bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#0a0a0a] dark:text-white rounded-[22px] px-5 py-3" : "text-[#0a0a0a] dark:text-zinc-200 py-1.5")}>
                  {msg.kind === "text" ? msg.text : "Unsupported message type"}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Attachment popover */}
      {showAttach && (
        <div className="border-t border-[#efefef] dark:border-[#27272a] px-4 py-2 flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
          {attachOptions.map((opt) => (
            <button key={opt.label} className="flex items-center gap-2 px-3 h-8 rounded-xl bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-medium text-[#0a0a0a] dark:text-white hover:bg-[#ebebeb] dark:hover:bg-[#27272a] transition-colors">
              <Icon icon={opt.icon} className="size-4 text-[#737373] dark:text-[#a1a1aa]" />
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Reply bar */}
      <div className="shrink-0 border-t border-[#efefef] dark:border-[#27272a]">
        <div className="flex items-center h-[60px] bg-transparent transition-colors focus-within:bg-[#fafafa] dark:focus-within:bg-[#111]">
          {/* + Attach button */}
          <button
            onClick={() => setShowAttach(s => !s)}
            className={cn(
              "h-[60px] w-[52px] shrink-0 flex items-center justify-center transition-colors",
              showAttach ? "text-[#0a0a0a] dark:text-white" : "text-[#a1a1aa] hover:text-[#737373] dark:hover:text-[#a1a1aa]"
            )}
            aria-label="Attach"
          >
            <Icon icon="gravity-ui:plus" className="size-5" />
          </button>
          <input type="text" placeholder="Reply to this ticket..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1 h-full bg-transparent pr-4 text-[14px] text-[#0a0a0a] dark:text-white placeholder-[#a1a1aa] outline-none" />
          <button onClick={handleSend} className="h-[60px] w-[60px] shrink-0 flex items-center justify-center text-[#0a0a0a] dark:text-white hover:text-[#737373] dark:hover:text-[#a1a1aa] transition-colors" aria-label="Send">
            <Icon icon="gravity-ui:arrow-up" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Merged Call Panel ────────────────────────────────────────────
const PHONE_NUMBERS = [
  { label: "General Support", number: "+1 (888) 555-0192", hours: "Mon–Fri, 9am–8pm ET" },
  { label: "Billing & Payments", number: "+1 (888) 555-0147", hours: "Mon–Fri, 9am–6pm ET" },
  { label: "Enterprise & Pro Plans", number: "+1 (888) 555-0183", hours: "Mon–Sun, 24/7" },
];

function MergedCallPanel({ isCritical }: { isCritical?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);
  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(num);
    toast.success("Phone number copied");
    setTimeout(() => setCopied(null), 2000);
  };

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<{date: any, time: any, note: string}>({ date: null, time: null, note: "" });
  const [errors, setErrors] = useState<{date?: string, time?: string, note?: string}>({});

  const handleSubmit = () => {
    const newErrors: any = {};
    if (!isCritical) {
      if (!form.date) newErrors.date = "Required";
      if (!form.time) newErrors.time = "Required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
    toast.success(isCritical ? "Emergency support requested" : "Support call scheduled");
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full w-full p-10 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Icon icon="gravity-ui:circle-check-fill" className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-[17px] font-semibold text-[#0a0a0a] dark:text-white">
            {isCritical ? "Emergency request sent!" : "Call scheduled!"}
          </p>
          <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa] mt-1">
            {isCritical ? "Our team will respond within 15 minutes." : "We'll call you at the preferred time. Check your email for confirmation."}
          </p>
        </div>
        <button onClick={() => setSubmitted(false)} className="mt-2 text-[13.5px] font-medium text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Phone Numbers */}
      <div className="flex flex-col p-6 gap-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[#0a0a0a] dark:text-white">Direct Lines</h2>
          <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa] mt-1">Call us directly during business hours.</p>
        </div>
        
        <div className="flex flex-col gap-6">
          {PHONE_NUMBERS.map((entry) => (
            <div key={entry.number} className="flex flex-col gap-3 group">
              <div className="flex flex-col">
                <p className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{entry.label}</p>
                <p className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{entry.hours}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[20px] font-medium text-[#0a0a0a] dark:text-white tracking-tight mr-auto">{entry.number}</p>
                
                <button
                  onClick={() => handleCopy(entry.number)}
                  className="h-8 px-3 rounded-xl border border-[#efefef] dark:border-[#27272a] text-[12px] font-medium text-[#0a0a0a] dark:text-white hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] transition-colors flex items-center gap-1.5"
                >
                  <Icon icon={copied === entry.number ? "gravity-ui:check" : "gravity-ui:copy"} className="size-3.5" />
                  <span className="hidden sm:inline">{copied === entry.number ? "Copied" : "Copy"}</span>
                </button>
                <a
                  href={`tel:${entry.number.replace(/[^0-9+]/g, "")}`}
                  className="h-8 px-3 rounded-xl bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[12px] font-semibold hover:bg-[#1f1f1f] dark:hover:bg-[#e4e4e7] transition-colors flex items-center gap-1.5"
                >
                  <Handset className="size-3.5" />
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Request Form */}
      <div className="flex flex-col p-6 gap-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[#0a0a0a] dark:text-white">
            {isCritical ? "Emergency Request" : "Schedule a Call"}
          </h2>
          <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa] mt-1">
            {isCritical ? "Report a critical outage for immediate response." : "Pick a time and we will call you back."}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {isCritical && (
            <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
              <Icon icon="gravity-ui:triangle-exclamation-fill" className="size-4 shrink-0 mt-0.5" />
              <p className="text-[13px] leading-relaxed">
                For <strong>critical production outages</strong> only. Our on-call team will respond within <strong>15 minutes</strong>.
              </p>
            </div>
          )}

          {!isCritical && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <DatePicker
                  aria-label="Preferred date"
                  value={form.date as any}
                  onChange={(date: any) => { setForm({...form, date}); setErrors(prev => ({...prev, date: undefined})) }}
                  isRequired
                  isInvalid={!!errors.date}
                  className="w-full"
                >
                  <Label>Preferred date</Label>
                  <DateField.Group fullWidth>
                    <DateField.Input>{(segment) => <DateField.Segment segment={segment} className="text-[#0a0a0a] dark:text-white" />}</DateField.Input>
                    <DateField.Suffix>
                      <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator className="text-[#0a0a0a] dark:text-white" />
                      </DatePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>
                  <FieldError>{errors.date}</FieldError>
                  <DatePicker.Popover>
                    <Calendar aria-label="Event date">
                      <Calendar.Header>
                        <Calendar.YearPickerTrigger>
                          <Calendar.YearPickerTriggerHeading className="text-[#0a0a0a] dark:text-white" />
                          <Calendar.YearPickerTriggerIndicator className="text-[#0a0a0a] dark:text-white" />
                        </Calendar.YearPickerTrigger>
                        <Calendar.NavButton slot="previous" />
                        <Calendar.NavButton slot="next" />
                      </Calendar.Header>
                      <Calendar.Grid>
                        <Calendar.GridHeader>
                          {(day) => <Calendar.HeaderCell className="text-[#0a0a0a] dark:text-white">{day}</Calendar.HeaderCell>}
                        </Calendar.GridHeader>
                        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} className="text-[#0a0a0a] dark:text-white" />}</Calendar.GridBody>
                      </Calendar.Grid>
                      <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                          {({year}) => <Calendar.YearPickerCell year={year} className="text-[#0a0a0a] dark:text-white" />}
                        </Calendar.YearPickerGridBody>
                      </Calendar.YearPickerGrid>
                    </Calendar>
                  </DatePicker.Popover>
                </DatePicker>
              </div>
              <div>
                <TimeField
                  aria-label="Preferred time"
                  value={form.time as any}
                  onChange={(time: any) => { setForm({...form, time}); setErrors(prev => ({...prev, time: undefined})) }}
                  isRequired
                  isInvalid={!!errors.time}
                  className="w-full"
                >
                  <Label>Preferred time</Label>
                  <TimeField.Group fullWidth>
                    <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} className="text-[#0a0a0a] dark:text-white" />}</TimeField.Input>
                    <TimeField.Suffix>
                       <Icon icon="gravity-ui:clock" className="size-4 text-[#0a0a0a] dark:text-white opacity-50 mr-2" />
                    </TimeField.Suffix>
                  </TimeField.Group>
                  <FieldError>{errors.time}</FieldError>
                </TimeField>
              </div>
            </div>
          )}

          <div>
            <TextField 
              value={form.note} 
              onChange={val => setForm({ ...form, note: val })}
              className="w-full"
              aria-label={isCritical ? "Describe the issue" : "Brief description"}
            >
              <Label className="text-[13px] font-medium text-[#0a0a0a] dark:text-white mb-1.5 block">
                {isCritical ? "Describe the issue" : "Brief description"}
              </Label>
              <TextArea rows={5} placeholder={isCritical ? "Describe the production issue or security incident..." : "What would you like to discuss?"} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#0a0a0a] border border-[#e4e4e7] dark:border-[#27272a] focus-within:border-[#a1a1aa] dark:focus-within:border-[#52525b] shadow-sm text-[14px] text-[#0a0a0a] dark:text-white outline-none transition-colors resize-none" />
            </TextField>
          </div>

          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              className={cn("h-10 px-6 flex items-center gap-2 rounded-xl text-[14px] font-medium transition-colors shrink-0", isCritical ? "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20" : "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] hover:bg-[#1f1f1f] dark:hover:bg-[#e4e4e7] shadow-sm")}
            >
              <Handset className="size-4" />
              {isCritical ? "Request Emergency Support" : "Schedule Call"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact History Table ─────────────────────────────────────
function ContactHistoryTable() {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(HISTORY.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visible = HISTORY.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-full flex flex-col bg-[#f4f4f5] dark:bg-[#111111] rounded-2xl shadow-none border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden flex-1">
        
        {/* Table Header */}
        <div className="flex w-full h-[52px] shrink-0 items-center">
          <div className="w-[100px] sm:w-[130px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Ticket ID</span>
          </div>
          <div className="flex-1 min-w-0 px-4 flex items-center justify-start text-left">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Issue</span>
          </div>
          <div className="hidden sm:flex w-[160px] shrink-0 px-4 items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Date</span>
          </div>
          <div className="hidden sm:flex w-[140px] shrink-0 px-4 items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Agent</span>
          </div>
          <div className="w-[44px] sm:w-[56px] shrink-0" />
        </div>

        {/* Rows */}
        <div className="flex flex-col w-full bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden flex-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border-t border-b border-[#efefef] dark:border-[#27272a]">
          <div className="flex flex-col w-full divide-y divide-[#efefef] dark:divide-[#27272a]">
          {visible.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div 
                key={entry.id} 
                className={cn(
                  "w-full flex flex-col transition-all overflow-hidden",
                  isExpanded
                    ? "border-l-[3px] border-l-[#0a0a0a] dark:border-l-white bg-black/[0.02] dark:bg-white/[0.03]"
                    : "border-l-[3px] border-l-transparent hover:bg-black/[0.025] dark:hover:bg-white/[0.03] cursor-pointer"
                )}
              >
                {/* COLLAPSED ROW */}
                <div 
                  className="flex w-full items-center min-h-[64px] cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  <div className="w-[100px] sm:w-[130px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center gap-2">
                    <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white tabular-nums">{entry.id}</span>
                  </div>
                  <div className="flex-1 min-w-0 px-4 flex items-center justify-start text-left gap-2.5 py-3">
                    {typeof entry.channelIcon === "string" ? (
                      <Icon icon={entry.channelIcon} className="size-4 text-[#737373] dark:text-[#a1a1aa] shrink-0" />
                    ) : (
                      <entry.channelIcon className="size-4 text-[#737373] dark:text-[#a1a1aa] shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0 text-center sm:text-left items-center sm:items-start">
                      <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate leading-snug">{entry.title}</span>
                      {/* Mobile-only date & agent */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 sm:hidden">
                        <span className="text-[11px] text-[#a1a1aa]">{entry.date}</span>
                        <div className="flex items-center gap-1 bg-[#f4f4f5] dark:bg-[#1f1f1f] px-1.5 py-0.5 rounded-full">
                           <span className="text-[9px] font-bold text-[#0a0a0a] dark:text-white">{entry.assignee.initials}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex w-[160px] shrink-0 px-4 items-center justify-center text-center">
                    <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{entry.date}</span>
                  </div>
                  <div className="hidden sm:flex w-[140px] shrink-0 px-4 items-center justify-center text-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-medium text-[#0a0a0a] dark:text-white">{entry.assignee.initials}</span>
                    </div>
                    <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa] truncate">{entry.assignee.name}</span>
                  </div>
                  
                  {/* CHEVRON */}
                  <div className="w-[44px] sm:w-[56px] shrink-0 flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                      className={cn(
                        "transition-transform duration-300 text-[#a1a1aa]",
                        isExpanded && "rotate-180"
                      )}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>

                {/* EXPANDED PANEL */}
                {isExpanded && (
                  <div className="flex flex-col w-full px-5 sm:px-7 pb-7 pt-1 animate-in slide-in-from-top-1 fade-in duration-250 text-left">
                    {/* Description block */}
                    <div className="bg-[#f4f4f5] dark:bg-[#1f1f1f] rounded-xl p-4 mb-6 text-left">
                      <p className="text-[14px] text-[#0a0a0a] dark:text-zinc-300 leading-relaxed text-left">
                        {entry.description}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="px-2">
                      <div className="flex items-center gap-2 mb-5">
                        <ClockArrowRotateLeft className="size-4 text-[#a1a1aa]" />
                        <h2 className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Activity</h2>
                      </div>

                      <div className="relative pl-10 space-y-6">
                        {/* Vertical line */}
                        <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />

                        <div className="relative flex flex-col gap-1">
                          <div className="absolute -left-[30px] top-0.5 h-3 w-3 rounded-full border-[2.5px] border-emerald-500 bg-white dark:bg-[#0a0a0a] z-10" />
                          <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
                            Solution provided by {entry.assignee.name}
                          </span>
                          <span className="text-[13.5px] text-[#0a0a0a] dark:text-zinc-300">
                            {entry.solution}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>

        {/* Pagination inside table container */}
        <div className="flex w-full h-[52px] shrink-0 items-center justify-between px-6 bg-transparent mt-auto">
          <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa]">
            Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, HISTORY.length)} of {HISTORY.length} tickets
          </span>
          {totalPages > 1 && (
            <div className="flex items-center">
              <PaginationBar page={page} total={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────
export function ContactSupportView({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<ActivePanel>("chat");

  return (
    <div className={cn("flex flex-col gap-6 pb-20 pt-6", activeTab === "chat" ? "h-full overflow-hidden" : "min-h-full")}>
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        {onBack && (
          <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a0a0a] dark:text-white">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white shrink-0">
          Contact Support
        </h1>
      </div>

      {/* Tab Button Group */}
      <div className="flex w-full items-center justify-between gap-3 pb-2 -mb-2">
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center rounded-xl bg-[#f4f4f5] dark:bg-[#111111] border border-[#efefef] dark:border-[#27272a] w-max shrink-0 overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 h-[34px] px-4 text-[13px] font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? tab.danger
                      ? "bg-red-500 text-white"
                      : "bg-white dark:bg-[#27272a] text-[#0a0a0a] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                    : tab.danger
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    : "text-[#737373] dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#0a0a0a] dark:hover:text-white"
                )}
              >
                {typeof tab.icon === "string" ? (
                  <Icon icon={tab.icon} className="size-4 shrink-0" />
                ) : (
                  <tab.icon className="size-4 shrink-0" />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* New History Button */}
        <div className="flex items-center rounded-xl bg-[#f4f4f5] dark:bg-[#111111] border border-[#efefef] dark:border-[#27272a] shrink-0 overflow-hidden">
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center justify-center gap-2 h-[34px] w-[34px] sm:w-auto px-0 sm:px-4 text-[13px] font-medium transition-all whitespace-nowrap",
              activeTab === "history" 
                ? "bg-white dark:bg-[#27272a] text-[#0a0a0a] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                : "text-[#737373] dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#0a0a0a] dark:hover:text-white"
            )}
            aria-label="History"
          >
            <ClockArrowRotateLeft className="size-4 shrink-0" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "history" && <ContactHistoryTable />}
      
      {activeTab === "chat" && (
        <div className="flex flex-1 min-h-0 overflow-hidden rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] shadow-[0_2px_12px_rgba(0,0,0,0.04)] animate-in fade-in duration-300">
          <div className="flex-1 min-w-0 flex flex-col relative h-full overflow-hidden">
            <LiveChatPanel />
          </div>
        </div>
      )}

      {activeTab === "call" && <MergedCallPanel />}

      {activeTab === "critical" && <MergedCallPanel isCritical />}
    </div>
  );
}
