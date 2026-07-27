"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { MOCK_BRANDS, type BrandData } from "@/components/brand/brand-data"
import type { CalendarEvent } from "@/lib/calendar-data"
import type { Conversation, Message } from "@/lib/messages-data"
import { brandCalendarSeed, brandConversationSeed, brandTaskSeed } from "@/lib/brand-workspace-data"
import { type BrandFinanceState, brandFinanceSeed } from "@/components/finance/brand-finance-data"
import { type BrandAnalyticsState, brandAnalyticsSeed } from "@/lib/brand-analytics-data"
import { type BrandCampaign, type BrandCampaignDraft, brandCampaignSeed } from "@/lib/brand-campaign-data"
import { logoutAction } from "@/app/actions/auth"

export type AccountRole = "creator" | "brand"
export type ActiveAccount = {
  role: AccountRole
  brandId?: string
  email: string
}

export type TeamRole = "Owner" | "Admin" | "Campaign manager" | "Viewer"
export type BrandInvitation = { id: string; email: string; role: TeamRole; status: "pending" }

type AccountContextValue = {
  account: ActiveAccount | null
  brand: BrandData | null
  invitations: BrandInvitation[]
  isBrand: boolean
  brandCalendarEvents: CalendarEvent[]
  brandTasks: CalendarEvent[]
  brandConversations: Conversation[]
  signIn: (account: ActiveAccount) => void
  signOut: () => void
  updateBrand: (updates: Partial<BrandData>) => void
  inviteMember: (email: string, role: TeamRole) => void
  updateMemberRole: (id: string, role: TeamRole) => void
  removeMember: (id: string) => void
  saveBrandCalendarEvent: (event: CalendarEvent) => void
  deleteBrandCalendarEvent: (id: string) => void
  completeBrandTask: (id: string) => void
  appendBrandMessage: (conversationId: string, channelId: string | undefined, message: Message) => void
  resolveBrandReview: (conversationId: string, channelId: string | undefined, messageId: string, status: "approved" | "changes_requested") => void
  createBrandCommunity: (name: string, handle?: string, options?: { description?: string; channels?: { name: string; private: boolean; members: any[] }[]; members?: any[] }) => void
  createBrandChannel: (communityId: string, name: string, options?: { private: boolean; members: any[] }) => void
  createBrandGroup: (name: string, members: any[]) => void
  deleteBrandConversation: (id: string) => void

  brandFinance: BrandFinanceState
  brandAnalytics: BrandAnalyticsState
  brandCampaigns: BrandCampaign[]
  createBrandCampaign: (draft: BrandCampaignDraft, publish: boolean) => string
  updateBrandCampaign: (id: string, updates: Partial<BrandCampaign>) => void
  setBrandCampaignStatus: (id: string, status: BrandCampaign["status"]) => void
  addFundsToWallet: (amount: number, paymentMethodId: string) => void
  releaseCreatorPayment: (paymentId: string, paymentMethodId?: string) => void
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined)
const SESSION_KEY = "creonity-active-account-v7"
const BRAND_KEY = "creonity-brand-creonity-v7"
const INVITES_KEY = "creonity-brand-invitations-v7"
const CALENDAR_KEY = "creonity-brand-calendar-v7"
const TASKS_KEY = "creonity-brand-tasks-v7"
const CONVERSATIONS_KEY = "creonity-brand-conversations-v7"
const FINANCE_KEY = "creonity-brand-finance-v7"
const ANALYTICS_KEY = "creonity-brand-analytics-v1"
const CAMPAIGNS_KEY = "creonity-brand-campaigns-v1"

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<ActiveAccount | null>(null)
  const [brand, setBrand] = useState<BrandData>(MOCK_BRANDS.creonity)
  const [invitations, setInvitations] = useState<BrandInvitation[]>([])
  const [brandCalendarEvents, setBrandCalendarEvents] = useState<CalendarEvent[]>(brandCalendarSeed)
  const [brandTasks, setBrandTasks] = useState<CalendarEvent[]>(brandTaskSeed)
  const [brandConversations, setBrandConversations] = useState<Conversation[]>(brandConversationSeed)
  const [brandFinance, setBrandFinance] = useState<BrandFinanceState>(brandFinanceSeed)
  const [brandAnalytics, setBrandAnalytics] = useState<BrandAnalyticsState>(brandAnalyticsSeed)
  const [brandCampaigns, setBrandCampaigns] = useState<BrandCampaign[]>(brandCampaignSeed)

  useEffect(() => {
    const storedAccount = localStorage.getItem(SESSION_KEY)
    const storedBrand = localStorage.getItem(BRAND_KEY)
    const storedInvites = localStorage.getItem(INVITES_KEY)
    const storedCalendar = localStorage.getItem(CALENDAR_KEY)
    const storedTasks = localStorage.getItem(TASKS_KEY)
    const storedConversations = localStorage.getItem(CONVERSATIONS_KEY)
    const storedFinance = localStorage.getItem(FINANCE_KEY)
    const storedAnalytics = localStorage.getItem(ANALYTICS_KEY)
    const storedCampaigns = localStorage.getItem(CAMPAIGNS_KEY)
    if (storedAccount) setAccount(JSON.parse(storedAccount))
    if (storedBrand) setBrand(JSON.parse(storedBrand))
    if (storedInvites) setInvitations(JSON.parse(storedInvites))
    if (storedCalendar) setBrandCalendarEvents(JSON.parse(storedCalendar))
    if (storedTasks) setBrandTasks(JSON.parse(storedTasks))
    if (storedConversations) setBrandConversations(JSON.parse(storedConversations))
    if (storedFinance) setBrandFinance(JSON.parse(storedFinance))
    if (storedAnalytics) {
      const parsedAnalytics = JSON.parse(storedAnalytics)
      setBrandAnalytics({ ...brandAnalyticsSeed, ...parsedAnalytics, platformNativeMetrics: parsedAnalytics.platformNativeMetrics ?? brandAnalyticsSeed.platformNativeMetrics })
    }
    else localStorage.setItem(ANALYTICS_KEY, JSON.stringify(brandAnalyticsSeed))
    if (storedCampaigns) setBrandCampaigns(JSON.parse(storedCampaigns))
    else localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(brandCampaignSeed))
  }, [])

  const value = useMemo<AccountContextValue>(() => ({
    account,
    brand: account?.role === "brand" && account.brandId === "creonity" ? brand : null,
    invitations,
    isBrand: account?.role === "brand",
    brandFinance,
    brandAnalytics,
    brandCampaigns,
    createBrandCampaign(draft, publish) {
      const id = `camp_${Date.now()}`
      const next: BrandCampaign = { id, name: draft.name, status: publish ? "live" : "planning", objective: draft.objective, category: draft.category, startDate: draft.startDate, endDate: draft.endDate, brief: draft.brief, creatorIds: draft.creatorIds, deliverables: draft.deliverableNames.filter(Boolean).map((name, index) => ({ id: `${id}-d${index}`, name, creator: "Unassigned", status: "pending" })), nextMilestone: publish ? "Send creator briefs" : "Complete campaign brief", budgetId: id, activity: [{ id: `${id}-created`, label: publish ? "Campaign published" : "Campaign saved as planning", time: "Now" }] }
      setBrandCampaigns(current => { const updated = [next, ...current]; localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updated)); return updated })
      setBrandFinance(current => { const updated = { ...current, campaignBudgets: [...current.campaignBudgets, { id, name: draft.name, totalBudget: draft.totalBudget, committed: draft.committed, paid: 0, attributedValue: 0 }] }; localStorage.setItem(FINANCE_KEY, JSON.stringify(updated)); return updated })
      setBrandCalendarEvents(current => { const milestone = { id: `${id}-kickoff`, title: `${draft.name} — campaign kickoff`, type: "campaign" as const, date: draft.startDate, allDay: true, campaign: draft.name, priority: "high" as const }; const updated = [...current, milestone]; localStorage.setItem(CALENDAR_KEY, JSON.stringify(updated)); return updated })
      return id
    },
    updateBrandCampaign(id, updates) { setBrandCampaigns(current => { const updated = current.map(campaign => campaign.id === id ? { ...campaign, ...updates, activity: [...campaign.activity, { id: `${id}-${Date.now()}`, label: "Campaign details updated", time: "Now" }] } : campaign); localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updated)); return updated }) },
    setBrandCampaignStatus(id, status) { setBrandCampaigns(current => { const updated = current.map(campaign => campaign.id === id ? { ...campaign, status, activity: [...campaign.activity, { id: `${id}-${Date.now()}`, label: `Status changed to ${status}`, time: "Now" }] } : campaign); localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updated)); return updated }) },
    signIn(nextAccount) {
      setAccount(nextAccount)
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextAccount))
    },
    signOut() {
      setAccount(null)
      localStorage.removeItem(SESSION_KEY)
      logoutAction()
    },
    updateBrand(updates) {
      setBrand((current) => {
        const next = { ...current, ...updates }
        localStorage.setItem(BRAND_KEY, JSON.stringify(next))
        return next
      })
    },
    inviteMember(email, role) {
      const invitation = { id: `invite_${Date.now()}`, email, role, status: "pending" as const }
      setInvitations((current) => {
        const next = [...current, invitation]
        localStorage.setItem(INVITES_KEY, JSON.stringify(next))
        return next
      })
    },
    updateMemberRole(id, role) {
      setBrand((current) => {
        const next = { ...current, team: current.team.map((member) => member.id === id ? { ...member, role } : member) }
        localStorage.setItem(BRAND_KEY, JSON.stringify(next))
        return next
      })
    },
    removeMember(id) {
      setBrand((current) => {
        const next = { ...current, team: current.team.filter((member) => member.id !== id) }
        localStorage.setItem(BRAND_KEY, JSON.stringify(next))
        return next
      })
    },
    brandCalendarEvents,
    brandTasks,
    brandConversations,
    saveBrandCalendarEvent(event) {
      setBrandCalendarEvents((current) => {
        const next = event.id === "draft" ? [...current, { ...event, id: `brand-event-${Date.now()}` }] : current.some((item) => item.id === event.id) ? current.map((item) => item.id === event.id ? event : item) : [...current, event]
        localStorage.setItem(CALENDAR_KEY, JSON.stringify(next)); return next
      })
    },
    deleteBrandCalendarEvent(id) {
      setBrandCalendarEvents((current) => { const next = current.filter((event) => event.id !== id); localStorage.setItem(CALENDAR_KEY, JSON.stringify(next)); return next })
    },
    completeBrandTask(id) {
      setBrandTasks((current) => { const next = current.map((task) => task.id === id ? { ...task, completed: true } : task); localStorage.setItem(TASKS_KEY, JSON.stringify(next)); return next })
    },
    appendBrandMessage(conversationId, channelId, message) {
      setBrandConversations((current) => {
        const next = current.map((conversation) => conversation.id !== conversationId ? conversation : channelId ? { ...conversation, channels: conversation.channels?.map((channel) => channel.id === channelId ? { ...channel, messages: [...(channel.messages ?? []), message] } : channel) } : { ...conversation, messages: [...conversation.messages, message], preview: message.kind === "text" ? message.text : "New campaign update", time: "now" })
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next)); return next
      })
    },
    resolveBrandReview(conversationId, channelId, messageId, status) {
      const updateMessages = (messages: Message[]) => messages.map((message) => message.id === messageId && message.kind === "review" ? { ...message, status } : message)
      setBrandConversations((current) => {
        const next = current.map((conversation) => conversation.id !== conversationId ? conversation : channelId ? { ...conversation, channels: conversation.channels?.map((channel) => channel.id === channelId ? { ...channel, messages: updateMessages(channel.messages ?? []) } : channel) } : { ...conversation, messages: updateMessages(conversation.messages) })
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next)); return next
      })
    },
    createBrandGroup(name, members) {
      const newGroup: Conversation = {
        id: `group-${Date.now()}`,
        name,
        tone: "orange",
        type: "group",
        role: "admin",
        members,
        preview: "New group created",
        time: "now",
        messages: [{ id: `msg-${Date.now()}`, sender: "me", time: "now", kind: "text", text: `Welcome to ${name}.` }]
      }
      setBrandConversations((current) => {
        const next = [...current, newGroup]
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next))
        return next
      })
    },
    createBrandCommunity(name, handle, options) {
      const defaultChannel = { id: "general", name: "general", messages: [{ id: `msg-${Date.now()}`, sender: "me", time: "now", kind: "text", text: `Welcome to the ${name} workspace.` }] }
      const channels = options?.channels?.length
        ? options.channels.map(ch => ({
            id: `channel-${Date.now()}-${ch.name}`,
            name: ch.name,
            messages: ch.name.toLowerCase() === "general" ? defaultChannel.messages : [],
            isPrivate: ch.private
          }))
        : [defaultChannel]

      const newCommunity: Conversation = {
        id: `community-${Date.now()}`,
        name,
        handle: handle || `#${name.toLowerCase().replace(/\s+/g, '-')}`,
        tone: "blue",
        type: "community",
        role: "admin",
        preview: "0 creators",
        time: "",
        channels,
        members: options?.members?.length ? options.members : [{ id: "me", name: "Brand Team", role: "Admin", tone: "blue" }],
        messages: []
      }
      setBrandConversations((current) => {
        const next = [...current, newCommunity]
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next))
        return next
      })
    },
    createBrandChannel(communityId, name, options) {
      setBrandConversations((current) => {
        const next = current.map(c =>
          c.id === communityId && c.type === "community"
            ? { ...c, channels: [...(c.channels || []), { id: `channel-${Date.now()}`, name, private: options?.private || false, members: options?.members || [], messages: [] }] }
            : c
        )
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next))
        return next
      })
    },
    deleteBrandConversation(id) {
      setBrandConversations((current) => {
        const next = current.filter((c) => c.id !== id)
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next))
        return next
      })
    },
    addFundsToWallet(amount, paymentMethodId) {
      setBrandFinance(curr => {
        const next = { ...curr };
        next.walletBalance += amount;
        next.transactions = [
          {
            id: `tx_${Date.now()}`,
            date: new Date().toISOString(),
            description: `Wallet top-up via payment method`,
            amount,
            status: "completed",
            category: "wallet_topup",
            paymentMethodId
          },
          ...next.transactions
        ];
        localStorage.setItem(FINANCE_KEY, JSON.stringify(next));
        return next;
      })
    },
    releaseCreatorPayment(paymentId, paymentMethodId) {
      setBrandFinance(curr => {
        const next = { ...curr };
        const paymentIndex = next.creatorPayments.findIndex(p => p.id === paymentId);
        if (paymentIndex === -1) return next;
        
        const payment = next.creatorPayments[paymentIndex];
        
        // If paid from wallet, deduct from wallet and campaign paid amount
        if (!paymentMethodId) {
          next.walletBalance -= payment.amount;
        }

        // Update campaign paid amount
        const campIndex = next.campaignBudgets.findIndex(c => c.id === payment.campaignId);
        if (campIndex !== -1) {
          next.campaignBudgets[campIndex].paid += payment.amount;
        }

        // Update payment status
        next.creatorPayments[paymentIndex].status = "paid";

        // Add transaction
        next.transactions = [
          {
            id: `tx_${Date.now()}`,
            date: new Date().toISOString(),
            description: `Payment released to ${payment.creatorName}`,
            amount: -payment.amount,
            status: "completed",
            category: "payment_release",
            referenceId: payment.id,
            paymentMethodId
          },
          ...next.transactions
        ];
        localStorage.setItem(FINANCE_KEY, JSON.stringify(next));
        return next;
      })
    }
  }), [account, brand, invitations, brandCalendarEvents, brandTasks, brandConversations, brandFinance, brandAnalytics, brandCampaigns])

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (!context) throw new Error("useAccount must be used inside AccountProvider")
  return context
}
