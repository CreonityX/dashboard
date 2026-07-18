"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { MOCK_BRANDS, type BrandData } from "@/components/brand/brand-data"

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
  signIn: (account: ActiveAccount) => void
  signOut: () => void
  updateBrand: (updates: Partial<BrandData>) => void
  inviteMember: (email: string, role: TeamRole) => void
  updateMemberRole: (id: string, role: TeamRole) => void
  removeMember: (id: string) => void
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined)
const SESSION_KEY = "creonity-active-account"
const BRAND_KEY = "creonity-brand-creonity"
const INVITES_KEY = "creonity-brand-invitations"

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<ActiveAccount | null>(null)
  const [brand, setBrand] = useState<BrandData>(MOCK_BRANDS.creonity)
  const [invitations, setInvitations] = useState<BrandInvitation[]>([])

  useEffect(() => {
    const storedAccount = localStorage.getItem(SESSION_KEY)
    const storedBrand = localStorage.getItem(BRAND_KEY)
    const storedInvites = localStorage.getItem(INVITES_KEY)
    if (storedAccount) setAccount(JSON.parse(storedAccount))
    if (storedBrand) setBrand(JSON.parse(storedBrand))
    if (storedInvites) setInvitations(JSON.parse(storedInvites))
  }, [])

  const value = useMemo<AccountContextValue>(() => ({
    account,
    brand: account?.role === "brand" && account.brandId === "creonity" ? brand : null,
    invitations,
    isBrand: account?.role === "brand",
    signIn(nextAccount) {
      setAccount(nextAccount)
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextAccount))
    },
    signOut() {
      setAccount(null)
      localStorage.removeItem(SESSION_KEY)
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
  }), [account, brand, invitations])

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (!context) throw new Error("useAccount must be used inside AccountProvider")
  return context
}
