"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Accordion } from "@heroui/react";
import { CircleDollar, FileText, CreditCard, ClockArrowRotateLeft } from "@gravity-ui/icons";
import { useAccount } from "@/context/account-context";

const PAYOUTS_FAQS = [
  { q: "When and how do I get paid?", a: "Payouts are automatically processed on the 1st and 15th of every month. You must have a minimum balance of $50 to trigger a payout. Funds are sent to your linked bank account or PayPal." },
  { q: "What are the platform fees?", a: "We take a flat 10% fee on all direct subscriptions and a 20% fee on one-off tips. This covers payment processing, hosting, and platform maintenance." },
  { q: "Why is my payout delayed?", a: "Payouts can be delayed due to invalid banking information, holidays, or if your account is currently under a security review. Please check your email for any notices from our compliance team." }
];

const PURCHASES_FAQS = [
  { q: "How do I cancel an active subscription?", a: "You can cancel any active subscription by navigating to Billing & Payments > Active Subscriptions and clicking 'Cancel'. You will retain access until the end of your current billing cycle." },
  { q: "What payment methods are accepted?", a: "We currently accept all major credit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and PayPal." },
  { q: "How do refunds work?", a: "Refunds are generally not provided for digital goods or subscriptions unless there has been a billing error or unauthorized charge. Contact support within 7 days of the charge if you believe an error occurred." }
];

const BRAND_PAYMENTS_FAQS = [
  { q: "How do I fund a campaign?", a: "You can fund campaigns via credit card, ACH transfer, or wire transfer. Enterprise accounts may qualify for Net-30 invoicing terms." },
  { q: "Are there platform fees for brands?", a: "We charge a standard 5% platform fee on all creator payouts. For custom enterprise contracts, please refer to your master service agreement." },
  { q: "How are creator payments handled?", a: "We handle all creator payouts, tax compliance (1099s), and cross-border currency conversions automatically. You only need to fund the escrow." },
  { q: "How do I add custom PO numbers to invoices?", a: "You can set a default PO number in Settings > Billing. For campaign-specific POs, you can add them during the campaign creation step." },
  { q: "Can I get a consolidated monthly invoice?", a: "Yes, you can enable monthly consolidated billing in your Payment Settings. This rolls all campaign transactions into a single invoice issued on the 1st of the month." },
  { q: "What if there is a dispute with a creator?", a: "If deliverables are not met, you can initiate a dispute. Funds remain in escrow while our mediation team reviews the case and determines if a refund is warranted." }
];

export function BillingView({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const { isBrand } = useAccount();

  return (
    <div className="flex flex-col gap-8 pb-20 pt-6 min-h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        {onBack && (
          <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a0a0a] dark:text-white">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white shrink-0 flex items-center gap-2">
          Billing & Payments
        </h1>
      </div>

      {/* Notice Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-blue-50/50 dark:bg-blue-900/10">
        <div className="flex items-center md:items-center gap-4">
          <div className="flex items-center justify-center shrink-0">
            <ClockArrowRotateLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{isBrand ? "Creator payment schedule" : "Next Payout: 15th of the Month"}</h3>
            <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa] mt-1">{isBrand ? "Review payment methods and campaign invoices before creator payments are released." : "Ensure your payment details are up to date by the 13th."}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Invoices & Receipts", icon: FileText, desc: "Download your past transaction history." },
          { title: "Payment Methods", icon: CreditCard, desc: "Manage your saved cards and payout accounts." }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              onClick={() => router.push("/settings/subscription")}
              role="button"
              tabIndex={0}
              className="flex flex-col gap-3 p-5 rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <Icon className="w-5 h-5 text-[#0a0a0a] dark:text-white" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{card.title}</h3>
                <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa] mt-1">{card.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-[#0a0a0a] dark:text-white">Frequently Asked Questions</h2>
          <Accordion allowsMultipleExpanded className="w-full border-t border-[#efefef] dark:border-[#27272a]">
            {(isBrand ? BRAND_PAYMENTS_FAQS : [...PAYOUTS_FAQS, ...PURCHASES_FAQS]).map((item, index) => (
              <Accordion.Item key={index} className="border-b border-[#efefef] dark:border-[#27272a]">
                <Accordion.Heading>
                  <Accordion.Trigger className="text-[15px] font-medium text-[#0a0a0a] dark:text-white py-4">
                    {item.q}
                    <Accordion.Indicator className="text-[#737373] dark:text-[#a1a1aa]" />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body className="text-[14.5px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed pb-5 pt-1">
                    {item.a}
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
