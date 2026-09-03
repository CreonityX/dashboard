"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SettingsActionButton, SettingsBadge, SettingsCard, SettingsPage, SettingsSection, SettingsSelect, SettingsInput } from "../settings-ui"
import {
  getBrandTeamAction,
  inviteBrandMemberAction,
  removeBrandMemberAction,
  updateBrandMemberRoleAction,
} from "@/app/actions/brand"
import type { TeamMember } from "@/lib/api"

const UI_ROLES = ["Owner", "Admin", "Campaign manager", "Viewer"] as const
type UiRole = (typeof UI_ROLES)[number]

// Backend roles ↔ UI labels. brand_owner has no UI assign path
// (invite schema excludes it); it displays as Owner.
const toBackendRole = (role: UiRole): string => {
  switch (role) {
    case "Owner":
      return "brand_owner"
    case "Admin":
      return "brand_admin"
    case "Campaign manager":
      return "brand_manager"
    case "Viewer":
      return "viewer"
  }
}

const toUiRole = (role: string): UiRole => {
  switch (role) {
    case "brand_owner":
      return "Owner"
    case "brand_admin":
      return "Admin"
    case "brand_manager":
      return "Campaign manager"
    default:
      return "Viewer"
  }
}

const displayName = (m: TeamMember) => m.email.split("@")[0] ?? m.email

export function TeamView({ onBack }: { onBack?: () => void }) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UiRole>("Campaign manager")
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const res = await getBrandTeamAction()
    if (res.success) setMembers(res.data.members)
    else toast.error(res.error)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const invite = async () => {
    if (!email.includes("@")) return toast.error("Enter a valid email address")
    const res = await inviteBrandMemberAction({ email, role: toBackendRole(role) })
    if (!res.success) return toast.error(res.error)
    setEmail("")
    toast.success("Invitation sent", { description: "They'll appear below once accepted." })
    await load()
  }

  const changeRole = async (id: string, next: UiRole) => {
    const res = await updateBrandMemberRoleAction(id, toBackendRole(next))
    if (!res.success) return toast.error(res.error)
    await load()
  }

  const remove = async (id: string) => {
    const res = await removeBrandMemberAction(id)
    if (!res.success) return toast.error(res.error)
    await load()
  }

  if (loading) return null
  const pending = members.filter((m) => m.status === "invited")

  return <SettingsPage title="Team" description="Invite people and control who can manage your brand." onBack={onBack}>
    <SettingsSection title="Invite a teammate"><SettingsCard className="flex flex-col gap-3 sm:flex-row">
      <SettingsInput value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@company.com" className="flex-1" />
      <SettingsSelect value={role} onChange={(val) => setRole(val as UiRole)} options={[...UI_ROLES]} className="sm:w-48" />
      <SettingsActionButton onClick={invite}>Invite</SettingsActionButton>
    </SettingsCard></SettingsSection>
    <SettingsSection title={`People (${members.length})`}><div className="flex flex-col gap-3">{members.map((member) => <SettingsCard key={member.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
      <div className="flex items-center gap-3"><div className="size-10 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[13px] font-bold text-[#737373]">{displayName(member).slice(0, 2).toUpperCase()}</div><div><p className="font-semibold text-[#0a0a0a] dark:text-white leading-tight">{displayName(member)}</p><p className="text-[13px] text-[#71717a] mt-0.5">{member.email}{member.status !== "active" ? ` · ${member.status}` : ""}</p></div></div>
      <div className="flex items-center gap-2 w-full sm:w-auto"><SettingsSelect value={toUiRole(member.role)} onChange={(val) => changeRole(member.id, val as UiRole)} options={[...UI_ROLES]} className="flex-1 sm:flex-none sm:w-48" />{member.role !== "brand_owner" && <SettingsActionButton variant="dangerSoft" onClick={() => remove(member.id)}>Remove</SettingsActionButton>}</div>
    </SettingsCard>)}</div></SettingsSection>
    {pending.length > 0 && <SettingsSection title="Pending invitations"><div className="flex flex-col gap-3">{pending.map((invite) => <SettingsCard key={invite.id} className="flex items-center justify-between"><div><p className="font-semibold text-[#0a0a0a] dark:text-white">{invite.email}</p><p className="text-sm text-[#71717a]">{toUiRole(invite.role)}</p></div><SettingsBadge tone="warning">Pending</SettingsBadge></SettingsCard>)}</div></SettingsSection>}
  </SettingsPage>
}
