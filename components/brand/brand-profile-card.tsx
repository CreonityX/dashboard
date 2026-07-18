"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, ScrollShadow, Typography, AlertDialog } from "@heroui/react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/ui/brand-logo";
import { 
  SealCheck, 
  MapPin, 
  Link, 
  Comment,
  ArrowUpRight,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check
} from "@gravity-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import type { BrandData } from "@/components/brand/brand-data";
import { BrandEditorForm } from "@/components/brand/brand-editor-form";

export function BrandProfileCard({ 
  brand,
  isOwner = false,
  onUpdate,
}: { 
  brand: BrandData
  isOwner?: boolean
  onUpdate?: (updates: Partial<BrandData>) => void
}) {
  const router = useRouter();
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(brand);

  const saveProfile = () => {
    onUpdate?.({ ...draft, categories: draft.categories.filter(Boolean) });
    setIsEditing(false);
  };

  // Simple determinism for banner gradient based on brand name length or ID
  const hash = brand.id.length * 10;
  const gradient = `linear-gradient(${hash}deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4))`;

  return (
    <div className="relative flex w-full flex-col overflow-hidden bg-white lg:h-full lg:rounded-2xl lg:border lg:border-gray-200/70 lg:shadow-sm dark:bg-[#0a0a0a] dark:lg:border-white/10">
      {isEditing && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0a0a0a] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(false)} className="text-gray-900 dark:text-white">
              <ChevronLeft width={24} height={24} />
            </button>
            <Typography type="h6" className="text-[#0a0a0a] dark:text-white leading-none font-semibold">Edit brand profile</Typography>
          </div>
          <AlertDialog>
            <AlertDialog.Trigger className="text-[#0060ff] dark:text-[#4d90fe] font-semibold text-sm flex items-center justify-center cursor-pointer outline-none">
              <Check width={22} height={22} />
            </AlertDialog.Trigger>
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog className="sm:max-w-[400px]">
                  {(renderProps: any) => (
                    <>
                      <AlertDialog.CloseTrigger />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="success" />
                        <AlertDialog.Heading className="text-[#0a0a0a] dark:text-white">Save changes?</AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p className="text-gray-600 dark:text-gray-300">Are you sure you want to save these changes to your brand profile?</p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="tertiary" className="!text-[#0a0a0a] dark:!text-white font-medium">
                          Cancel
                        </Button>
                        <Button onPress={() => { saveProfile(); toast.success("Brand profile updated successfully!"); renderProps.close(); }}>
                          Save changes
                        </Button>
                      </AlertDialog.Footer>
                    </>
                  )}
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        </div>
      )}
      
      <ScrollShadow hideScrollBar size={60} className="h-full w-full flex-1 pb-2 lg:pb-6">
        
        {/* Mobile back button */}
        <div className="relative">
          <button
            onClick={() => router.back()}
            className="lg:hidden absolute top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0a0a0a] shadow-md transition-transform active:scale-95"
          >
            <ChevronLeft width={24} height={24} />
          </button>
        </div>

        {/* Header and Logo */}
        <div className="relative pt-0 lg:px-2 lg:pt-2 pb-2">
          <div className="group relative h-[180px] w-full shrink-0 overflow-hidden lg:rounded-2xl bg-black">
            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ background: gradient }} />
            <div className="absolute inset-0 flex items-center justify-center">
               <Typography type="h2" className="text-white drop-shadow-md font-bold">{brand.name}</Typography>
            </div>
          </div>
          
          <div className="relative h-10 w-full shrink-0">
            <div className="absolute -top-12 left-6">
              <div className="group relative rounded-full">
                <div
                  className="h-[76px] w-[76px] overflow-hidden rounded-full bg-white shadow-sm ring-4 ring-white dark:ring-[#0a0a0a] flex items-center justify-center relative"
                >
                  <BrandLogo domain={brand.domain} name={brand.name} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 z-10 rounded-full bg-white p-[1.5px] dark:bg-[#0a0a0a]">
                  <SealCheck className="h-[20px] w-[20px] text-[#0060ff]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          <BrandEditorForm value={draft as BrandData} onChange={(val) => setDraft(val as BrandData)} />
        ) : (
          <>
            {/* Identity */}
        <div className="px-6 mt-4 flex flex-col gap-0.5">
          <Typography type="h4" className="text-[#0a0a0a] dark:text-white leading-none font-bold">
            {brand.name}
          </Typography>
        </div>

        {/* Stats */}
        <div className="px-6 mt-5 flex items-center justify-between lg:justify-start lg:gap-8">
          <div className="flex flex-col gap-0.5">
            <Typography type="body-xs" className="text-gray-500 uppercase font-semibold tracking-wide text-[10px]">Campaigns</Typography>
            <Typography type="h5" className="text-[#0a0a0a] dark:text-white leading-none font-bold">{brand.campaignsCount}</Typography>
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography type="body-xs" className="text-gray-500 uppercase font-semibold tracking-wide text-[10px]">Creators Worked With</Typography>
            <Typography type="h5" className="text-[#0a0a0a] dark:text-white leading-none font-bold">{brand.creatorsWorkedWith}</Typography>
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography type="body-xs" className="text-gray-500 uppercase font-semibold tracking-wide text-[10px]">Rating</Typography>
            <Typography type="h5" className="text-[#0a0a0a] dark:text-white leading-none font-bold">{brand.rating.toFixed(1)} / 5</Typography>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="px-6 mt-6 flex items-center gap-3">
          {isOwner ? <>
            <Button onPress={() => { setDraft(brand); setIsEditing(true) }} className="h-[40px] bg-[#0060ff] text-white font-semibold text-[14px] rounded-xl flex-1">Edit profile</Button>
            <Button variant="outline" onPress={() => router.push("/settings/team")} className="h-[40px] border-[1.5px] border-gray-200 dark:border-gray-800 text-[#0a0a0a] dark:text-white font-semibold text-[14px] rounded-xl flex-1">Manage team</Button>
          </> : <>
            <Button className="h-[40px] bg-[#0060ff] dark:bg-[#0060ff] text-white font-semibold text-[14px] rounded-xl flex-1 hover:opacity-90 transition-opacity">View Open Campaigns</Button>
            <Button variant="outline" className="h-[40px] bg-transparent border-[1.5px] border-gray-200 dark:border-gray-800 text-[#0a0a0a] dark:text-white font-semibold text-[14px] rounded-xl flex-1 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"><Comment className="w-4 h-4 mr-1" />Message</Button>
          </>}
        </div>

        {/* Separator */}
        <div className="px-6 mt-6">
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50" />
        </div>

        {/* Payment & Trust Section */}
        <div className="px-6 mt-6">
          <div className="bg-[#f0fdf4] dark:bg-[#052e16]/40 border border-[#bbf7d0] dark:border-[#166534] rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ShieldCheck className="w-24 h-24 text-green-600" />
            </div>
            
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-700 dark:text-green-400" />
              <Typography type="body-sm" className="font-bold text-green-900 dark:text-green-300">Payment & Trust</Typography>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 relative z-10">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-green-700/70 dark:text-green-400/70 uppercase">Escrow Release</span>
                <span className="text-[14px] font-bold text-green-900 dark:text-green-100">{brand.trustMetrics.escrowReleaseDays} Days avg</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-green-700/70 dark:text-green-400/70 uppercase">Response Rate</span>
                <span className="text-[14px] font-bold text-green-900 dark:text-green-100">{brand.trustMetrics.responseRate}%</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-[11px] font-semibold text-green-700/70 dark:text-green-400/70 uppercase">Repeat Creators</span>
                <span className="text-[14px] font-bold text-green-900 dark:text-green-100">{brand.trustMetrics.repeatCreatorRate}% return for a 2nd campaign</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="px-6 mt-6">
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50" />
        </div>

        {/* Team Section */}
        <div className="px-6 mt-6 flex flex-col gap-3">
          <button 
            className="flex items-center justify-between w-full text-left group"
            onClick={() => setIsTeamExpanded(!isTeamExpanded)}
          >
            <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white">Team you'll work with</Typography>
            {isTeamExpanded && (
              <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            )}
          </button>
          
          {!isTeamExpanded ? (
            <button 
              onClick={() => setIsTeamExpanded(true)}
              className="flex items-center gap-3 w-full text-left group hover:opacity-80 transition-opacity mt-1"
            >
              <div className="flex -space-x-2 shrink-0">
                {brand.team.map((member, i) => (
                  <div key={member.id} className="relative z-[1] w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] overflow-hidden" style={{ zIndex: 10 - i }}>
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between w-full">
                <Typography type="body-sm" className="text-[#3b4756] dark:text-gray-400 text-[15px] truncate">
                  {brand.team.map(m => m.name).join(", ")}
                </Typography>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </button>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              {brand.team.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 dark:border-white/10">
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <Typography type="body-sm" className="font-semibold text-[#0a0a0a] dark:text-white text-[14px] leading-tight">
                      {member.name}
                    </Typography>
                    <Typography type="body-xs" className="text-gray-500 dark:text-gray-400 text-[13px]">
                      {member.role || "Team Member"}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="px-6 mt-6">
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50" />
        </div>

        {/* About Section */}
        <div className="px-6 mt-6 flex flex-col gap-4">
          <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white">About</Typography>
          <Typography type="body-sm" className="text-gray-600 dark:text-gray-300 leading-relaxed text-[14px]">
            {brand.bio}
          </Typography>
          
          <div className="flex flex-col gap-2.5 mt-1">
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4 shrink-0" />
              <a href={`https://maps.google.com/?q=${encodeURIComponent(brand.location)}`} target="_blank" rel="noreferrer" className="text-[13px] font-medium hover:text-gray-900 dark:hover:text-white transition-colors">{brand.location}</a>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Link className="w-4 h-4 shrink-0" />
              <a href={brand.website.startsWith("http") ? brand.website : `https://${brand.website}`} target="_blank" rel="noreferrer" className="text-[13px] font-medium hover:text-gray-900 dark:hover:text-white transition-colors">{brand.website}</a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {brand.categories.map(cat => (
              <div key={cat} className="flex items-center justify-center h-7 px-3 rounded-md bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 text-[12px] font-semibold tracking-wide uppercase">{cat}</div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="px-6 mt-6">
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50" />
        </div>

        {/* Socials */}
        <div className="px-6 mt-6 flex flex-col gap-3">
          <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white mb-2">Socials</Typography>

          <a href={`https://twitter.com/${brand.id}`} target="_blank" rel="noreferrer" className="group flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#25303c] dark:text-white">
                <FontAwesomeIcon icon={faXTwitter} className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[15px] text-[#0a0a0a] dark:text-white tracking-wide">X (Twitter)</span>
            </div>
            <ChevronRight className="w-[18px] h-[18px] text-[#9ca3af]" />
          </a>
          
          {brand.instagram && (
            <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noreferrer" className="group flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 flex items-center justify-center text-[#25303c] dark:text-white">
                  <FontAwesomeIcon icon={faInstagram} className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[15px] text-[#0a0a0a] dark:text-white tracking-wide">Instagram</span>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#9ca3af]" />
            </a>
          )}
          
          {brand.youtube && (
            <a href={`https://youtube.com/@${brand.youtube}`} target="_blank" rel="noreferrer" className="group flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 flex items-center justify-center text-[#25303c] dark:text-white">
                  <FontAwesomeIcon icon={faYoutube} className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[15px] text-[#0a0a0a] dark:text-white tracking-wide">YouTube</span>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#9ca3af]" />
            </a>
          )}
        </div>
        </>
        )}
      </ScrollShadow>
    </div>
  );
}
