"use client"
import { useTheme } from "next-themes";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Button, Dropdown, ScrollShadow, AlertDialog, toast, Popover, ListBox } from "@heroui/react"
import { useProfile, ProfileData } from "@/context/profile-context";
import { ProfileEditorForm } from "@/components/profile/profile-editor-form";
import { ProfileMediaHeader } from "@/components/profile/profile-media-header";
import { BrandLogo } from "@/components/ui/brand-logo";
import { 
  SealCheck, 
  Link, 
  Ellipsis, 
  StarFill, 
  PersonPlus, 
  Comment, 
  ChevronDown, 
  MapPin, 
  Plus, 
  PersonPencil,
  Briefcase,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  SquareFill,
  SquareArticle,
  ChevronRight,
  Globe,
  LogoLinkedin,
  ChevronLeft,
  CircleInfo,
  Check,
  EllipsisVertical,
  Gear,
  ClockArrowRotateLeft,
  Moon,
  CircleQuestion,
  ArrowRightFromSquare,
} from "@gravity-ui/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Typography } from "@heroui/react";
import { ChevronLeft as ChevronLeftLucide } from "lucide-react";

export function ProfileCard({ 
  isOwnProfile = false, 
  isCreator = true,
  isEditing: externalIsEditing,
  onEditingChange,
}: { 
  isOwnProfile?: boolean
  isCreator?: boolean
  isEditing?: boolean
  onEditingChange?: (val: boolean) => void
}) {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  // Use externally-controlled state when provided, fall back to internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = (val: boolean) => {
    setInternalIsEditing(val);
    onEditingChange?.(val);
  };
  const [editData, setEditData] = useState<ProfileData>(profile);
  const [isBrandHovered, setIsBrandHovered] = useState(false);
  const [isMobileAboutVisible, setIsMobileAboutVisible] = useState(false);
  const [expandedBrandId, setExpandedBrandId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoutTriggerRef = useRef<HTMLButtonElement>(null);

  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isEditing) {
      setEditData(profile);
    }
  }, [isEditing, profile]);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "coverImage" | "avatar") => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData(prev => ({ ...prev, [field]: url }));
    }
  };

  useEffect(() => {
    if (isBrandHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 12
      });
    }
  }, [isBrandHovered]);

  return (
    <div className="relative flex w-full flex-col overflow-hidden bg-white lg:h-full lg:rounded-2xl lg:border lg:border-gray-200/70 lg:shadow-sm dark:bg-[#0a0a0a] dark:lg:border-white/10">
      {isEditing && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0a0a0a] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(false)} className="text-gray-900 dark:text-white">
              <ChevronLeftLucide width={24} height={24} />
            </button>
            <Typography type="h6" className="text-[#0a0a0a] dark:text-white leading-none font-semibold">Edit profile</Typography>
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
                        <AlertDialog.Heading>Save changes?</AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p className="text-gray-600 dark:text-gray-300">Are you sure you want to save these changes to your profile?</p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="tertiary">
                          Cancel
                        </Button>
                        <Button onPress={() => { handleSave(); toast.success("Profile updated successfully!"); renderProps.close(); }}>
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
      {/* Cover Pattern & Header */}

      <div className="relative">
        {!isEditing && (
          <>
            <button
              onClick={() => router.push("/")}
              className="lg:hidden absolute top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0a0a0a] shadow-md transition-transform active:scale-95"
            >
              <ChevronLeft width={24} height={24} />
            </button>
            <div className="lg:hidden absolute top-4 right-4 z-50">
              <Popover placement="bottom-end">
                <Popover.Trigger>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0a0a0a] shadow-md transition-transform active:scale-95 outline-none"
                  >
                    <EllipsisVertical width={24} height={24} />
                  </button>
                </Popover.Trigger>
              <Popover.Content className="w-[300px] p-2">
                <ListBox 
                  aria-label="More options" 
                  className="w-full" 
                  selectionMode="none"
                  items={[
                    { key: "settings", label: "Settings", icon: Gear },
                    { key: "activity", label: "Your activity", icon: ClockArrowRotateLeft },
                    { key: "appearance", label: "Switch appearance", icon: Moon },
                    { key: "support", label: "Support", icon: CircleQuestion, showDivider: true },
                    { key: "logout", label: "Log out", icon: ArrowRightFromSquare }
                  ]}
                  onAction={(key) => {
                    if (String(key) === "appearance" && mounted) {
                      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                      toast.success("Appearance Updated", { description: "Your theme has been applied successfully." })
                    } else if (String(key) === "support") {
                      router.push("/support")
                    } else if (String(key) === "logout") {
                      logoutTriggerRef.current?.click()
                    } else {
                      toast.info("Coming Soon", { description: "This feature will be available shortly." })
                    }
                  }}
                >
                  {(item) => (
                    <ListBox.Item key={item.key} textValue={item.label} showDivider={item.showDivider} color={item.key === "logout" ? "danger" : "default"}>
                      <div className={cn("flex items-center gap-3.5 w-full h-full", item.showDivider ? "pb-3 pt-1.5" : "py-1.5")}>
                        <item.icon className={cn("h-[22px] w-[22px] shrink-0", item.key === "logout" ? "text-danger" : "text-[#737373] dark:text-[#a1a1aa]")} />
                        <Typography type="body-sm" className={cn("font-medium", item.key === "logout" ? "text-danger" : "text-[#0a0a0a] dark:text-white")}>{item.label}</Typography>
                      </div>
                    </ListBox.Item>
                  )}
                </ListBox>
              </Popover.Content>
            </Popover>
            </div>
            <AlertDialog>
              <AlertDialog.Trigger className="hidden">
                <button ref={logoutTriggerRef} className="hidden">Log out</button>
              </AlertDialog.Trigger>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                    {(renderProps: any) => (
                      <>
                        <AlertDialog.CloseTrigger />
                        <AlertDialog.Header>
                          <AlertDialog.Icon status="danger" />
                          <AlertDialog.Heading>Log out?</AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                          <p className="text-gray-600 dark:text-gray-300">Are you sure you want to log out of your account?</p>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                          <Button slot="close" variant="tertiary">Cancel</Button>
                          <Button variant="danger" onPress={() => { toast.success("Logged out successfully"); renderProps.close(); }}>Log out</Button>
                        </AlertDialog.Footer>
                      </>
                    )}
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          </>
        )}
      </div>

      <ProfileMediaHeader
        avatar={isEditing ? editData.avatar : profile.avatar}
        coverImage={isEditing ? editData.coverImage : profile.coverImage}
        isEditing={isEditing}
        name={isEditing ? editData.name : profile.name}
        studio={isEditing ? editData.studio : profile.studio}
        avatarInputRef={avatarInputRef}
        coverInputRef={coverInputRef}
        onImageUpload={handleImageUpload}
        isOwnProfile={isOwnProfile}
      />

      {isEditing ? (
        <ProfileEditorForm 
          value={editData} 
          onChange={setEditData} 
          onSubmit={() => { handleSave(); toast.success("Profile updated successfully!"); }}
        />
      ) : (
        <>
          {/* Identity */}
          <div className="px-6 mt-4 flex flex-col gap-0.5">
            <Typography type="h4" className="text-[#0a0a0a] dark:text-white leading-none">
              {profile.name}
            </Typography>
            {profile.showRealName && profile.realName && (
              <Typography type="body-sm" className="text-gray-500 dark:text-gray-400 font-medium">
                {profile.realName}
              </Typography>
            )}
            <Typography type="body-sm" className="text-gray-500 dark:text-gray-400 mt-0.5">
              {profile.tagline} <span className="text-gray-300 dark:text-gray-600 mx-1.5 font-normal">|</span> {profile.studio}
            </Typography>
          </div>

          {/* Stats */}
          <div className="px-6 mt-5 flex items-center gap-6">
            <div className="flex flex-col gap-0.5">
              <Typography type="body-xs" className="text-gray-500">Followers</Typography>
              <Typography type="h6" className="text-[#0a0a0a] dark:text-white leading-none">{profile.followers}</Typography>
            </div>
            <div className="flex flex-col gap-0.5">
              <Typography type="body-xs" className="text-gray-500">Views</Typography>
              <Typography type="h6" className="text-[#0a0a0a] dark:text-white leading-none">{profile.views}</Typography>
            </div>
            <div className="flex flex-col gap-0.5">
              <Typography type="body-xs" className="text-gray-500">Posts</Typography>
              <Typography type="h6" className="text-[#0a0a0a] dark:text-white leading-none">{profile.posts}</Typography>
            </div>
          </div>

          {/* Main Buttons */}
          <div className="px-0 lg:px-6 mt-6 flex items-center gap-4 lg:gap-2">
            {isOwnProfile ? (
              <>
                <Button 
                  onPress={() => setIsEditing(true)}
                  variant="outline"
                  className="h-[36px] bg-transparent border border-gray-200 dark:border-gray-800 text-[#0a0a0a] dark:text-white font-semibold text-[13px] rounded-xl flex-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <PersonPencil className="w-4 h-4 text-gray-500" />
                  Edit profile
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsMobileAboutVisible(!isMobileAboutVisible)}
                  className="h-[36px] bg-transparent border border-gray-200 dark:border-gray-800 text-[#0a0a0a] dark:text-white font-semibold text-[13px] rounded-xl flex-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors lg:hidden"
                >
                  <CircleInfo className="w-4 h-4 text-gray-500" />
                  About
                </Button>
                <Button 
                  variant="outline"
                  className="h-[36px] bg-transparent border border-gray-200 dark:border-gray-800 text-[#0a0a0a] dark:text-white font-semibold text-[13px] rounded-xl flex-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors hidden lg:flex"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                  View profile
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="h-[36px] bg-[#0060ff] text-white font-semibold text-[13px] rounded-xl flex-[1.5]"
                >
                  <PersonPlus className="w-4 h-4" />
                  Connect
                </Button>
                <Button 
                  variant="outline"
                  className="h-[36px] bg-transparent border border-gray-200 dark:border-gray-800 text-[#0a0a0a] dark:text-white font-semibold text-[13px] rounded-xl flex-1 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <Comment className="w-4 h-4" />
                  Message
                </Button>
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button 
                      isIconOnly
                      variant="outline"
                      className="h-[36px] w-[36px] min-w-[36px] bg-transparent border border-gray-200 dark:border-gray-800 text-[#0a0a0a] dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu aria-label="More actions">
                    <Dropdown.Item key="share"><Link width={16} /> Share Profile</Dropdown.Item>
                    <Dropdown.Item key="report" className="text-danger">Report User</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </div>

      <div className={cn("flex-col", isMobileAboutVisible ? "flex" : "hidden lg:flex")}>

      <div className="px-6 mt-6">
        <div className="w-full border-t-[1.5px] border-dotted border-gray-200/80 dark:border-gray-800" />
      </div>

      {/* About Section */}
      <div className="px-6 mt-6 flex flex-col gap-4">
        <Typography type="h6" className="font-bold text-[#0a0a0a] dark:text-white">About</Typography>
        <Typography type="body-sm" className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {profile.about}
        </Typography>
        
        <div className="flex flex-col gap-2.5 mt-1">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 shrink-0" />
            <a href={`https://maps.google.com/?q=${encodeURIComponent(profile.location)}`} target="_blank" rel="noreferrer" className="text-[13px] font-medium hover:text-gray-900 dark:hover:text-white transition-colors">{profile.location}</a>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Link className="w-4 h-4 shrink-0" />
            <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="text-[13px] font-medium hover:text-gray-900 dark:hover:text-white transition-colors">{profile.website}</a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {profile.skills.map(skill => (
            <div key={skill} className="flex items-center justify-center h-7 px-3 rounded-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-[13px] font-medium">{skill}</div>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="w-full border-t-[1.5px] border-dotted border-gray-200/80 dark:border-gray-800" />
      </div>

      {/* Socials */}
      {profile.socials.length > 0 && (
        <>
          <div className="px-6 mt-6 flex flex-col gap-3">
            <Typography type="h6" className="font-bold text-[#0a0a0a] dark:text-white">Socials</Typography>
            {profile.socials.map(social => (
              <a href={social.url} target="_blank" rel="noreferrer" key={social.id} className="flex items-center justify-between group cursor-pointer py-1.5">
                <div className="flex items-center gap-3.5">
                  {social.platform.includes("X") || social.platform.includes("Twitter") ? (
                    <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : social.platform.includes("Instagram") ? (
                    <FontAwesomeIcon icon={faInstagram} className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Link className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                  <Typography type="body-sm" className="font-medium text-[#0a0a0a] dark:text-white">{social.platform}</Typography>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
          <div className="px-6 mt-6">
            <div className="w-full border-t-[1.5px] border-dotted border-gray-200/80 dark:border-gray-800" />
          </div>
        </>
      )}

      {/* Agency / Team */}
      <div className="px-6 mt-6 flex flex-col gap-3">
        <Typography type="h6" className="font-bold text-[#0a0a0a] dark:text-white">Agency / Team</Typography>
        
        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#FF7A00] via-[#FF004D] to-[#8000FF] shadow-inner flex shrink-0"></div>
            <div className="flex flex-col">
              <Typography type="body-sm" className="font-bold text-[#0a0a0a] dark:text-white leading-tight">{profile.agency?.name ?? "Independent"}</Typography>
              <Typography type="body-xs" className="text-gray-500">{profile.agency?.type ?? "No agency or team"}</Typography>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="w-full border-t-[1.5px] border-dotted border-gray-200/80 dark:border-gray-800" />
      </div>

      {/* Work Experience */}
      {profile.experience.length > 0 && (
        <div className="px-6 mt-6 flex flex-col gap-5">
          <Typography type="h6" className="font-bold text-[#0a0a0a] dark:text-white">
            {isCreator ? "Worked with" : "Work experience"}
          </Typography>
          
          <div className={cn("flex flex-col", isCreator ? "gap-2" : "gap-4")}>
            {profile.experience.map(exp => {
              const isExpanded = expandedBrandId === exp.id;
              const workLinkCount = exp.workLinks?.filter((workLink) => workLink.title && workLink.url).length ?? 0;

              if (isCreator) {
                return (
                  <div key={exp.id} className="flex flex-col">
                    <button type="button" onClick={() => setExpandedBrandId(isExpanded ? null : exp.id)} className="group flex min-h-[58px] w-full items-center gap-4 py-2 text-left">
                      <div
                        className={cn("flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl", !exp.domain && "border border-gray-200 dark:border-gray-800")}
                        style={!exp.domain && exp.logoBg ? { backgroundColor: exp.logoBg } : {}}
                      >
                        {exp.domain ? <BrandLogo domain={exp.domain} name={exp.company ?? ""} className="h-full w-full object-contain" /> : <ArrowUpRight className="h-5 w-5 text-white" />}
                      </div>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{exp.company}</span>
                        <span className="mt-0.5 block text-[13px] text-gray-500">{workLinkCount ? `${workLinkCount} featured ${workLinkCount === 1 ? "project" : "projects"}` : "Collaboration details"}</span>
                      </span>
                      <ChevronDown className={cn("h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300", isExpanded && "rotate-180")} />
                    </button>

                    {isExpanded && (
                      <div className="relative animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
                        {/* Timeline Vertical Line */}
                        <div className="absolute left-[23px] top-0 bottom-4 w-[2px] bg-gray-200 dark:bg-gray-800" />
                        
                        <div className="pl-12 pb-4 flex flex-col gap-4">
                          {exp.description && <p className="text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-300">{exp.description}</p>}
                          {workLinkCount > 0 && (
                            <div className="flex flex-col gap-3">
                              {exp.workLinks?.filter((workLink) => workLink.title && workLink.url).map((workLink) => (
                                <div key={workLink.id} className="relative flex items-center">
                                  {/* Timeline Circle */}
                                  <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-[2px] border-gray-300 bg-white dark:border-gray-600 dark:bg-[#0a0a0a]" />
                                  
                                  <a
                                    href={workLink.url.startsWith("http") ? workLink.url : `https://${workLink.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex flex-col justify-center rounded-xl bg-gray-50 px-4 py-3 transition hover:bg-gray-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] w-full"
                                  >
                                    <span className="text-[13.5px] font-semibold text-[#0a0a0a] dark:text-white transition-colors flex items-center justify-between gap-1.5 w-full">
                                      <span className="truncate">{workLink.title}</span>
                                      <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-[#0060ff] dark:group-hover:text-[#4d90fe] transition-colors" />
                                    </span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={exp.id} className="flex items-start gap-3">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md", !exp.domain && "border border-gray-200 dark:border-gray-800")} style={!exp.domain && exp.logoBg ? { backgroundColor: exp.logoBg } : {}}>
                    {exp.domain ? <BrandLogo domain={exp.domain} name={exp.company ?? ""} className="h-full w-full object-contain" /> : <ArrowUpRight className="h-6 w-6 text-white" />}
                  </div>
                  <div className="flex flex-col">
                    <Typography type="body-sm" className="font-bold leading-tight text-[#0a0a0a] dark:text-white">{exp.role}</Typography>
                    <Typography type="body-xs" className="font-medium text-gray-500">{exp.company}</Typography>
                    <Typography type="body-xs" className="mt-1 text-gray-400">{exp.startDate} – {exp.endDate}</Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </div>
      </>
      )}
    </ScrollShadow>
  </div>
  )
}
