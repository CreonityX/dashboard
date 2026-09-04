"use client"

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import type {
  AudienceDemographics,
  Benchmarks,
  BrandAnalyticsOverview,
  ContentPage,
  DealPerformance,
  GrowthSeries,
  InsightsOverview,
  PlatformBreakdown,
} from "@/lib/api"
import {
  getBrandAnalyticsOverviewAction,
  getInsightsAudienceAction,
  getInsightsBenchmarksAction,
  getInsightsContentAction,
  getInsightsDealPerformanceAction,
  getInsightsGrowthChartAction,
  getInsightsOverviewAction,
  getInsightsPlatformsAction,
} from "@/app/actions/analytics"

/** UI timeframe → backend date range. "all" omits bounds (server defaults). */
export function timeframeRange(timeframe: string): { from?: string; to?: string } {
  const to = new Date().toISOString().slice(0, 10)
  const fromDate = new Date()
  if (timeframe === "7d") fromDate.setDate(fromDate.getDate() - 7)
  else if (timeframe === "30d") fromDate.setDate(fromDate.getDate() - 30)
  else if (timeframe === "90d") fromDate.setDate(fromDate.getDate() - 90)
  else return {}
  return { from: fromDate.toISOString().slice(0, 10), to }
}

export type AnalyticsSeed =
  | { role: "brand"; rollup: BrandAnalyticsOverview }
  | {
      role: "creator";
      overview: InsightsOverview | null;
      platforms: PlatformBreakdown[];
      dealPerformance: DealPerformance | null;
    };

type AnalyticsContextValue = {
  seed: AnalyticsSeed;
  refresh: () => Promise<void>;
  fetchContent: (
    params: { platform?: string; sort?: "views" | "likes" | "engagement_rate" | "published_at"; limit?: number },
    timeframe?: string,
  ) => Promise<ContentPage | null>;
  fetchAudience: (platform: string) => Promise<AudienceDemographics>;
  fetchGrowth: (
    platform: string,
    metric: "followers" | "engagement" | "reach" | "impressions",
    timeframe?: string,
  ) => Promise<GrowthSeries | null>;
  fetchBenchmarks: (niche: string) => Promise<Benchmarks | null>;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

export function AnalyticsProvider({
  initial,
  children,
}: {
  initial: AnalyticsSeed;
  children: ReactNode;
}) {
  const [seed, setSeed] = useState<AnalyticsSeed>(initial)
  const cacheRef = useRef<Map<string, unknown>>(new Map())

  const cached = useCallback(
    async <T,>(key: string, fn: () => Promise<T | null>): Promise<T | null> => {
      if (cacheRef.current.has(key)) return cacheRef.current.get(key) as T | null
      const data = await fn()
      cacheRef.current.set(key, data)
      return data
    },
    [],
  )

  const refresh = useCallback(async () => {
    cacheRef.current.clear()
    if (seed.role === "brand") {
      const res = await getBrandAnalyticsOverviewAction()
      if (res.success) setSeed({ role: "brand", rollup: res.data })
    } else {
      const [overview, platforms, dealPerformance] = await Promise.all([
        getInsightsOverviewAction({}),
        getInsightsPlatformsAction({}),
        getInsightsDealPerformanceAction(),
      ])
      setSeed({
        role: "creator",
        overview: overview.success ? overview.data : null,
        platforms: platforms.success ? platforms.data : [],
        dealPerformance: dealPerformance.success ? dealPerformance.data : null,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed.role])

  const fetchContent = useCallback(
    (
      params: { platform?: string; sort?: "views" | "likes" | "engagement_rate" | "published_at"; limit?: number },
      timeframe = "30d",
    ) =>
      cached(`content:${params.platform ?? "all"}:${params.sort ?? "published_at"}:${timeframe}`, async () => {
        const res = await getInsightsContentAction({ ...params, ...timeframeRange(timeframe) })
        return res.success ? res.data : null
      }),
    [cached],
  )

  const fetchAudience = useCallback(
    (platform: string) =>
      cached(`audience:${platform}`, async () => {
        const res = await getInsightsAudienceAction(platform)
        return res.success ? res.data : null
      }),
    [cached],
  )

  const fetchGrowth = useCallback(
    (
      platform: string,
      metric: "followers" | "engagement" | "reach" | "impressions",
      timeframe = "30d",
    ) =>
      cached(`growth:${platform}:${metric}:${timeframe}`, async () => {
        const res = await getInsightsGrowthChartAction({ platform, metric, ...timeframeRange(timeframe) })
        return res.success ? res.data : null
      }),
    [cached],
  )

  const fetchBenchmarks = useCallback(
    (niche: string) =>
      cached(`benchmarks:${niche}`, async () => {
        const res = await getInsightsBenchmarksAction(niche)
        return res.success ? res.data : null
      }),
    [cached],
  )

  return (
    <AnalyticsContext.Provider
      value={{ seed, refresh, fetchContent, fetchAudience, fetchGrowth, fetchBenchmarks }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error("useAnalytics must be used inside <AnalyticsProvider>")
  return ctx
}
