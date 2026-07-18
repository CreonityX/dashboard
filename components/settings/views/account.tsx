"use client"

import { useState, type ReactNode } from "react"
import { Icon } from "@iconify/react"
import { Button, Dropdown } from "@heroui/react"
import { toast } from "sonner"
import { useAccount } from "@/context/account-context"
import {
  SettingsActionButton,
  SettingsBadge,
  SettingsCard,
  SettingsField,
  SettingsPage,
  SettingsSection,
} from "../settings-ui"

const countryCodes = [
  { name: "United States", dial_code: "+1" },
  { name: "Canada", dial_code: "+1" },
  { name: "United Kingdom", dial_code: "+44" },
  { name: "India", dial_code: "+91" },
  { name: "Australia", dial_code: "+61" },
  { name: "Germany", dial_code: "+49" },
  { name: "France", dial_code: "+33" },
  { name: "Italy", dial_code: "+39" },
  { name: "Japan", dial_code: "+81" },
  { name: "China", dial_code: "+86" },
  { name: "Brazil", dial_code: "+55" },
  { name: "Mexico", dial_code: "+52" },
  { name: "Russia", dial_code: "+7" },
  { name: "South Korea", dial_code: "+82" },
  { name: "Spain", dial_code: "+34" },
  { name: "Netherlands", dial_code: "+31" },
  { name: "Switzerland", dial_code: "+41" },
  { name: "Sweden", dial_code: "+46" },
  { name: "Singapore", dial_code: "+65" },
  { name: "United Arab Emirates", dial_code: "+971" },
  { name: "Saudi Arabia", dial_code: "+966" },
  { name: "South Africa", dial_code: "+27" },
];

function OTPInput({ length = 6 }: { length?: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-[20px] font-bold bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] focus:border-[#0a0a0a] dark:focus:border-white rounded-xl outline-none transition-colors text-[#0a0a0a] dark:text-white"
        />
      ))}
    </div>
  )
}

function AccountModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onVerify,
  primaryActionText = "Verify",
  isDanger = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: ReactNode; 
  onVerify: () => void;
  primaryActionText?: string;
  isDanger?: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c1c] border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-2xl w-full max-w-[480px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#2a2a2a] text-[#52525b] dark:text-[#a1a1aa] transition-colors">
            <Icon icon="ph:x" className="size-5" />
          </button>
        </div>
        <div className="px-6 pb-6 pt-2 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <Button variant="flat" onClick={onClose} className="font-medium bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#0a0a0a] dark:text-white rounded-full">Cancel</Button>
          <Button onClick={onVerify} className={`font-medium rounded-full px-6 ${isDanger ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-[#0a0a0a] hover:bg-black/80 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black'}`}>{primaryActionText}</Button>
        </div>
      </div>
    </div>
  )
}

