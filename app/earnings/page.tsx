import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { MobileShell } from "@/components/mobile-shell";
import { FinanceApp } from "@/components/finance/finance-app";
import { Suspense } from "react";
import {
  me as apiMe,
  getCreatorFinanceOverview,
  listCreatorFinanceTransactions,
  getCreatorFinanceRevenue,
  listCreatorFinanceUpcoming,
} from "@/lib/api";
import { wireToUiFinance, type FinanceSeed } from "@/lib/finance-adapter";

export const metadata = {
  title: "Finance | Creonity",
  description: "Manage your earnings, payouts, and invoices.",
};

export default async function FinancePage() {
  const jar = await cookies();
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  if (!cookieHeader) redirect("/login");

  let accountType: string;
  try {
    accountType = (await apiMe(cookieHeader)).account_type;
  } catch {
    redirect("/login");
  }

  // Creator view is seeded server-side from the ledger. Brand still uses
  // the context mock (wired in a follow-up) — visuals unchanged either way.
  let seed: FinanceSeed | undefined;
  if (accountType === "creator") {
    try {
      const [overview, transactions, revenue, upcoming] = await Promise.all([
        getCreatorFinanceOverview(cookieHeader),
        listCreatorFinanceTransactions({}, cookieHeader),
        getCreatorFinanceRevenue(cookieHeader),
        listCreatorFinanceUpcoming(cookieHeader),
      ]);
      seed = wireToUiFinance(overview, transactions, revenue, upcoming);
    } catch {
      seed = undefined;
    }
  }

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="finance" />

      {/* Mobile Shell provides the mobile top bar (Search, Bell, Messages) + Bottom Nav */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <Suspense fallback={<div className="p-4">Loading finance...</div>}>
            <FinanceApp seed={seed} />
          </Suspense>
        </MobileShell>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <Suspense fallback={<div className="p-4">Loading finance...</div>}>
          <FinanceApp seed={seed} />
        </Suspense>
      </div>
    </main>
  );
}
