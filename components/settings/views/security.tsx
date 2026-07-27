"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import type { ReactNode } from "react"
import { Switch, Button, Dropdown } from "@heroui/react"
import { toast } from "sonner"

export function BlueSwitch({ 
  defaultSelected, 
  isSelected, 
  onChange 
}: { 
  defaultSelected?: boolean
  isSelected?: boolean
  onChange?: (value: boolean) => void
}) {
  return (
    <Switch 
      defaultSelected={defaultSelected} 
      isSelected={isSelected} 
      onChange={onChange}
      aria-label="Toggle"
      className="pointer-events-none"
    >
      {({isSelected: selected}) => (
        <Switch.Content>
          <Switch.Control className={selected ? "!bg-[#006FEE]" : ""}>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  )
}

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
  { name: "New Zealand", dial_code: "+64" },
  { name: "Ireland", dial_code: "+353" },
  { name: "Israel", dial_code: "+972" },
  { name: "Turkey", dial_code: "+90" },
  { name: "Argentina", dial_code: "+54" },
  { name: "Colombia", dial_code: "+57" },
  { name: "Chile", dial_code: "+56" },
  { name: "Peru", dial_code: "+51" },
  { name: "Venezuela", dial_code: "+58" },
  { name: "Egypt", dial_code: "+20" },
  { name: "Nigeria", dial_code: "+234" },
  { name: "Kenya", dial_code: "+254" },
  { name: "Pakistan", dial_code: "+92" },
  { name: "Bangladesh", dial_code: "+880" },
  { name: "Indonesia", dial_code: "+62" },
  { name: "Philippines", dial_code: "+63" },
  { name: "Vietnam", dial_code: "+84" },
  { name: "Thailand", dial_code: "+66" },
  { name: "Malaysia", dial_code: "+60" },
  { name: "Taiwan", dial_code: "+886" },
  { name: "Hong Kong", dial_code: "+852" },
];

export function SecurityView({ onBack }: { onBack?: () => void }) {
  const [isManageSSOOpen, setIsManageSSOOpen] = useState(false);
  const [ssoConnections, setSsoConnections] = useState([
    { id: 'google', provider: 'Google', email: 'hello@creonity.com', icon: 'logos:google-icon' },
    { id: 'apple', provider: 'Apple', email: 'hello@creonity.com', icon: 'logos:apple' },
  ]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [isAuthDisableModalOpen, setIsAuthDisableModalOpen] = useState(false);
  const [isSMSDisableModalOpen, setIsSMSDisableModalOpen] = useState(false);
  const [isAuthEnabled, setIsAuthEnabled] = useState(false);
  const [isSMSEnabled, setIsSMSEnabled] = useState(false);
  const [isSMSCodeSent, setIsSMSCodeSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  return (
    <div className="mx-auto max-w-5xl pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <Icon icon="gravity-ui:chevron-left" className="size-5 text-[#0a0a0a] dark:text-white" />
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">Security</h1>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="flex flex-col gap-6">
        
        {/* Identity Verification */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Identity Verification</h3>
          
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  KYC Verification 
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>
                </div>
                <p className="mt-1 text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Complete verification using DigiLocker to confirm it's you</p>
              </div>
              <Button onClick={() => toast.success("Redirecting to DigiLocker")} className="bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl h-9 px-4 shrink-0">
                Verify with DigiLocker
              </Button>
            </div>
          </div>
        </div>

        {/* Login */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Login</h3>
          
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <Icon icon="ph:key" className="size-5 text-[#0a0a0a] dark:text-white" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Password</span>
                  <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Last changed 30 days ago</span>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <Button onClick={() => toast.success("Password change link sent to your email", { description: "Please check your inbox to proceed." })} className="bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:hover:bg-[#27272a] text-[#0a0a0a] dark:text-white font-medium rounded-xl h-9 px-4">
                  Change password
                </Button>
              </div>
            </div>

            <div className={`flex items-center justify-between px-6 py-4 min-h-[72px] transition-colors ${isManageSSOOpen ? 'border-b border-[#f4f4f5] dark:border-[#1f1f1f] bg-gray-50/50 dark:bg-white/[0.02]' : 'border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0'}`}>
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <Icon icon="ph:users-three" className="size-5 text-[#0a0a0a] dark:text-white" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Connected Accounts</span>
                  <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Sign in using social accounts.</span>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <Button 
                  onClick={() => setIsManageSSOOpen(!isManageSSOOpen)}
                  className={`bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:hover:bg-[#27272a] text-[#0a0a0a] dark:text-white font-medium rounded-xl h-9 px-4 transition-colors ${isManageSSOOpen ? 'bg-[#e4e4e7] dark:bg-[#27272a]' : ''}`}
                >
                  {isManageSSOOpen ? 'Done' : 'Manage'}
                </Button>
              </div>
            </div>
            
            {isManageSSOOpen && (
              <div className="flex flex-col p-2">
                {ssoConnections.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1f1f1f] border border-[#efefef] dark:border-[#27272a] flex items-center justify-center">
                        <Icon icon={account.icon} className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">{account.provider}</span>
                        <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">{account.email}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="flat"
                      onClick={() => {
                        setSsoConnections(ssoConnections.filter(a => a.id !== account.id))
                        toast.success(`${account.provider} disconnected`)
                      }}
                      className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium rounded-lg h-8 px-3 transition-colors"
                    >
                      Disconnect
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Passkeys & Security Keys */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Passkeys & Security Keys</h3>
          
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <Icon icon="ph:fingerprint" className="size-5 text-[#0a0a0a] dark:text-white" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Passkeys</span>
                  <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Sign in securely using Face ID, Touch ID, or your device screen lock.</span>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <Button onClick={() => toast.success("Passkey setup initiated")} className="bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:hover:bg-[#27272a] text-[#0a0a0a] dark:text-white font-medium rounded-xl h-9 px-4">
                  Add Passkey
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <Icon icon="ph:usb" className="size-5 text-[#0a0a0a] dark:text-white" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Security Keys</span>
                  <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Use a physical security key (like YubiKey) to protect your account.</span>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <Button onClick={() => toast.success("Security key setup initiated")} className="bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:hover:bg-[#27272a] text-[#0a0a0a] dark:text-white font-medium rounded-xl h-9 px-4">
                  Add Key
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-factor Authentication (MFA) */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Multi-factor Authentication (MFA)</h3>
          
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            <div 
              className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
              onClick={() => {
                if (isAuthEnabled) setIsAuthDisableModalOpen(true);
                else setIsAuthModalOpen(true);
              }}
            >
              <div className="flex flex-col gap-0.5 pointer-events-none">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Authenticator App</span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">{isAuthEnabled ? "Configured and active" : "Not configured"}</span>
              </div>
              <div className="shrink-0 ml-4 pointer-events-none">
                <BlueSwitch 
                  isSelected={isAuthEnabled}
                />
              </div>
            </div>

            <div 
              className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
              onClick={() => {
                if (isSMSEnabled) setIsSMSDisableModalOpen(true);
                else setIsSMSModalOpen(true);
              }}
            >
              <div className="flex flex-col gap-0.5 pointer-events-none">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Text Message (SMS)</span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">{isSMSEnabled ? "Configured and active" : "Receive a one-time code via SMS."}</span>
              </div>
              <div className="shrink-0 ml-4 pointer-events-none">
                <BlueSwitch 
                  isSelected={isSMSEnabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">Active Sessions</h3>
          
          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            <div className="flex flex-col p-4 border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
              <span className="text-[14px] text-[#52525b] dark:text-[#a1a1aa] mb-2 px-2">Revoke any device sessions you do not recognize.</span>
              
              <div className="flex flex-col gap-1">
                <SessionRow
                  icon="ph:laptop"
                  device="Mac OS · Chrome"
                  location="San Francisco, CA · 192.168.1.1"
                  activity="Active now"
                  current
                />
                <SessionRow
                  icon="ph:device-mobile"
                  device="iOS · Safari"
                  location="Los Angeles, CA · 10.0.0.1"
                  activity="Last active 2 hours ago"
                  action={<Button onClick={() => toast.success("Session revoked")} variant="light" color="danger" className="font-medium text-rose-600 dark:text-rose-400 h-8 px-3 rounded-lg min-w-0">Revoke</Button>}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODALS */}
      <SecurityModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        title="Connect your authenticator app"
        onVerify={() => {
          setIsAuthEnabled(true);
          setIsAuthModalOpen(false);
        }}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
              <span className="font-bold">Step 1:</span> Scan the QR code using your authenticator app, then enter the 6-digit code from the app.
            </p>
            <div className="flex flex-col items-center justify-center mt-2">
              <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-3xl border border-[#e4e4e7] dark:border-[#2a2a2a] flex items-center justify-center shadow-sm">
                <Icon icon="ph:qr-code-bold" className="size-48 text-[#0a0a0a] dark:text-white" />
              </div>
              <button className="mt-6 text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline transition-colors">Trouble scanning?</button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
              <span className="font-bold">Step 2:</span> Enter your 6-digit code
            </p>
            <OTPInput />
          </div>
        </div>
      </SecurityModal>

      <SecurityModal 
        isOpen={isSMSModalOpen} 
        onClose={() => {
          setIsSMSModalOpen(false);
          setTimeout(() => setIsSMSCodeSent(false), 300);
        }} 
        title={isSMSCodeSent ? "Verify your phone number" : "Enter your phone number"}
        primaryActionText={isSMSCodeSent ? "Verify" : "Send code"}
        onVerify={() => {
          if (!isSMSCodeSent) {
            setIsSMSCodeSent(true);
          } else {
            setIsSMSEnabled(true);
            setIsSMSModalOpen(false);
            setTimeout(() => setIsSMSCodeSent(false), 300);
          }
        }}
      >
        <div className="flex flex-col gap-8">
          {!isSMSCodeSent ? (
            <div className="flex flex-col gap-5">
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                We'll send you a code to confirm it's really you
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
                      {countryCodes.map((country) => (
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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] rounded-xl h-12 px-4 text-[15px] font-medium text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#0a0a0a] dark:focus:border-white placeholder-[#a1a1aa] transition-colors" 
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
                Enter the 6-digit code sent to <span className="font-bold">{selectedCountryCode} {phoneNumber ? phoneNumber : "(***) ***-**89"}</span>.
              </p>
              <OTPInput />
              <button className="text-[14px] text-sky-500 hover:text-sky-600 font-medium hover:underline self-start">Resend code</button>
            </div>
          )}
        </div>
      </SecurityModal>

      <SecurityModal
        isOpen={isAuthDisableModalOpen}
        onClose={() => setIsAuthDisableModalOpen(false)}
        title="Remove Authenticator App?"
        primaryActionText="Remove"
        isDanger={true}
        onVerify={() => {
          setIsAuthEnabled(false);
          setIsAuthDisableModalOpen(false);
        }}
      >
        <div className="flex flex-col gap-3">
          <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
            Are you sure you want to remove your authenticator app? This will lower the security of your account and you will rely on other methods to sign in.
          </p>
        </div>
      </SecurityModal>

      <SecurityModal
        isOpen={isSMSDisableModalOpen}
        onClose={() => setIsSMSDisableModalOpen(false)}
        title="Remove Text Message (SMS)?"
        primaryActionText="Remove"
        isDanger={true}
        onVerify={() => {
          setIsSMSEnabled(false);
          setIsSMSDisableModalOpen(false);
        }}
      >
        <div className="flex flex-col gap-3">
          <p className="text-[14px] text-[#0a0a0a] dark:text-[#eaeaea] leading-relaxed">
            Are you sure you want to remove your phone number for SMS codes? This will lower the security of your account.
          </p>
        </div>
      </SecurityModal>

    </div>
  )
}

function SessionRow({
  icon,
  device,
  location,
  activity,
  current,
  action,
}: {
  icon: string
  device: string
  location: string
  activity: string
  current?: boolean
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center">
          <Icon icon={icon} className="size-5 text-[#0a0a0a] dark:text-white" />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[#0a0a0a] dark:text-white">
            {device}
            {current ? <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Current</span> : null}
          </div>
          <p className="mt-0.5 text-[13px] text-[#71717a] dark:text-[#a1a1aa]">{location}</p>
          <p className="text-[12px] text-[#a1a1aa]">{activity}</p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

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

function SecurityModal({ 
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
