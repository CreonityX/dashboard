import React from "react";
import { Accordion } from "@heroui/react";
import { Shield, TriangleExclamation, Heart, FileText, Ban } from "@gravity-ui/icons";

const REPORTING_FAQS = [
  { q: "How to report a post or user?", a: "You can report any post or user by clicking the three-dot menu (...) on their profile or content, and selecting 'Report'. Choose the appropriate reason from the list so our moderation team can investigate." },
  { q: "What happens after I file a report?", a: "Our Trust & Safety team reviews all reports within 24 hours. If a violation is found, we may remove the content, issue a warning, or ban the user. We will notify you of the outcome via email." },
  { q: "How do I appeal an account suspension?", a: "If you believe your account was suspended in error, please reply to the suspension email or contact support directly with your username and a brief explanation. Appeals are reviewed by a specialized team." }
];

export function CommunityGuidelinesView({ onBack, onNavigate }: { onBack?: () => void, onNavigate?: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-8 pb-20 pt-6 min-h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a0a0a] dark:text-white">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white shrink-0 flex items-center gap-2">
            Community & Safety
          </h1>
        </div>
        <button 
          onClick={() => onNavigate && onNavigate("contact-support")}
          className="flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[14px] font-semibold transition-colors shrink-0"
        >
          <TriangleExclamation className="w-4 h-4" />
          Report a Violation
        </button>
      </div>



      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Respect Everyone", icon: Heart, desc: "Zero tolerance for hate speech, harassment, or bullying." },
          { title: "Stay Authentic", icon: FileText, desc: "Do not impersonate others or spread misinformation." },
          { title: "Safe Content", icon: Ban, desc: "Strict policies against non-consensual explicit material." }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl border border-[#efefef] dark:border-[#27272a]">
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

      {/* Detailed Guidelines */}
      <div className="flex flex-col gap-6 mt-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Hate Speech & Harassment</h3>
          <p className="text-[14.5px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
            We do not allow content or behavior that promotes violence, attacks, or incites hatred against individuals or groups based on race, ethnicity, religion, disability, age, nationality, veteran status, sexual orientation, gender, or gender identity.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Explicit Content</h3>
          <p className="text-[14.5px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
            Content must follow our mature media policy. Non-consensual sexual content, illegal acts, and graphic violence are strictly prohibited and will result in immediate account termination and reporting to relevant authorities.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Copyright & Intellectual Property</h3>
          <p className="text-[14.5px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
            You must only upload content that you have created yourself or have the legal right to use. We comply with the DMCA and will promptly remove infringing content upon receiving a valid takedown notice.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-[18px] font-semibold text-[#0a0a0a] dark:text-white">Reporting & Appeals</h2>
        <Accordion allowsMultipleExpanded className="w-full">
          {REPORTING_FAQS.map((item, index) => (
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
    </div>
  );
}
