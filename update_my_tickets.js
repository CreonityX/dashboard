const fs = require('fs');
const path = require('path');

const content = `"use client";

import { Avatar, Chip, Popover, PopoverTrigger, PopoverContent, ListBox, Button, TextField, Label, Input, TextArea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { PaginationBar } from "@/components/support/pagination-bar";
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type TimelineEventType = "comment" | "system";

export interface TimelineEvent {
  id: number;
  type: TimelineEventType;
  
  // For comments
  author?: string;
  role?: "user" | "agent";
  text?: ReactNode;
  avatar?: string;
  attachment?: { name: string; size: string };
  
  // For system events
  icon?: string;
  iconColor?: string;
  iconBg?: string;

  time: string;
}

interface Ticket {
  id: number;
  subject: string;
  description: string;
  departmentEmail: string;
  category: string;
  assignee: { name: string; avatar: string; email: string };
  status: "Open" | "Pending" | "Resolved";
  date: string;
  timeline: TimelineEvent[];
}

const statusColorMap: Record<string, "success" | "warning" | "default"> = {
  Resolved: "success",
  Pending: "warning",
  Open: "default",
};

const statusBorderMap: Record<string, string> = {
  Open: "border-l-blue-500",
  Pending: "border-l-amber-500",
  Resolved: "border-l-emerald-500",
};

const TICKETS: Ticket[] = [
  {
    id: 10458,
    subject: "API Rate Limit Exceeded",
    description:
      "We are consistently hitting the 10,000 requests/min rate limit during peak deployment windows. This is blocking our CI/CD pipeline from completing successfully. We need this increased to at least 20,000 requests/min for our production environment.",
    departmentEmail: "support@creonity.com",
    category: "Technical Support",
    assignee: {
      name: "Nora Vazquez",
      avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
      email: "nora@creonity.com",
    },
    status: "Open",
    date: "Today, 10:45 AM",
    timeline: [
      {
        id: 5,
        type: "comment",
        author: "Nora Vazquez",
        role: "agent",
        avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
        text: "Confirmed the delay is isolated to scheduled exports. API requests and dashboard reads are healthy while the backlog drains.",
        attachment: { name: "worker-trace.har", size: "42 KB" },
        time: "2:28 AM",
      },
      {
        id: 4,
        type: "system",
        text: <>Escalation acknowledged by <span className="font-medium text-[#0a0a0a] dark:text-white">Kaito Reed</span></>,
        icon: "gravity-ui:bolt",
        iconColor: "text-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-500/20",
        time: "2:24 AM",
      },
      {
        id: 3,
        type: "system",
        text: <>Incident channel joined by <span className="font-medium text-[#0a0a0a] dark:text-white">Mira Stone</span></>,
        icon: "gravity-ui:person",
        iconColor: "text-[#71717a] dark:text-[#a1a1aa]",
        iconBg: "bg-[#f4f4f5] dark:bg-[#27272a]",
        time: "2:23 AM",
      },
      {
        id: 2,
        type: "system",
        text: <>Customer update sent to <span className="font-medium text-[#0a0a0a] dark:text-white">finance-ops</span></>,
        icon: "gravity-ui:envelope",
        iconColor: "text-[#71717a] dark:text-[#a1a1aa]",
        iconBg: "bg-[#f4f4f5] dark:bg-[#27272a]",
        time: "2:21 AM",
      },
      {
        id: 1,
        type: "system",
        text: <>Mitigation deployed to <span className="font-medium text-[#0a0a0a] dark:text-white">export-worker-3</span></>,
        icon: "gravity-ui:circle-check-fill",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
        time: "2:18 AM",
      },
      {
        id: 0,
        type: "system",
        text: <><span className="font-medium text-[#0a0a0a] dark:text-white">Postmortem reminder</span> scheduled</>,
        icon: "gravity-ui:clock",
        iconColor: "text-[#71717a] dark:text-[#a1a1aa]",
        iconBg: "bg-transparent",
        time: "2:14 AM",
      }
    ],
  },
  {
    id: 10457,
    subject: "Billing Issue on Pro Plan",
    description:
      "I upgraded from Starter to Pro on June 14th but was charged the full Pro monthly amount instead of a prorated charge for the remaining days of the billing cycle. The invoice shows $99 but I expected approximately $52.",
    departmentEmail: "billing@creonity.com",
    category: "Account & Billing",
    assignee: {
      name: "Sara Johnson",
      avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
      email: "sara@creonity.com",
    },
    status: "Pending",
    date: "Yesterday, 2:30 PM",
    timeline: [
      {
        id: 1,
        type: "comment",
        author: "You",
        role: "user",
        text: "I upgraded to Pro on the 14th but was charged the full month instead of a prorated amount. Invoice #INV-2026-0614.",
        time: "Yesterday, 2:30 PM",
      },
      {
        id: 0,
        type: "system",
        text: <>Assigned to <span className="font-medium text-[#0a0a0a] dark:text-white">Sara Johnson</span></>,
        icon: "gravity-ui:person",
        iconColor: "text-[#71717a] dark:text-[#a1a1aa]",
        iconBg: "bg-[#f4f4f5] dark:bg-[#27272a]",
        time: "Yesterday, 3:00 PM",
      }
    ]
  },
  {
    id: 10456,
    subject: "Cannot access Analytics Dashboard",
    description:
      "Getting a 403 Forbidden error when navigating to the main analytics dashboard. The error appears immediately after login and affects all team members on my workspace. The REST API still works fine.",
    departmentEmail: "bugs@creonity.com",
    category: "Bug Report",
    assignee: {
      name: "John Smith",
      avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
      email: "john@creonity.com",
    },
    status: "Resolved",
    date: "Jun 24, 2026",
    timeline: [
      {
        id: 1,
        type: "system",
        text: <>Status changed to <span className="font-medium text-emerald-500">Resolved</span></>,
        icon: "gravity-ui:circle-check-fill",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
        time: "Jun 24, 4:00 PM",
      },
      {
        id: 0,
        type: "system",
        text: <>Fix deployed to <span className="font-medium text-[#0a0a0a] dark:text-white">production</span></>,
        icon: "gravity-ui:bolt",
        iconColor: "text-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-500/20",
        time: "Jun 24, 2:10 PM",
      }
    ]
  }
];

export function MyTicketsView({ onBack }: { onBack?: () => void }) {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", category: "" });
  const [typingTickets, setTypingTickets] = useState<Record<number, boolean>>({});

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

  const nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 10001;

  const handleReply = (ticketId: number) => {
    if (!replyText.trim()) return;
    
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const nextTimeId = t.timeline.length > 0 ? Math.max(...t.timeline.map(x => x.id)) + 1 : 1;
        return {
          ...t,
          timeline: [
            {
              id: nextTimeId,
              type: "comment",
              author: "You",
              role: "user",
              text: replyText,
              time: "Just now"
            },
            ...t.timeline
          ]
        };
      }
      return t;
    }));
    setReplyText("");
    toast.success("Reply posted");
    
    // Simulate agent typing
    setTypingTickets(prev => ({ ...prev, [ticketId]: true }));
    setTimeout(() => {
      setTypingTickets(prev => ({ ...prev, [ticketId]: false }));
      setTickets(prev => prev.map(t => {
        if (t.id === ticketId) {
          const assigneeName = t.assignee.name !== "Unassigned" ? t.assignee.name : "Support Team";
          const nextTimeId = t.timeline.length > 0 ? Math.max(...t.timeline.map(x => x.id)) + 1 : 1;
          return {
            ...t,
            timeline: [
              { 
                id: nextTimeId, 
                type: "comment", 
                author: assigneeName, 
                role: "agent", 
                avatar: t.assignee.avatar,
                text: "We are looking into this right now and will get back to you shortly.", 
                time: "Just now" 
              },
              ...t.timeline
            ]
          };
        }
        return t;
      }));
    }, 2500);
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description) return;
    
    const created: Ticket = {
      id: nextId,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category || "General Inquiry",
      departmentEmail: "support@creonity.com",
      assignee: {
        name: "Unassigned",
        avatar: "",
        email: "",
      },
      status: "Open",
      date: "Just now",
      timeline: [
        {
          id: 1,
          type: "system",
          text: <>Ticket created</>,
          icon: "gravity-ui:circle-plus",
          iconColor: "text-[#71717a] dark:text-[#a1a1aa]",
          iconBg: "bg-[#f4f4f5] dark:bg-[#27272a]",
          time: "Just now"
        }
      ]
    };
    
    setTickets([created, ...tickets]);
    setIsCreating(false);
    setNewTicket({ subject: "", description: "", category: "" });
    toast.success("Ticket submitted successfully");
  };

  return (
    <div className="mx-auto max-w-6xl pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <Icon icon="gravity-ui:chevron-left" className="size-5 text-[#0a0a0a] dark:text-white" />
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">
            My Tickets
          </h1>
        </div>
        <Button
          variant="primary"
          className="bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-medium h-9 px-4 shadow-sm self-start sm:self-auto rounded-full"
          onClick={() => setIsCreating(true)}
        >
          Open New Ticket
        </Button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="w-full flex flex-col bg-[#f4f4f5] dark:bg-[#111111] rounded-[24px] shadow-none border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden flex-1">

        {/* TABLE HEADER */}
        <div className="flex w-full h-[52px] shrink-0 items-center">
          <div className="w-[100px] sm:w-[130px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">ID</span>
          </div>
          <div className="flex-1 min-w-0 px-4 flex items-center justify-start text-left">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Issue</span>
          </div>
          <div className="hidden sm:flex w-[130px] shrink-0 px-4 items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Date</span>
          </div>
          <div className="hidden md:flex flex-1 min-w-[160px] px-4 items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Assigned To</span>
          </div>
          <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Status</span>
          </div>
          <div className="w-[44px] sm:w-[56px] shrink-0" />
        </div>

        {/* TABLE ROWS */}
        <div className="flex flex-col w-full bg-white dark:bg-[#0a0a0a] rounded-[24px] overflow-hidden flex-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border-t border-b border-[#efefef] dark:border-[#27272a]">
          <div className="flex flex-col w-full divide-y divide-[#efefef] dark:divide-[#27272a]">
          
          {/* CREATE TICKET ROW */}
          {isCreating && (
            <div className="w-full flex flex-col border-l-[3px] border-l-blue-500 bg-white dark:bg-[#0a0a0a]">
              {/* ALIGNED HEADER */}
              <div className="flex w-full items-center min-h-[72px] border-b border-[#efefef] dark:border-[#27272a]">
                <div className="w-[130px] shrink-0 px-5 flex items-center justify-center text-center">
                  <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">#{nextId}</span>
                </div>
                <div className="flex-[2.5] min-w-[200px] px-4 flex items-center justify-center text-center">
                  <span className="text-[14px] font-medium text-[#737373] dark:text-[#a1a1aa]">Draft Ticket</span>
                </div>
                <div className="w-[130px] shrink-0 px-4 flex items-center justify-center text-center">
                  <span className="text-[14px] text-[#737373] dark:text-[#a1a1aa]">Just now</span>
                </div>
                <div className="flex-1 min-w-[160px] px-4 flex items-center justify-center text-center">
                  <span className="text-[14px] text-[#737373] dark:text-[#a1a1aa]">—</span>
                </div>
                <div className="w-[110px] shrink-0 px-4 flex items-center justify-center text-center">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full border-[1.5px] border-[#a1a1aa] bg-transparent" />
                    <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">Draft</span>
                  </div>
                </div>
                <div className="w-[56px] shrink-0" />
              </div>

              {/* FORM */}
              <div className="p-5 flex flex-col gap-6 animate-in slide-in-from-top-2 fade-in duration-300 bg-blue-500/[0.03] dark:bg-blue-500/[0.04]">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <TextField 
                        value={newTicket.subject}
                        onChange={val => setNewTicket({...newTicket, subject: val})}
                        className="w-full"
                        aria-label="Subject"
                      >
                        <Label className="text-[13px] font-medium text-[#0a0a0a] dark:text-white mb-1.5 block">Subject</Label>
                        <Input 
                          placeholder="Brief description of the issue"
                          className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#111111] shadow-sm border border-[#efefef] dark:border-[#27272a] text-[14px] text-[#0a0a0a] dark:text-white outline-none focus-within:border-[#d4d4d8] dark:focus-within:border-[#3f3f46] transition-colors"
                        />
                      </TextField>
                    </div>
                    <div className="w-[200px]">
                      <label className="text-[13px] font-medium text-[#0a0a0a] dark:text-white mb-1.5 block">Topic</label>
                      {/* @ts-ignore */}
                      <Popover placement={"bottom-start" as any} offset={8}>
                        <PopoverTrigger>
                          <button className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#111111] shadow-sm border border-[#efefef] dark:border-[#27272a] text-[14px] text-[#0a0a0a] dark:text-white outline-none focus:border-[#d4d4d8] dark:focus:border-[#3f3f46] transition-colors flex items-center justify-between">
                            <span className={!newTicket.category ? "text-[#a1a1aa]" : ""}>{newTicket.category || "Select topic"}</span>
                            <Icon icon="gravity-ui:chevron-down" className="size-4 text-[#a1a1aa]" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-1">
                          <ListBox 
                            aria-label="Topic Selection"
                            className="w-full"
                            selectionMode="none"
                            onAction={(key) => setNewTicket({...newTicket, category: key.toString()})}
                          >
                            <ListBox.Item key="Technical Support" textValue="Technical Support">
                              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Technical Support</span>
                            </ListBox.Item>
                            <ListBox.Item key="Account & Billing" textValue="Account & Billing">
                              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Account & Billing</span>
                            </ListBox.Item>
                            <ListBox.Item key="Feature Request" textValue="Feature Request">
                              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Feature Request</span>
                            </ListBox.Item>
                            <ListBox.Item key="General Inquiry" textValue="General Inquiry">
                              <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">General Inquiry</span>
                            </ListBox.Item>
                          </ListBox>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <TextField 
                      value={newTicket.description}
                      onChange={val => setNewTicket({...newTicket, description: val})}
                      className="w-full"
                      aria-label="Description"
                    >
                      <Label className="text-[13px] font-medium text-[#0a0a0a] dark:text-white mb-1.5 block">Description</Label>
                      <TextArea 
                        placeholder="Provide details about your issue..."
                        className="w-full h-32 rounded-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111] p-3 text-[14px] text-[#0a0a0a] dark:text-white outline-none focus-within:border-[#d4d4d8] dark:focus-within:border-[#3f3f46] shadow-sm transition-colors resize-none"
                      />
                    </TextField>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end pt-2">
                  <Button 
                    variant="ghost" 
                    className="font-medium text-[#737373] dark:text-[#a1a1aa]"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-medium shadow-sm px-6 rounded-full"
                    onClick={handleCreateTicket}
                  >
                    Submit Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}

          {visibleTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            const isResolved = ticket.status === "Resolved";

            return (
              <div
                key={ticket.id}
                className={cn(
                  "w-full flex flex-col transition-all overflow-hidden",
                  isExpanded
                    ? cn(
                        "border-l-[3px]",
                        statusBorderMap[ticket.status],
                        isResolved
                          ? "bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04]"
                          : ticket.status === "Pending"
                          ? "bg-amber-500/[0.03] dark:bg-amber-500/[0.04]"
                          : "bg-blue-500/[0.03] dark:bg-blue-500/[0.04]"
                      )
                    : "border-l-[3px] border-l-transparent hover:bg-black/[0.025] dark:hover:bg-white/[0.03] cursor-pointer"
                )}
              >
                {/* COLLAPSED ROW */}
                <div
                  className="flex w-full items-center min-h-[64px] cursor-pointer group"
                  onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                >
                  {/* ID */}
                  <div className="w-[100px] sm:w-[130px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center gap-2">
                    <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white tabular-nums">
                      #{ticket.id}
                    </span>
                    <button
                      className="opacity-40 group-hover:opacity-80 hover:!opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(String(ticket.id));
                      }}
                    >
                      <Icon className="size-3.5 text-[#737373] dark:text-[#a1a1aa]" icon="gravity-ui:copy" />
                    </button>
                  </div>

                  {/* ISSUE */}
                  <div className="flex-1 min-w-0 px-4 flex flex-col items-start justify-center text-left py-3">
                    <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white leading-snug">
                      {ticket.subject}
                    </span>
                    {!isExpanded && (
                      <p className="text-[12px] text-[#737373] dark:text-[#a1a1aa] mt-0.5 truncate w-full">
                        {ticket.description}
                      </p>
                    )}
                    {/* Mobile-only: date + status inline */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 sm:hidden">
                      <span className="text-[11px] text-[#a1a1aa]">{ticket.date}</span>
                      <Chip color={statusColorMap[ticket.status]} size="sm" variant="soft" className="scale-[0.85] origin-left">{ticket.status}</Chip>
                    </div>
                  </div>

                  {/* DATE — hidden on mobile */}
                  <div className="hidden sm:flex w-[130px] shrink-0 px-4 items-center justify-center text-center">
                    <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{ticket.date}</span>
                  </div>

                  {/* ASSIGNED TO — hidden on mobile */}
                  <div className="hidden md:flex flex-1 min-w-[160px] px-4 items-center justify-center text-center gap-2.5">
                    <Avatar size="sm">
                      <Avatar.Image src={ticket.assignee.avatar} />
                      <Avatar.Fallback className="text-[10px]">
                        {ticket.assignee.name.split(" ").map((n) => n[0]).join("")}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white leading-tight">
                        {ticket.assignee.name}
                      </span>
                      <span className="text-[11px] text-[#737373] dark:text-[#a1a1aa]">
                        {ticket.departmentEmail}
                      </span>
                    </div>
                  </div>

                  {/* STATUS — hidden on mobile */}
                  <div className="hidden sm:flex w-[110px] shrink-0 px-4 items-center justify-center text-center">
                    <Chip color={statusColorMap[ticket.status]} size="sm" variant="soft" className="rounded-full">
                      {ticket.status}
                    </Chip>
                  </div>

                  {/* CHEVRON */}
                  <div className="w-[44px] sm:w-[56px] shrink-0 flex items-center justify-center">
                    <Icon
                      className={cn(
                        "size-4 transition-transform duration-300 text-[#a1a1aa]",
                        isExpanded && "rotate-180"
                      )}
                      icon="gravity-ui:chevron-down"
                    />
                  </div>
                </div>

                {/* EXPANDED PANEL - TIMELINE VIEW */}
                {isExpanded && (
                  <div className="flex flex-col w-full bg-white dark:bg-[#0a0a0a] border-t border-[#efefef] dark:border-[#27272a] animate-in slide-in-from-top-1 fade-in duration-250">
                    {/* Reply Input Box (Top of timeline) */}
                    <div className="relative pl-[56px] pb-6 pt-5 bg-white dark:bg-[#0a0a0a]">
                      {/* Timeline connection line from avatar down */}
                      {ticket.timeline.length > 0 && <div className="absolute left-[23px] top-[44px] bottom-0 w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />}
                      
                      {/* User Avatar */}
                      <div className="absolute left-[6px] top-5 h-[34px] w-[34px] rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] shadow-sm z-10 border-2 border-white dark:border-[#0a0a0a]" />

                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full pr-5">
                        <div className="flex-1 w-full bg-[#f4f4f5] dark:bg-[#1f1f1f] rounded-[24px] px-5 py-2.5 min-h-[44px] flex items-center border border-transparent focus-within:border-[#e4e4e7] dark:focus-within:border-[#27272a] transition-colors">
                          <input
                            type="text"
                            placeholder="Queue depth is falling after the worker pool restart."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleReply(ticket.id)}
                            className="w-full bg-transparent text-[14.5px] text-[#0a0a0a] dark:text-white placeholder-[#a1a1aa] outline-none"
                          />
                        </div>
                        <button
                          onClick={() => handleReply(ticket.id)}
                          className="h-[44px] px-6 rounded-[22px] bg-[#0070f3] text-white text-[14.5px] font-medium hover:bg-[#0051a8] transition-colors shrink-0"
                        >
                          Post
                        </button>
                      </div>
                      
                      {/* Typing Indicator */}
                      {typingTickets[ticket.id] && (
                        <div className="absolute left-[56px] -bottom-2">
                          <TypingIndicator avatar={ticket.assignee.name !== "Unassigned" ? ticket.assignee.name.split(" ").map((n) => n[0]).join("").substring(0, 2) : "AI"} />
                        </div>
                      )}
                    </div>

                    {/* Timeline Events */}
                    <div className="flex flex-col w-full">
                      {ticket.timeline.map((event, idx) => {
                        const isLast = idx === ticket.timeline.length - 1;
                        const isComment = event.type === "comment";
                        const isUser = event.role === "user";
                        
                        return (
                          <div key={event.id} className="relative pl-[56px] pb-6 bg-white dark:bg-[#0a0a0a]">
                            {/* Connecting line */}
                            {!isLast && <div className="absolute left-[23px] top-6 bottom-[-4px] w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />}
                            
                            {/* Icon */}
                            {isComment ? (
                              isUser ? (
                                <div className="absolute left-[11px] top-1.5 h-6 w-6 rounded-full flex items-center justify-center bg-white dark:bg-[#0a0a0a] z-10 border-[1.5px] border-[#a1a1aa] text-[#a1a1aa]">
                                  <Icon icon="gravity-ui:person" className="size-3.5" />
                                </div>
                              ) : (
                                <div className="absolute left-[11px] top-1.5 h-6 w-6 rounded-full flex items-center justify-center bg-white dark:bg-[#0a0a0a] z-10 text-[#0070f3] border-[1.5px] border-[#0070f3]">
                                  <Icon icon="gravity-ui:comment" className="size-3.5" />
                                </div>
                              )
                            ) : (
                              <div className={cn("absolute left-[11px] top-1.5 h-6 w-6 rounded-full flex items-center justify-center z-10", event.iconBg || "bg-[#f4f4f5] dark:bg-[#27272a]")}>
                                <Icon icon={event.icon!} className={cn("size-3.5", event.iconColor || "text-[#71717a] dark:text-[#a1a1aa]")} />
                              </div>
                            )}

                            {/* Content Area */}
                            <div className="flex items-start justify-between gap-4">
                              {isComment ? (
                                <div className="flex flex-col gap-1.5 w-full pr-4">
                                   <div className="flex items-center gap-2">
                                     <span className="text-[13.5px] text-[#71717a] dark:text-[#a1a1aa]">
                                       {isUser ? "Update from" : "Update from"}
                                     </span>
                                     <div className="flex items-center gap-2">
                                       {!isUser ? <Avatar src={event.avatar} size="sm" className="size-5" /> : <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe]" />}
                                       <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-white">{event.author}</span>
                                       {event.role === "agent" && (
                                         <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] dark:bg-[#27272a] text-[#0a0a0a] dark:text-white">On-call</span>
                                       )}
                                     </div>
                                   </div>
                                   <div className="bg-[#f4f4f5] dark:bg-[#1f1f1f] rounded-[20px] rounded-tl-sm p-4 text-[14.5px] text-[#0a0a0a] dark:text-zinc-200 leading-relaxed border border-[#e4e4e7] dark:border-[#27272a] max-w-3xl mt-1">
                                     {event.text}
                                     {event.attachment && (
                                       <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#e4e4e7]/60 dark:bg-[#27272a]/60 px-3 py-2 w-fit">
                                         <Icon icon="gravity-ui:file" className="size-4 text-[#71717a] dark:text-[#a1a1aa]" />
                                         <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">{event.attachment.name} - {event.attachment.size}</span>
                                         <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white ml-2 flex items-center gap-1 cursor-pointer hover:underline decoration-[#a1a1aa] underline-offset-4">
                                           Open runbook <Icon icon="gravity-ui:arrow-up-right" className="size-3" />
                                         </span>
                                       </div>
                                     )}
                                   </div>
                                </div>
                              ) : (
                                <div className="flex items-center pt-1 w-full pr-4">
                                  <div className="text-[14px] text-[#71717a] dark:text-[#a1a1aa]">
                                    {event.text}
                                  </div>
                                </div>
                              )}
                              
                              {/* Timestamp */}
                              <div className="shrink-0 pt-1 pr-5">
                                 <span className="text-[13px] text-[#71717a] dark:text-[#a1a1aa] whitespace-nowrap">{event.time}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
            Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, tickets.length)} of {tickets.length} tickets
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
`;

fs.writeFileSync(path.join('/Users/rishabh/pgming/creonity', 'components/support/views/my-tickets.tsx'), content);
