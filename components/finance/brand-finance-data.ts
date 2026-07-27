export type PaymentMethod = {
  id: string;
  type: "card" | "bank" | "upi";
  name: string;
  last4?: string;
  isDefault?: boolean;
}

export type BrandCampaignBudget = {
  id: string;
  name: string;
  totalBudget: number;
  committed: number;
  paid: number;
  attributedValue: number;
}

export type BrandCreatorPayment = {
  id: string;
  campaignId: string;
  campaignName: string;
  creatorId: string;
  creatorName: string;
  creatorTone: string;
  milestone: string;
  amount: number;
  status: "pending" | "paid";
  dateAdded: string;
}

export type BrandTransactionCategory = 
  | "wallet_topup" 
  | "campaign_allocation" 
  | "payment_release" 
  | "invoice_settlement"
  | "platform_fee"
  | "refund";

export type BrandTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  category: BrandTransactionCategory;
  referenceId?: string; // e.g. campaign ID, or payment ID
  paymentMethodId?: string; // if paid via card/bank directly
}

export type BrandFinanceState = {
  walletBalance: number;
  paymentMethods: PaymentMethod[];
  campaignBudgets: BrandCampaignBudget[];
  creatorPayments: BrandCreatorPayment[];
  transactions: BrandTransaction[];
}

export const brandFinanceSeed: BrandFinanceState = {
  walletBalance: 25000,
  paymentMethods: [
    { id: "pm_1", type: "card", name: "Corporate Visa", last4: "4242", isDefault: true },
    { id: "pm_2", type: "bank", name: "HDFC Current Account", last4: "8991" }
  ],
  campaignBudgets: [
    { id: "camp_1", name: "Summer Collection Launch", totalBudget: 50000, committed: 45000, paid: 15000, attributedValue: 120000 },
    { id: "camp_2", name: "Q3 Tech Review Series", totalBudget: 30000, committed: 10000, paid: 0, attributedValue: 0 },
    { id: "camp_3", name: "Holiday Special", totalBudget: 100000, committed: 0, paid: 0, attributedValue: 0 }
  ],
  creatorPayments: [
    {
      id: "pay_1",
      campaignId: "camp_1",
      campaignName: "Summer Collection Launch",
      creatorId: "creator_1",
      creatorName: "Alex Rivera",
      creatorTone: "purple",
      milestone: "Final video approval",
      amount: 15000,
      status: "pending",
      dateAdded: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: "pay_2",
      campaignId: "camp_2",
      campaignName: "Q3 Tech Review Series",
      creatorId: "creator_2",
      creatorName: "Sam Jenkins",
      creatorTone: "orange",
      milestone: "Concept pitch",
      amount: 2500,
      status: "pending",
      dateAdded: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ],
  transactions: [
    {
      id: "tx_1",
      date: new Date(Date.now() - 10 * 86400000).toISOString(),
      description: "Wallet top-up via Corporate Visa",
      amount: 100000,
      status: "completed",
      category: "wallet_topup",
      paymentMethodId: "pm_1"
    },
    {
      id: "tx_2",
      date: new Date(Date.now() - 8 * 86400000).toISOString(),
      description: "Allocation: Summer Collection Launch",
      amount: -50000,
      status: "completed",
      category: "campaign_allocation",
      referenceId: "camp_1"
    },
    {
      id: "tx_3",
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      description: "Payment released to Sarah Chen",
      amount: -15000,
      status: "completed",
      category: "payment_release",
      referenceId: "camp_1"
    }
  ]
};
