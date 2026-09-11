import type { FinanceOverview, LedgerEntry, RevenuePoint } from "@/lib/api";
import type {
  FinanceOverviewData,
  IncomeBreakdown,
  RevenueSeries,
  TaxData,
  Transaction,
  TransactionStatus,
  UpcomingPayout,
} from "@/components/finance/finance-data";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BREAKDOWN_COLORS = [
  "#db2777",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#8b5cf6",
];

function wireStatusToUi(status: LedgerEntry["status"]): TransactionStatus {
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  return "pending";
}

function wireKindToUiType(kind: LedgerEntry["kind"]): Transaction["type"] {
  if (kind === "withdrawal" || kind === "payout") return "withdrawal";
  if (kind === "fee" || kind === "adjustment") return "platform";
  return "campaign";
}

export function wireToUiOverview(wire: FinanceOverview): FinanceOverviewData {
  return {
    totalEarned: wire.totalEarned,
    inEscrow: wire.inEscrow,
    availableWallet: wire.available,
    currency: wire.currency === "INR" ? "₹" : wire.currency,
  };
}

export function wireToUiTransactions(entries: LedgerEntry[]): Transaction[] {
  return entries.map((e) => ({
    id: e.id,
    date: e.occurredAt,
    description: e.description,
    amount: Number(e.amount),
    status: wireStatusToUi(e.status),
    type: wireKindToUiType(e.kind),
    brandOrPlatform: e.counterparty ?? "Creonity",
  }));
}

export function wireToUiRevenue(points: RevenuePoint[]): RevenueSeries[] {
  return points.map((p) => {
    const [y, m] = p.month.split("-").map(Number);
    const month =
      m !== undefined && m >= 1 && m <= 12
        ? (MONTH_SHORT[m - 1] as string)
        : p.month;
    void y;
    return {
      month,
      campaigns: p.campaigns,
      platform: p.platform,
      affiliates: p.affiliates + p.other,
    };
  });
}

export function wireToUiUpcoming(entries: LedgerEntry[]): UpcomingPayout[] {
  return entries.map((e) => ({
    id: e.id,
    expectedDate: e.expectedAt ?? e.occurredAt,
    amount: Number(e.amount),
    brand: e.counterparty ?? "Creonity",
    status: e.status === "processing" ? "processing" : "approved",
  }));
}

export function wireToUiBreakdown(points: RevenuePoint[]): IncomeBreakdown[] {
  const totals = new Map<string, number>();
  for (const p of points) {
    totals.set("Campaigns", (totals.get("Campaigns") ?? 0) + p.campaigns);
    totals.set("Platform", (totals.get("Platform") ?? 0) + p.platform);
    totals.set(
      "Affiliates",
      (totals.get("Affiliates") ?? 0) + p.affiliates + p.other,
    );
  }
  const grand = [...totals.values()].reduce((a, b) => a + b, 0);
  if (grand <= 0) return [];
  return [...totals.entries()]
    .filter(([, v]) => v > 0)
    .map(([name, v], i) => ({
      name,
      value: Math.round((v / grand) * 100),
      color: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length] as string,
    }));
}

/** No tax engine in v0 — honest zeros instead of a fabricated estimate. */
export function wireToUiTax(): TaxData {
  return {
    estimatedTax: 0,
    year: new Date().getFullYear(),
    taxFormsAvailable: false,
  };
}

export interface FinanceSeed {
  overview: FinanceOverviewData;
  revenueOverTime: RevenueSeries[];
  incomeBreakdown: IncomeBreakdown[];
  recentTransactions: Transaction[];
  upcomingPayouts: UpcomingPayout[];
  tax: TaxData;
}

export function wireToUiFinance(
  overview: FinanceOverview,
  transactions: LedgerEntry[],
  revenue: RevenuePoint[],
  upcoming: LedgerEntry[],
): FinanceSeed {
  return {
    overview: wireToUiOverview(overview),
    revenueOverTime: wireToUiRevenue(revenue),
    incomeBreakdown: wireToUiBreakdown(revenue),
    recentTransactions: wireToUiTransactions(transactions),
    upcomingPayouts: wireToUiUpcoming(upcoming),
    tax: wireToUiTax(),
  };
}
