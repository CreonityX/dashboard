"use client"

import { useMemo, useState } from "react"
import { Button } from "@heroui/react"
import { ArrowLeft, Check, Folder, Lock, LockOpen, Person, Plus, Search, TrashBin, Xmark } from "@gravity-ui/icons"
import { toast } from "sonner"
import { useAccount } from "@/context/account-context"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import type { Conversation } from "@/lib/messages-data"
import type { DraftState } from "@/components/messages/messages-app"

type Props = {
  type: "workspace" | "group"
  conversations: Conversation[]
  onComplete: (id: string) => void
  onCancel: () => void
  draftState: DraftState
  setDraftState: React.Dispatch<React.SetStateAction<DraftState>>
  isBrand?: boolean
}

const inputClass = "h-11 w-full rounded-full border-0 bg-[#f4f4f5] px-4 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] focus:ring-2 focus:ring-[#0a0a0a]/10 dark:bg-[#1f1f1f] dark:text-white dark:focus:ring-white/10"

export function CreateFlow({ type, conversations, onComplete, onCancel, draftState, setDraftState }: Props) {
  const { createBrandCommunity, createBrandGroup } = useAccount()
  const isWorkspace = type === "workspace"
  const [step, setStep] = useState<"details" | "members" | "channels">("details")
  const [query, setQuery] = useState("")
  const [channelName, setChannelName] = useState("")
  const [channelPrivate, setChannelPrivate] = useState(false)
  const [channelMembers, setChannelMembers] = useState<string[]>([])
  const contacts = useMemo(() => conversations.filter((item) => item.type !== "community" && item.id !== "create-workspace" && item.id !== "create-group"), [conversations])
  const visibleContacts = contacts.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.systemRole?.toLowerCase().includes(query.toLowerCase()))

  const update = (updates: Partial<DraftState>) => setDraftState((current) => ({ ...current, ...updates }))
  const toggleMember = (id: string) => {
    const selected = draftState.selectedMembers.includes(id)
    update({
      selectedMembers: selected ? draftState.selectedMembers.filter((member) => member !== id) : [...draftState.selectedMembers, id],
      memberRoles: selected ? Object.fromEntries(Object.entries(draftState.memberRoles).filter(([member]) => member !== id)) : { ...draftState.memberRoles, [id]: "member" },
    })
  }
  const addChannel = () => {
    const normalized = channelName.trim().toLowerCase().replace(/\s+/g, "-")
    if (!normalized) return
    if (draftState.channels.some((channel) => channel.id === normalized)) return toast.error("That channel already exists")
    update({ channels: [...draftState.channels, { id: normalized, name: normalized, private: channelPrivate, members: channelPrivate ? channelMembers : [] }] })
    setChannelName(""); setChannelPrivate(false); setChannelMembers([])
  }
  const create = () => {
    if (!draftState.name.trim()) return toast.error(`Enter a ${isWorkspace ? "workspace" : "group"} name`)
    if (!draftState.selectedMembers.length) return toast.error("Add at least one member")
    const members = draftState.selectedMembers.map((id) => {
      const person = contacts.find((item) => item.id === id)
      return { id, name: person?.name ?? "Member", role: draftState.memberRoles[id] === "admin" ? "Admin" : "Member", tone: person?.tone ?? "blue" }
    })
    if (isWorkspace) createBrandCommunity(draftState.name.trim(), undefined, { description: draftState.description.trim(), channels: draftState.channels, members })
    else createBrandGroup(draftState.name.trim(), members)
    toast.success(`${isWorkspace ? "Workspace" : "Group"} created`)
    onComplete(`${isWorkspace ? "community" : "group"}-${Date.now()}`)
  }
  const steps = isWorkspace ? ["Details", "Members", "Channels"] : ["Details", "Members"]
  const currentStep = step === "details" ? 0 : step === "members" ? 1 : 2
  const goBack = () => step === "details" ? onCancel() : setStep(step === "channels" ? "members" : "details")

  return <div className="flex h-full min-w-0 flex-col bg-white dark:bg-[#0a0a0a]">
    <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[#efefef] px-5 dark:border-white/10">
      <button onClick={goBack} className="flex size-9 items-center justify-center rounded-full text-[#0a0a0a] transition hover:bg-[#f4f4f5] dark:text-white dark:hover:bg-[#1f1f1f]"><ArrowLeft className="size-5" /></button>
      <div className="flex min-w-0 flex-1 items-center gap-2"><div className="flex size-8 items-center justify-center rounded-xl bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]">{isWorkspace ? <Folder className="size-4" /> : <Person className="size-4" />}</div><div><h1 className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">New {isWorkspace ? "workspace" : "group"}</h1><p className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{steps[currentStep]} · {currentStep + 1} of {steps.length}</p></div></div>
      <button onClick={onCancel} className="flex size-9 items-center justify-center rounded-full text-[#737373] transition hover:bg-[#f4f4f5] dark:text-[#a1a1aa] dark:hover:bg-[#1f1f1f]"><Xmark className="size-5" /></button>
    </header>

    <div className="shrink-0 border-b border-[#efefef] px-5 py-3 dark:border-white/10"><div className="mx-auto flex max-w-2xl gap-1.5">{steps.map((label, index) => <div key={label} className="flex min-w-0 flex-1 items-center gap-2"><span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${index <= currentStep ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]" : "bg-[#efefef] text-[#737373] dark:bg-[#27272a] dark:text-[#a1a1aa]"}`}>{index < currentStep ? <Check className="size-3" /> : index + 1}</span><span className={`truncate text-[12px] font-semibold ${index === currentStep ? "text-[#0a0a0a] dark:text-white" : "text-[#a1a1aa]"}`}>{label}</span>{index < steps.length - 1 && <span className="h-px flex-1 bg-[#e4e4e7] dark:bg-[#27272a]" />}</div>)}</div></div>

    <main className="flex-1 overflow-y-auto px-5 py-5"><div className="mx-auto w-full max-w-2xl">
      {step === "details" && <div className="space-y-5"><div><h2 className="text-[22px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Name your {isWorkspace ? "workspace" : "group"}</h2><p className="mt-1 text-[14px] text-[#737373] dark:text-[#a1a1aa]">Keep it short so it is easy to find in the inbox.</p></div><div className="rounded-2xl border border-[#efefef] p-4 dark:border-white/10"><label className="mb-2 block text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Name</label><input autoFocus value={draftState.name} onChange={(event) => update({ name: event.target.value })} placeholder={isWorkspace ? "e.g. Monsoon Edit" : "e.g. Campaign leads"} className={inputClass} /><label className="mb-2 mt-4 block text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Description <span className="font-normal text-[#a1a1aa]">optional</span></label><textarea value={draftState.description} onChange={(event) => update({ description: event.target.value })} placeholder="What is this space for?" className="min-h-24 w-full resize-none rounded-2xl border-0 bg-[#f4f4f5] p-3 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] focus:ring-2 focus:ring-[#0a0a0a]/10 dark:bg-[#1f1f1f] dark:text-white" /></div></div>}

      {step === "members" && <div className="space-y-4"><div><h2 className="text-[22px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Add members</h2><p className="mt-1 text-[14px] text-[#737373] dark:text-[#a1a1aa]">Select creators or teammates. You can adjust access later.</p></div><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" className={`${inputClass} pl-9`} /></div>{draftState.selectedMembers.length > 0 && <div className="flex flex-wrap gap-2">{draftState.selectedMembers.map((id) => { const person = contacts.find((item) => item.id === id); return person ? <button key={id} onClick={() => toggleMember(id)} className="flex items-center gap-1.5 rounded-full bg-[#f4f4f5] py-1 pl-1 pr-2 text-[12px] font-semibold text-[#0a0a0a] dark:bg-[#1f1f1f] dark:text-white"><GradientAvatar tone={person.tone} className="size-5" />{person.name}<Xmark className="size-3 text-[#737373]" /></button> : null })}</div>}<div className="overflow-hidden rounded-2xl border border-[#efefef] dark:border-white/10">{visibleContacts.map((person) => { const selected = draftState.selectedMembers.includes(person.id); return <div key={person.id} className="flex min-h-[64px] items-center gap-3 border-b border-[#efefef] px-3 last:border-0 dark:border-white/10"><button onClick={() => toggleMember(person.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><GradientAvatar tone={person.tone} className="size-9 shrink-0" /><span className="min-w-0"><span className="block truncate text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{person.name}</span><span className="block truncate text-[12px] text-[#737373] dark:text-[#a1a1aa]">{person.systemRole || person.brandName || "Member"}</span></span></button>{selected && <button onClick={() => update({ memberRoles: { ...draftState.memberRoles, [person.id]: draftState.memberRoles[person.id] === "admin" ? "member" : "admin" } })} className="rounded-lg bg-[#f4f4f5] px-2.5 py-1.5 text-[11px] font-bold text-[#0a0a0a] dark:bg-[#27272a] dark:text-white">{draftState.memberRoles[person.id] === "admin" ? "Admin" : "Member"}</button>}<button onClick={() => toggleMember(person.id)} className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#0a0a0a] bg-[#0a0a0a] text-white dark:border-white dark:bg-white dark:text-[#0a0a0a]" : "border-[#d4d4d8] text-transparent dark:border-[#3f3f46]"}`}><Check className="size-3" /></button></div>})}</div></div>}

      {step === "channels" && <div className="space-y-4"><div><h2 className="text-[22px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Set up channels</h2><p className="mt-1 text-[14px] text-[#737373] dark:text-[#a1a1aa]">Start simple. You can add more channels after creation.</p></div><div className="rounded-2xl border border-[#efefef] p-3 dark:border-white/10"><div className="flex gap-2"><input value={channelName} onChange={(event) => setChannelName(event.target.value.replace(/\s+/g, "-").toLowerCase())} onKeyDown={(event) => event.key === "Enter" && addChannel()} placeholder="Channel name" className={inputClass} /><button onClick={addChannel} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"><Plus className="size-5" /></button></div><button onClick={() => setChannelPrivate(!channelPrivate)} className={`mt-3 flex items-center gap-2 text-[13px] font-medium ${channelPrivate ? "text-[#0a0a0a] dark:text-white" : "text-[#737373] dark:text-[#a1a1aa]"}`}>{channelPrivate ? <Lock className="size-4" /> : <LockOpen className="size-4" />}{channelPrivate ? "Private channel" : "Public channel"}</button>{channelPrivate && <div className="mt-3 grid grid-cols-1 gap-1 rounded-xl bg-[#f4f4f5] p-2 dark:bg-[#1f1f1f]">{draftState.selectedMembers.map((id) => { const person = contacts.find((item) => item.id === id); if (!person) return null; const checked = channelMembers.includes(id); return <button key={id} onClick={() => setChannelMembers(checked ? channelMembers.filter((member) => member !== id) : [...channelMembers, id])} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white dark:hover:bg-[#27272a]"><span className={`flex size-4 items-center justify-center rounded border ${checked ? "border-[#0a0a0a] bg-[#0a0a0a] text-white dark:border-white dark:bg-white dark:text-[#0a0a0a]" : "border-[#a1a1aa]"}`}><Check className="size-3" /></span><GradientAvatar tone={person.tone} className="size-6" /><span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">{person.name}</span></button> })}</div>}</div><div className="overflow-hidden rounded-2xl border border-[#efefef] dark:border-white/10">{draftState.channels.map((channel) => <div key={channel.id} className="flex min-h-[54px] items-center gap-3 border-b border-[#efefef] px-3 last:border-0 dark:border-white/10"><span className="text-[17px] text-[#a1a1aa]">#</span><span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{channel.name}</span>{channel.private && <Lock className="size-3.5 text-[#737373]" />}{channel.id !== "general" && <button onClick={() => update({ channels: draftState.channels.filter((item) => item.id !== channel.id) })} className="rounded-lg p-1.5 text-[#a1a1aa] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"><TrashBin className="size-4" /></button>}</div>)}</div></div>}
    </div></main>

    <footer className="flex shrink-0 items-center justify-between border-t border-[#efefef] px-5 py-3 dark:border-white/10"><span className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{draftState.selectedMembers.length} member{draftState.selectedMembers.length === 1 ? "" : "s"} selected</span><Button onPress={() => { if (step === "details") { if (!draftState.name.trim()) return toast.error("Enter a name"); setStep("members") } else if (step === "members") { if (!draftState.selectedMembers.length) return toast.error("Add at least one member"); isWorkspace ? setStep("channels") : create() } else create() }} className="h-10 rounded-xl bg-[#0a0a0a] px-4 text-[14px] font-semibold text-white dark:bg-white dark:text-[#0a0a0a]">{step === "details" ? "Continue" : step === "members" && isWorkspace ? "Configure channels" : `Create ${isWorkspace ? "workspace" : "group"}`}</Button></footer>
  </div>
}
