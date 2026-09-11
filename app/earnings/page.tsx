import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { MobileShell } from "@/components/mobile-shell";
import { FinanceApp } from "@/components/finance/finance-app";
import { Suspense } from "react";
import {
  me as apiMe,
  getCreatorFinanceOverview,
  listBrandFinanceTransactions,
  listCreatorFinanceTransactions,
  getCreatorFinanceRevenue,
  listCreatorFinanceUpcoming,
} from "@/lib/api";
import {
  wireToUiFinance,
  wireToUiTransactions,
  type FinanceSeed,
} from "@/lib/finance-adapter";
import type { Transaction } from "@/components/finance/finance-data";

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

  // Creator view is seeded server-side from the ledger. Brand transactions
  // too; brand cards still use the context mock (follow-up).
  let seed: FinanceSeed | undefined;
  let brandTransactions: Transaction[] | undefined;
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
  } else if (accountType === "brand") {
    try {
      brandTransactions = wireToUiTransactions(
        await listBrandFinanceTransactions({}, cookieHeader),
      );
    } catch {
      brandTransactions = undefined;
    }
  }

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="finance" />

      {/* Mobile Shell provides the mobile top bar (Search, Bell, Messages) + Bottom Nav */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <Suspense fallback={<div className="p-4">Loading finance...</div>}>
            <FinanceApp seed={seed} brandTransactions={brandTransactions} />
          </Suspense>
        </MobileShell>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <Suspense fallback={<div className="p-4">Loading finance...</div>}>
          <FinanceApp seed={seed} brandTransactions={brandTransactions} />
        </Suspense>
      </div>
    </main>
  );
}
