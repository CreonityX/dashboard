import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { AnalyticsApp } from "@/components/analytics/analytics-app";
import { MobileShell } from "@/components/mobile-shell";
import { me as apiMe } from "@/lib/api";
import {
  getBrandAnalyticsOverviewAction,
  getInsightsDealPerformanceAction,
  getInsightsOverviewAction,
  getInsightsPlatformsAction,
} from "@/app/actions/analytics";
import {
  AnalyticsProvider,
  type AnalyticsSeed,
} from "@/context/analytics-context";

async function loadSeed(cookieHeader: string): Promise<AnalyticsSeed> {
  const me = await apiMe(cookieHeader);
  if (me.account_type === "brand") {
    const res = await getBrandAnalyticsOverviewAction();
    return {
      role: "brand",
      rollup: res.success
        ? res.data
        : {
            campaigns: [],
            creators: [],
            platformShare: [],
            weeklyReach: [0, 0, 0, 0, 0, 0, 0],
          },
    };
  }
  const [overview, platforms, dealPerformance] = await Promise.all([
    getInsightsOverviewAction({}),
    getInsightsPlatformsAction({}),
    getInsightsDealPerformanceAction(),
  ]);
  return {
    role: "creator",
    overview: overview.success ? overview.data : null,
    platforms: platforms.success ? platforms.data : [],
    dealPerformance: dealPerformance.success ? dealPerformance.data : null,
  };
}

export default async function AnalyticsPage() {
  const jar = await cookies();
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  if (!cookieHeader) redirect("/login");

  let seed: AnalyticsSeed;
  try {
    seed = await loadSeed(cookieHeader);
  } catch {
    redirect("/login");
  }

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="analytics" />

      {/* Mobile Shell provides the mobile top bar (Search, Bell, Messages) + Bottom Nav */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <AnalyticsProvider initial={seed}>
            <AnalyticsApp />
          </AnalyticsProvider>
        </MobileShell>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <AnalyticsProvider initial={seed}>
          <AnalyticsApp />
        </AnalyticsProvider>
      </div>
    </main>
  );
}
