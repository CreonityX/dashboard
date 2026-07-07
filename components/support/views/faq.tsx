import React from "react";
import { Accordion } from "@heroui/react";
import { cn } from "@/lib/utils";

const FAQ_SECTIONS = [
  {
    title: "General",
    items: [
      { q: "How do I verify my creator account?", a: "To get the verified badge, head to your account settings and submit a copy of your government ID along with proof of ownership for your linked social accounts. Our team typically reviews applications within 48 hours." },
      { q: "What are the community guidelines?", a: "We maintain a zero-tolerance policy for hate speech, harassment, and explicit content. Please refer to our full Community Guidelines document in the footer for detailed rules on what you can and cannot post." }
    ]
  },
  {
    title: "Payments & Earnings",
    items: [
      { q: "When do I get paid?", a: "Payouts are processed on the 1st and 15th of every month. You must have a minimum balance of $50 to trigger an automatic payout to your linked bank account or PayPal." },
      { q: "How is the revenue split calculated?", a: "Creators keep 90% of all direct subscription revenue and 80% of one-off tips. For ad revenue sharing on free content, the split is 70/30 in favor of the creator." },
      { q: "Can I accept international currencies?", a: "Yes! Our platform automatically handles currency conversion for your fans. Your earnings will be deposited in your local currency based on the day's exchange rate." }
    ]
  },
  {
    title: "Audience & Reach",
    items: [
      { q: "How does the algorithm recommend my content?", a: "Our recommendation engine prioritizes high engagement (likes, comments, watch time) over raw follower counts. Consistency and interacting with your commenters early on boosts your content's visibility." },
      { q: "Can I export my subscriber list?", a: "Absolutely. You own your audience. You can export a CSV of your active subscribers, including their emails (if they opted in), from the Audience tab in your dashboard." }
    ]
  },
  {
    title: "Technical Help",
    items: [
      { q: "What are the recommended video upload specifications?", a: "For the best quality, we recommend uploading 1080p or 4K videos in MP4 format, encoded with H.264. The maximum file size is 10GB per video." },
      { q: "Why isn't my live stream starting?", a: "Double-check your stream key in OBS or your streaming software. If you recently reset your stream key, you need to update it in your broadcasting software before going live." }
    ]
  }
];

export function FaqView({ onBack }: { onBack?: () => void }) {
  return (
    <div className="flex flex-col gap-6 pb-20 pt-6 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        {onBack && (
          <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a0a0a] dark:text-white">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white shrink-0">
          FAQ
        </h1>
      </div>

      <div className="flex flex-col gap-10 mt-2">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-4">
            <h2 className="text-[18px] font-semibold text-[#0a0a0a] dark:text-white">{section.title}</h2>
            <Accordion allowsMultipleExpanded className="w-full">
              {section.items.map((item, index) => (
                <Accordion.Item key={index}>
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
        ))}
      </div>
    </div>
  );
}
