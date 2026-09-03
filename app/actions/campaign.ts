"use server"

import { cookies } from "next/headers"
import {
  ApiCallError,
  approveDeal as apiApproveDeal,
  applyToCampaign as apiApplyToCampaign,
  cancelCampaign as apiCancelCampaign,
  cancelDeal as apiCancelDeal,
  closeCampaign as apiCloseCampaign,
  createCampaign as apiCreateCampaign,
  discoverCampaigns as apiDiscoverCampaigns,
  getBrandCampaign as apiGetBrandCampaign,
  getDeal as apiGetDeal,
  getDiscoverCampaign as apiGetDiscoverCampaign,
  listBrandCampaigns as apiListBrandCampaigns,
  listCampaignApplications as apiListCampaignApplications,
  listDeals as apiListDeals,
  listMyApplications as apiListMyApplications,
  pauseCampaign as apiPauseCampaign,
  publishCampaign as apiPublishCampaign,
  reviewApplication as apiReviewApplication,
  submitDealContent as apiSubmitDealContent,
  updateCampaign as apiUpdateCampaign,
  withdrawApplication as apiWithdrawApplication,
  type ApplicationPage,
  type ApplicationStatus,
  type Campaign,
  type CampaignPage,
  type CampaignStatus,
  type CreateCampaignPayload,
  type Deal,
  type DealPage,
  type DealStatus,
  type DiscoverFilters,
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

// ── Brand campaigns ───────────────────────────────────────────────────────────

export function getBrandCampaignsAction(params: {
  status?: CampaignStatus;
  limit?: number;
  cursor?: string;
}): Promise<ActionResult<CampaignPage>> {
  return authed((c) => apiListBrandCampaigns(params, c))
}

export function getBrandCampaignAction(campaignId: string): Promise<ActionResult<Campaign>> {
  return authed((c) => apiGetBrandCampaign(campaignId, c))
}

export function createCampaignAction(
  payload: CreateCampaignPayload,
): Promise<ActionResult<{ message: string; campaignId: string }>> {
  return authed((c) => apiCreateCampaign(payload, c))
}

export function updateCampaignAction(
  campaignId: string,
  payload: Partial<CreateCampaignPayload>,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUpdateCampaign(campaignId, payload, c))
}

export function publishCampaignAction(campaignId: string): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiPublishCampaign(campaignId, c))
}

export function pauseCampaignAction(campaignId: string): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiPauseCampaign(campaignId, c))
}

export function closeCampaignAction(campaignId: string): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiCloseCampaign(campaignId, c))
}

export function cancelCampaignAction(campaignId: string): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiCancelCampaign(campaignId, c))
}

// ── Applications (brand reviews) ──────────────────────────────────────────────

export function getCampaignApplicationsAction(
  campaignId: string,
  params: { status?: ApplicationStatus; limit?: number; cursor?: string },
): Promise<ActionResult<ApplicationPage>> {
  return authed((c) => apiListCampaignApplications(campaignId, params, c))
}

export function reviewApplicationAction(
  campaignId: string,
  applicationId: string,
  payload: { action: "shortlist" | "accept" | "reject"; rejectionReason?: string },
): Promise<ActionResult<{ message: string; dealId?: string }>> {
  return authed((c) => apiReviewApplication(campaignId, applicationId, payload, c))
}

// ── Discovery + applications (creator) ────────────────────────────────────────

export function discoverCampaignsAction(
  params: DiscoverFilters,
): Promise<ActionResult<CampaignPage>> {
  return authed((c) => apiDiscoverCampaigns(params, c))
}

export function getDiscoverCampaignAction(campaignId: string): Promise<ActionResult<Campaign>> {
  return authed((c) => apiGetDiscoverCampaign(campaignId, c))
}

export function applyToCampaignAction(
  campaignId: string,
  payload: { proposedRate: string; pitch?: string },
): Promise<ActionResult<{ message: string; applicationId: string }>> {
  return authed((c) => apiApplyToCampaign(campaignId, payload, c))
}

export function getMyApplicationsAction(params: {
  status?: ApplicationStatus;
  limit?: number;
  cursor?: string;
}): Promise<ActionResult<ApplicationPage>> {
  return authed((c) => apiListMyApplications(params, c))
}

export function withdrawApplicationAction(
  applicationId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiWithdrawApplication(applicationId, c))
}

// ── Deals (both sides) ────────────────────────────────────────────────────────

export function getDealsAction(params: {
  status?: DealStatus;
  limit?: number;
  cursor?: string;
}): Promise<ActionResult<DealPage>> {
  return authed((c) => apiListDeals(params, c))
}

export function getDealAction(dealId: string): Promise<ActionResult<Deal>> {
  return authed((c) => apiGetDeal(dealId, c))
}

export function submitDealContentAction(
  dealId: string,
  contentSubmissionUrl: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiSubmitDealContent(dealId, contentSubmissionUrl, c))
}

export function approveDealAction(dealId: string): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiApproveDeal(dealId, c))
}

export function cancelDealAction(dealId: string): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiCancelDeal(dealId, c))
}
