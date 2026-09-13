"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  acceptCreatorTeamInvite as apiAcceptCreatorMember,
  acceptOwnTeamInvite as apiAcceptOwn,
  getMyBrand as apiGetMyBrand,
  getPublicBrandProfile as apiGetPublicBrandProfile,
  inviteBrandMember as apiInviteBrandMember,
  inviteCreatorMember as apiInviteCreatorMember,
  listBrandTeam as apiListBrandTeam,
  listCreatorTeam as apiListCreatorTeam,
  listTeamInvitations as apiListInvitations,
  removeBrandMember as apiRemoveBrandMember,
  removeCreatorMember as apiRemoveCreatorMember,
  updateBrandMemberRole as apiUpdateBrandMemberRole,
  updateCreatorMemberRole as apiUpdateCreatorMemberRole,
  updateMyBrand as apiUpdateMyBrand,
  type BrandProfile,
  type PublicBrandProfile,
  type TeamInvitation,
  type TeamMember,
  type UpdateBrandProfilePayload,
} from "@/lib/api";

async function getCookieHeader(): Promise<string | undefined> {
  const jar = await cookies();
  const all = jar.getAll();
  if (all.length === 0) return undefined;
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

function errToString(err: unknown): string {
  if (err instanceof ApiCallError) return err.message;
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

async function authed<T>(
  fn: (cookies: string) => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const header = await getCookieHeader();
    if (!header) return { success: false, error: "Not authenticated." };
    return { success: true, data: await fn(header) };
  } catch (err) {
    return { success: false, error: errToString(err) };
  }
}

// ── Brand profile ─────────────────────────────────────────────────────────────

export async function getMyBrandAction(): Promise<ActionResult<BrandProfile>> {
  return authed((c) => apiGetMyBrand(c));
}

export async function updateMyBrandAction(
  payload: UpdateBrandProfilePayload,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUpdateMyBrand(payload, c));
}

export async function getPublicBrandProfileAction(
  brandId: string,
): Promise<ActionResult<PublicBrandProfile>> {
  return authed((c) => apiGetPublicBrandProfile(brandId, c));
}

// ── Brand team ────────────────────────────────────────────────────────────────

export async function getBrandTeamAction(): Promise<
  ActionResult<{ members: TeamMember[] }>
> {
  return authed((c) => apiListBrandTeam(c));
}

export async function inviteBrandMemberAction(payload: {
  email: string;
  role: string;
}): Promise<ActionResult<{ message: string; teamMemberId: string }>> {
  return authed((c) => apiInviteBrandMember(payload, c));
}

export async function updateBrandMemberRoleAction(
  memberId: string,
  role: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUpdateBrandMemberRole(memberId, role, c));
}

export async function removeBrandMemberAction(
  memberId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiRemoveBrandMember(memberId, c));
}

// ── Creator team ──────────────────────────────────────────────────────────────

export async function getCreatorTeamAction(): Promise<
  ActionResult<{ members: TeamMember[] }>
> {
  return authed((c) => apiListCreatorTeam(c));
}

export async function inviteCreatorMemberAction(payload: {
  email: string;
  role: string;
}): Promise<ActionResult<{ message: string; teamMemberId: string }>> {
  return authed((c) => apiInviteCreatorMember(payload, c));
}

export async function updateCreatorMemberRoleAction(
  memberId: string,
  role: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUpdateCreatorMemberRole(memberId, role, c));
}

export async function removeCreatorMemberAction(
  memberId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiRemoveCreatorMember(memberId, c));
}

export async function acceptCreatorTeamInviteAction(
  memberId: string,
  token: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiAcceptCreatorMember(memberId, token, c));
}

export async function listTeamInvitationsAction(
  isBrand: boolean,
): Promise<ActionResult<TeamInvitation[]>> {
  return authed((c) => apiListInvitations(isBrand, c));
}

export async function acceptOwnTeamInviteAction(
  isBrand: boolean,
  memberId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiAcceptOwn(isBrand, memberId, c));
}
