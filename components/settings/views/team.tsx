"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAccount, type TeamRole } from "@/context/account-context"
import { SettingsActionButton, SettingsBadge, SettingsCard, SettingsPage, SettingsSection, SettingsSelect, SettingsInput } from "../settings-ui"

const roles: TeamRole[] = ["Owner", "Admin", "Campaign manager", "Viewer"]

export function TeamView({ onBack }: { onBack?: () => void }) {
  const { brand, invitations, inviteMember, updateMemberRole, removeMember } = useAccount()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<TeamRole>("Campaign manager")
  if (!brand) return null
  const invite = () => {
    if (!email.includes("@")) return toast.error("Enter a valid email address")
    inviteMember(email, role); setEmail(""); toast.success("Invitation created", { description: "It is saved locally as pending." })
  }
  return <SettingsPage title="Team" description="Invite people and control who can manage your brand." onBack={onBack}>
    <SettingsSection title="Invite a teammate"><SettingsCard className="flex flex-col gap-3 sm:flex-row">
      <SettingsInput value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@company.com" className="flex-1" />
      <SettingsSelect value={role} onChange={(val) => setRole(val as TeamRole)} options={roles} className="sm:w-48" />
      <SettingsActionButton onClick={invite}>Invite</SettingsActionButton>
    </SettingsCard></SettingsSection>
    <SettingsSection title={`People (${brand.team.length})`}><div className="flex flex-col gap-3">{brand.team.map((member) => <SettingsCard key={member.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
      <div className="flex items-center gap-3"><img src={member.avatarUrl} alt="" className="size-10 rounded-full" /><div><p className="font-semibold text-[#0a0a0a] dark:text-white leading-tight">{member.name}</p><p className="text-[13px] text-[#71717a] mt-0.5">Brand member</p></div></div>
      <div className="flex items-center gap-2 w-full sm:w-auto"><SettingsSelect value={member.role} onChange={(val) => updateMemberRole(member.id, val as TeamRole)} options={roles} className="flex-1 sm:flex-none sm:w-48" />{member.role !== "Owner" && <SettingsActionButton variant="dangerSoft" onClick={() => removeMember(member.id)}>Remove</SettingsActionButton>}</div>
    </SettingsCard>)}</div></SettingsSection>
    {invitations.length > 0 && <SettingsSection title="Pending invitations"><div className="flex flex-col gap-3">{invitations.map((invite) => <SettingsCard key={invite.id} className="flex items-center justify-between"><div><p className="font-semibold text-[#0a0a0a] dark:text-white">{invite.email}</p><p className="text-sm text-[#71717a]">{invite.role}</p></div><SettingsBadge tone="warning">Pending</SettingsBadge></SettingsCard>)}</div></SettingsSection>}
  </SettingsPage>
}
