export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  type: "campaign" | "platform" | "withdrawal";
  brandOrPlatform: string;
}

export interface FinanceOverviewData {
  totalEarned: number;
  inEscrow: number;
  availableWallet: number;
  currency: string;
}

export interface RevenueSeries {
  month: string;
  campaigns: number;
  platform: number;
  affiliates: number;
}

export interface IncomeBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface TaxData {
  estimatedTax: number;
  year: number;
  taxFormsAvailable: boolean;
}

export interface UpcomingPayout {
  id: string;
  expectedDate: string;
  amount: number;
  brand: string;
  status: "processing" | "approved";
}

// Dummy Data Generator
export function getFinanceData() {
  const overview: FinanceOverviewData = {
    totalEarned: 245800,
    inEscrow: 34500,
    availableWallet: 12400,
    currency: "₹",
  };

  const revenueOverTime: RevenueSeries[] = [
    { month: "Jan", campaigns: 15000, platform: 4000, affiliates: 1200 },
    { month: "Feb", campaigns: 18000, platform: 4500, affiliates: 1500 },
    { month: "Mar", campaigns: 22000, platform: 5200, affiliates: 2100 },
    { month: "Apr", campaigns: 19500, platform: 5800, affiliates: 1800 },
    { month: "May", campaigns: 28000, platform: 6100, affiliates: 3000 },
    { month: "Jun", campaigns: 32000, platform: 7500, affiliates: 4200 },
  ];

  const incomeBreakdown: IncomeBreakdown[] = [
    { name: "Instagram Deals", value: 45, color: "#db2777" },
    { name: "YouTube AdSense", value: 25, color: "#ef4444" },
    { name: "TikTok Creator Fund", value: 20, color: "#06b6d4" },
    { name: "Affiliate Links", value: 10, color: "#84cc16" },
  ];

  const baseTransactions: Transaction[] = [
    {
      id: "TRX-8921",
      date: "2026-07-01T10:24:00Z",
      description: "Payout to HDFC Bank x4012",
      amount: -12000,
      status: "completed",
      type: "withdrawal",
      brandOrPlatform: "Creonity Wallet",
    },
    {
      id: "TRX-8920",
      date: "2026-06-28T14:15:00Z",
      description: "Summer Skincare Campaign",
      amount: 26500,
      status: "completed",
      type: "campaign",
      brandOrPlatform: "L'Oreal",
    },
    {
      id: "TRX-8919",
      date: "2026-06-25T09:00:00Z",
      description: "YouTube Revenue Share (May)",
      amount: 8400,
      status: "completed",
      type: "platform",
      brandOrPlatform: "YouTube",
    },
    {
      id: "TRX-8918",
      date: "2026-06-18T16:30:00Z",
      description: "Fitness App Launch Video",
      amount: 15000,
      status: "pending",
      type: "campaign",
      brandOrPlatform: "Fitbod",
    },
  ];

  const extraTransactions: Transaction[] = Array.from({ length: 42 }).map((_, i) => ({
    id: `TRX-${8917 - i}`,
    date: new Date(new Date("2026-06-18T16:30:00Z").getTime() - (i + 1) * 86400000 * (Math.random() * 2 + 1)).toISOString(),
    description: ["Sponsored Post", "Brand Ambassadorship", "Affiliate Payout", "Story Shoutout", "Product Review"][i % 5],
    amount: Math.floor(Math.random() * 40000) + 2000,
    status: Math.random() > 0.1 ? "completed" : "pending",
    type: "campaign",
    brandOrPlatform: ["Nike", "Samsung", "MyProtein", "Skillshare", "Squarespace"][i % 5],
  }));

  const recentTransactions: Transaction[] = [...baseTransactions, ...extraTransactions];

  const upcomingPayouts: UpcomingPayout[] = [
    {
      id: "PO-102",
      expectedDate: "2026-07-10",
      amount: 15000,
      brand: "Fitbod",
      status: "processing",
    },
    {
      id: "PO-103",
      expectedDate: "2026-07-15",
      amount: 19500,
      brand: "Nike",
      status: "approved",
    },
  ];

  const tax: TaxData = {
    estimatedTax: 24580, // roughly 10% TDS
    year: 2026,
    taxFormsAvailable: true,
  };

  return {
    overview,
    revenueOverTime,
    incomeBreakdown,
    recentTransactions,
    upcomingPayouts,
    tax,
  };
}
