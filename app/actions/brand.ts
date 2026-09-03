"use server"

import { cookies } from "next/headers"
import {
  ApiCallError,
  getMyBrand as apiGetMyBrand,
  getPublicBrandProfile as apiGetPublicBrandProfile,
  inviteBrandMember as apiInviteBrandMember,
  inviteCreatorMember as apiInviteCreatorMember,
  listBrandTeam as apiListBrandTeam,
  listCreatorTeam as apiListCreatorTeam,
  removeBrandMember as apiRemoveBrandMember,
  updateBrandMemberRole as apiUpdateBrandMemberRole,
  updateMyBrand as apiUpdateMyBrand,
  type BrandProfile,
  type PublicBrandProfile,
  type TeamMember,
  type UpdateBrandProfilePayload,
} from "@/lib/api"

async function getCookieHeader(): Promise<string | undefined> {
  const jar = await cookies()
  const all = jar.getAll()
  if (all.length === 0) return undefined
  return all.map((c) => `${c.name}=${c.value}`).join("; ")
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function errToString(err: unknown): string {
  if (err instanceof ApiCallError) return err.message
  if (err instanceof Error) return err.message
  return "Unexpected error"
}

async function authed<T>(fn: (cookies: string) => Promise<T>): Promise<ActionResult<T>> {
  try {
    const header = await getCookieHeader()
    if (!header) return { success: false, error: "Not authenticated." }
    return { success: true, data: await fn(header) }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

// ── Brand profile ─────────────────────────────────────────────────────────────

export function getMyBrandAction(): Promise<ActionResult<BrandProfile>> {
  return authed((c) => apiGetMyBrand(c))
}

export function updateMyBrandAction(
  payload: UpdateBrandProfilePayload,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUpdateMyBrand(payload, c))
}

export function getPublicBrandProfileAction(
  brandId: string,
): Promise<ActionResult<PublicBrandProfile>> {
  return authed((c) => apiGetPublicBrandProfile(brandId, c))
}

// ── Brand team ────────────────────────────────────────────────────────────────

export function getBrandTeamAction(): Promise<ActionResult<{ members: TeamMember[] }>> {
  return authed((c) => apiListBrandTeam(c))
}

export function inviteBrandMemberAction(
  payload: { email: string; role: string },
): Promise<ActionResult<{ message: string; teamMemberId: string }>> {
  return authed((c) => apiInviteBrandMember(payload, c))
}

export function updateBrandMemberRoleAction(
  memberId: string,
  role: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUpdateBrandMemberRole(memberId, role, c))
}

export function removeBrandMemberAction(
  memberId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiRemoveBrandMember(memberId, c))
}

// ── Creator team ──────────────────────────────────────────────────────────────

export function getCreatorTeamAction(): Promise<ActionResult<{ members: TeamMember[] }>> {
  return authed((c) => apiListCreatorTeam(c))
}

export function inviteCreatorMemberAction(
  payload: { email: string; role: string },
): Promise<ActionResult<{ message: string; teamMemberId: string }>> {
  return authed((c) => apiInviteCreatorMember(payload, c))
}
