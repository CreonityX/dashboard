"use server"

import { cookies } from "next/headers"
import {
  ApiCallError,
  getBrandAnalyticsOverview as apiBrandOverview,
  getInsightsAudience as apiAudience,
  getInsightsBenchmarks as apiBenchmarks,
  getInsightsContent as apiContent,
  getInsightsDealPerformance as apiDealPerformance,
  getInsightsGrowthChart as apiGrowthChart,
  getInsightsOverview as apiOverview,
  getInsightsPlatforms as apiPlatforms,
  type AudienceDemographics,
  type Benchmarks,
  type BrandAnalyticsOverview,
  type ContentPage,
  type DealPerformance,
  type GrowthSeries,
  type InsightsOverview,
  type PlatformBreakdown,
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

// ── Creator insights ──────────────────────────────────────────────────────────

export async function getInsightsOverviewAction(params: {
  from?: string;
  to?: string;
}): Promise<ActionResult<InsightsOverview>> {
  return authed((c) => apiOverview(params, c))
}

export async function getInsightsPlatformsAction(params: {
  from?: string;
  to?: string;
}): Promise<ActionResult<PlatformBreakdown[]>> {
  return authed((c) => apiPlatforms(params, c))
}

export async function getInsightsContentAction(params: {
  platform?: string;
  from?: string;
  to?: string;
  sort?: "views" | "likes" | "engagement_rate" | "published_at";
  cursor?: string;
  limit?: number;
}): Promise<ActionResult<ContentPage>> {
  return authed((c) => apiContent(params, c))
}

export async function getInsightsAudienceAction(
  platform: string,
): Promise<ActionResult<AudienceDemographics>> {
  return authed((c) => apiAudience(platform, c))
}

export async function getInsightsGrowthChartAction(params: {
  platform: string;
  metric: "followers" | "engagement" | "reach" | "impressions";
  from?: string;
  to?: string;
}): Promise<ActionResult<GrowthSeries>> {
  return authed((c) => apiGrowthChart(params, c))
}

export async function getInsightsBenchmarksAction(
  niche: string,
): Promise<ActionResult<Benchmarks>> {
  return authed((c) => apiBenchmarks(niche, c))
}

export async function getInsightsDealPerformanceAction(): Promise<ActionResult<DealPerformance>> {
  return authed((c) => apiDealPerformance(c))
}

// ── Brand analytics ───────────────────────────────────────────────────────────

export async function getBrandAnalyticsOverviewAction(): Promise<
  ActionResult<BrandAnalyticsOverview>
> {
  return authed((c) => apiBrandOverview(c))
}
