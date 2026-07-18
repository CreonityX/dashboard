import React from "react"; 
import { Accordion } from "@heroui/react";
import { Lock, ShieldCheck, Key, Shield } from "@gravity-ui/icons";
import { useAccount } from "@/context/account-context";

const ACCOUNT_FAQS = [
  { q: "How do I change my password?", a: "To change your password, navigate to the General Settings page via the bottom left gear icon, and look for the 'Security' section. From there, you can choose a new password." },
  { q: "What happens if I lose my 2FA device?", a: "If you lose your two-factor authentication device and didn't save your backup codes, you must contact our support team directly to verify your identity and restore access." },
  { q: "How do I download my account data?", a: "You can request a full export of your personal data from the Settings > Data Privacy section. It typically takes 24 hours to compile your data archive." },
  { q: "How do I permanently delete my account?", a: "To permanently delete your account and all associated data, please go to Settings > Data Privacy and select 'Delete Account'. This action is irreversible after the 30-day grace period." }
];

const BRAND_ACCOUNT_FAQS = [
  { q: "How do I manage team member permissions?", a: "Go to Settings > Team. As an Owner or Admin, you can change roles, revoke access, or require 2FA for all team members." },
  { q: "Can we enforce SSO for our organization?", a: "Yes, Enterprise brands can enforce SAML SSO login for all team members. Once enabled, password login will be disabled for your domain." },
  { q: "What happens when an employee leaves?", a: "When you remove a team member, they immediately lose access to the brand workspace, active campaigns, and billing data. Any active campaigns they were managing will be reassigned to the brand owner." },
  { q: "How do I view the audit log?", a: "Admins can download a 90-day compliance audit log containing login events, permission changes, and financial exports from the Security dashboard." }
];

export function AccountSecurityView({ onBack }: { onBack?: () => void }) {
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
          Account & Security
        </h1>
      </div>



      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: isBrand ? "Recover workspace" : "Recover Account", icon: ShieldCheck, desc: "Lost access? Follow our recovery guide." },
          { title: "2FA Setup", icon: Key, desc: "Step-by-step guide to secure your login." },
          { title: isBrand ? "Team access issue" : "Suspicious Activity", icon: Shield, desc: isBrand ? "Get help with member permissions or access." : "Report unauthorized access attempts." }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]">
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

      {/* FAQs */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-[18px] font-semibold text-[#0a0a0a] dark:text-white">Frequently Asked Questions</h2>
        <Accordion allowsMultipleExpanded className="w-full">
          {(isBrand ? BRAND_ACCOUNT_FAQS : ACCOUNT_FAQS).map((item, index) => (
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