export function AccountView({ onBack }: { onBack?: () => void }) {
  const { account, brand, isBrand } = useAccount()
  const currentMember = isBrand ? brand?.team.find(m => m.email === account?.email) : null;
  const userRole = isBrand ? currentMember?.role || "Team Member" : "Creator";

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailStep, setEmailStep] = useState(1);
  const [newEmail, setNewEmail] = useState("");
  const [name, setName] = useState(currentMember?.name || "Alex Rivera");
  const [position, setPosition] = useState(isBrand ? "Marketing Head" : "Creator");

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState(1);
  const [newPhone, setNewPhone] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false);
  const [isVerifyPhoneModalOpen, setIsVerifyPhoneModalOpen] = useState(false);

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setTimeout(() => {
      setEmailStep(1);
      setNewEmail("");
    }, 300);
  }

  const handleEmailAction = () => {
    if (emailStep === 1) setEmailStep(2);
    else if (emailStep === 2) setEmailStep(3);
    else {
      toast.success("Email updated successfully")
      closeEmailModal();
    }
  }

  const closePhoneModal = () => {
    setIsPhoneModalOpen(false);
    setTimeout(() => {
      setPhoneStep(1);
      setNewPhone("");
    }, 300);
  }

  const handlePhoneAction = () => {
    if (phoneStep === 1) setPhoneStep(2);
    else if (phoneStep === 2) setPhoneStep(3);
    else {
      toast.success("Phone number updated successfully")
      closePhoneModal();
    }
  }

  return (
    <SettingsPage title="Account Details" onBack={onBack}>
      <SettingsSection title="Personal Information">
        <SettingsCard>
          <div className="grid gap-6 md:grid-cols-2 px-2 py-1">
            <SettingsField label="Full Name">
              <input 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="mt-1 flex items-center h-10 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-transparent px-3 text-[15px] font-medium text-[#0a0a0a] dark:text-white outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" 
              />
            </SettingsField>
            <SettingsField label="Position in Company">
              <input 
                value={position} 
                onChange={e => setPosition(e.target.value)}
                className="mt-1 flex items-center h-10 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-transparent px-3 text-[15px] font-medium text-[#0a0a0a] dark:text-white outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors" 
              />
            </SettingsField>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Contact Information">
        <SettingsCard className="flex flex-col gap-4">
          <div className={`grid gap-4 ${!isEmailVerified ? 'lg:grid-cols-[1fr_auto_auto]' : 'lg:grid-cols-[1fr_auto]'} lg:items-end`}>
            <SettingsField label="Email Address">
              <div className="relative">
                <Icon icon="ph:envelope-simple" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" />
                <div className={`flex items-center h-12 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] pl-10 ${isEmailVerified ? 'pr-28' : 'pr-4'} text-[15px] font-medium text-[#0a0a0a] dark:text-white pointer-events-none`}>
                  alex.rivera@example.com
                </div>
                {isEmailVerified && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <SettingsBadge tone="success">Verified</SettingsBadge>
                  </div>
                )}
              </div>
            </SettingsField>
            {!isEmailVerified && (
              <Button 
                onClick={() => {
                  setIsVerifyEmailModalOpen(true)
                  toast.info("Verification code sent to email")
                }}
                className="bg-[#0a0a0a] hover:bg-black/80 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black font-medium h-10 px-4 rounded-xl"
              >
                Verify Now
              </Button>
            )}
            <SettingsActionButton variant="secondary" onClick={() => setIsEmailModalOpen(true)}>Change</SettingsActionButton>
          </div>
          <div className={`grid gap-4 ${!isPhoneVerified ? 'lg:grid-cols-[1fr_auto_auto]' : 'lg:grid-cols-[1fr_auto]'} lg:items-end`}>
            <SettingsField label="Phone Number">
              <div className="relative">
                <Icon icon="ph:phone" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" />
                <div className={`flex items-center h-12 w-full rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] pl-10 ${isPhoneVerified ? 'pr-28' : 'pr-4'} text-[15px] font-medium text-[#0a0a0a] dark:text-white pointer-events-none`}>
                  +1 (555) 123-4567
                </div>
                {isPhoneVerified && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <SettingsBadge tone="success">Verified</SettingsBadge>
                  </div>
                )}
              </div>
            </SettingsField>
            {!isPhoneVerified && (
              <Button 
                onClick={() => {
                  setIsVerifyPhoneModalOpen(true)
                  toast.info("Verification code sent to phone")
                }}
                className="bg-[#0a0a0a] hover:bg-black/80 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black font-medium h-10 px-4 rounded-xl"
              >
                Verify Now
              </Button>
            )}
            <SettingsActionButton variant="secondary" onClick={() => setIsPhoneModalOpen(true)}>Change</SettingsActionButton>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Account Information">
        <SettingsCard>
          <div className="grid gap-6 md:grid-cols-2 px-2 py-1">
            <SettingsField label="Account Type">
              <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white mt-1">{isBrand ? "Brand Workspace" : "Creator Workspace"}</span>
            </SettingsField>
            <SettingsField label="Account ID">
              <span className="text-[15px] font-mono text-[#71717a] mt-1">usr_8f7d9a2c3e4b1</span>
            </SettingsField>
            <SettingsField label="Member Since">
              <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white mt-1">August 12, 2024</span>
            </SettingsField>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* MODALS */}
      <AccountModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        title={emailStep === 2 ? "Change Email Address" : "Verify Email Address"}
        primaryActionText={emailStep === 2 ? "Send code" : "Verify"}
        onVerify={handleEmailAction}
      >
        <div className="flex flex-col gap-5">
          {emailStep === 1 && (
            <>
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                To keep your account secure, enter the 6-digit code sent to <span className="font-bold">alex.rivera@example.com</span> before making changes.
              </p>
              <OTPInput />
              <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
            </>
          )}
          {emailStep === 2 && (
            <>
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                Enter your new email address. We'll send a code to confirm it's really you.
              </p>
              <input 
                type="email" 
                placeholder="New email address" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-xl h-12 px-4 text-[15px] font-medium text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#0a0a0a] dark:focus:border-white placeholder-[#a1a1aa] transition-colors" 
              />
            </>
          )}
          {emailStep === 3 && (
            <>
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                Enter the 6-digit code sent to <span className="font-bold">{newEmail || "your new email"}</span>.
              </p>
              <OTPInput />
              <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
            </>
          )}
        </div>
      </AccountModal>

      <AccountModal
        isOpen={isPhoneModalOpen}
        onClose={closePhoneModal}
        title={phoneStep === 2 ? "Change Phone Number" : "Verify Phone Number"}
        primaryActionText={phoneStep === 2 ? "Send code" : "Verify"}
        onVerify={handlePhoneAction}
      >
        <div className="flex flex-col gap-5">
          {phoneStep === 1 && (
            <>
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                To keep your account secure, enter the 6-digit code sent to <span className="font-bold">+1 (555) 123-4567</span> before making changes.
              </p>
              <OTPInput />
              <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
            </>
          )}
          {phoneStep === 2 && (
            <>
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                Enter your new phone number. We'll send a code to confirm it's really you.
              </p>
              <div className="flex items-center gap-3">
                <Dropdown placement="bottom-start">
                  <Dropdown.Trigger>
                    <button className="flex items-center justify-between shrink-0 bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-xl h-12 pl-4 pr-3 text-[15px] font-medium text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#0a0a0a] dark:focus:border-white transition-colors cursor-pointer min-w-[80px]">
                      {selectedCountryCode}
                      <Icon icon="ph:caret-down" className="size-4 text-[#a1a1aa]" />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Popover className="min-w-[140px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111]">
                    <Dropdown.Menu 
                      aria-label="Country codes" 
                      className="max-h-[300px] overflow-y-auto p-1"
                    >
                      {COUNTRIES.map((country) => (
                        <Dropdown.Item key={country.dial_code} onPress={() => setSelectedCountryCode(country.dial_code)} className="text-[14px] text-[#0a0a0a] dark:text-white data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-[#27272a] rounded-lg">
                          <div className="flex items-center justify-between w-full gap-4">
                            <span className="font-medium text-[#0a0a0a] dark:text-white">{country.dial_code}</span>
                            <span className="text-[13px] text-[#71717a] dark:text-[#a1a1aa] truncate">{country.name}</span>
                          </div>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
                <input 
                  type="tel" 
                  placeholder="Phone number" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-xl h-12 px-4 text-[15px] font-medium text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#0a0a0a] dark:focus:border-white placeholder-[#a1a1aa] transition-colors" 
                />
              </div>
            </>
          )}
          {phoneStep === 3 && (
            <>
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                Enter the 6-digit code sent to <span className="font-bold">{selectedCountryCode} {newPhone || "your new number"}</span>.
              </p>
              <OTPInput />
              <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
            </>
          )}
        </div>
      </AccountModal>

      <AccountModal
        isOpen={isVerifyEmailModalOpen}
        onClose={() => setIsVerifyEmailModalOpen(false)}
        title="Verify Email Address"
        primaryActionText="Verify"
        onVerify={() => {
          setIsEmailVerified(true);
          setIsVerifyEmailModalOpen(false);
        }}
      >
        <div className="flex flex-col gap-5">
          <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
            Enter the 6-digit code sent to <span className="font-bold">alex.rivera@example.com</span> to verify your email address.
          </p>
          <OTPInput />
          <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
        </div>
      </AccountModal>

      <AccountModal
        isOpen={isVerifyPhoneModalOpen}
        onClose={() => setIsVerifyPhoneModalOpen(false)}
        title="Verify Phone Number"
        primaryActionText="Verify"
        onVerify={() => {
          setIsPhoneVerified(true);
          setIsVerifyPhoneModalOpen(false);
        }}
      >
        <div className="flex flex-col gap-5">
          <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
            Enter the 6-digit code sent to <span className="font-bold">+1 (555) 123-4567</span> to verify your phone number.
          </p>
          <OTPInput />
          <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
        </div>
      </AccountModal>

    </SettingsPage>
  )
}
