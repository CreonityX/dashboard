"use client"

import { Card, Typography, Popover, ListBox, toast } from "@heroui/react"
import { ArrowUpFromSquare, EllipsisVertical, PersonPencil, Picture, SealCheck, Gear, ChartColumn, QrCode, BellSlash, Ban, CircleExclamation } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"

type ProfileMediaHeaderProps = {
  avatar?: string
  coverImage?: string
  isEditing: boolean
  name: string
  studio: string
  avatarInputRef: React.RefObject<HTMLInputElement | null>
  coverInputRef: React.RefObject<HTMLInputElement | null>
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, field: "coverImage" | "avatar") => void
  isOwnProfile?: boolean
}

export function ProfileMediaHeader({
  avatar,
  coverImage,
  isEditing,
  name,
  studio,
  avatarInputRef,
  coverInputRef,
  onImageUpload,
  isOwnProfile,
}: ProfileMediaHeaderProps) {
  return (
    <>
      <div className="relative pt-0 lg:px-2 lg:pt-2 pb-2">
        <Card
          className={cn(
            "group relative h-[180px] w-full shrink-0 overflow-hidden rounded-2xl border-none bg-transparent shadow-none",
            isEditing && "cursor-pointer",
          )}
          onClick={() => isEditing && coverInputRef.current?.click()}
        >
          {coverImage ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff7a00] via-[#ff004d] to-[#8000ff] opacity-90 mix-blend-multiply dark:mix-blend-normal" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <Typography type="h3" className="text-white drop-shadow-md">{studio}</Typography>
          </div>
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <Picture width={30} height={30} className="text-white" />
            </div>
          )}
        </Card>
        <input
          ref={coverInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(event) => onImageUpload(event, "coverImage")}
        />
      </div>

      <div className="relative h-10 w-full shrink-0">
        <div className="absolute -top-12 left-6">
          <div
            className={cn("group relative rounded-full", isEditing && "cursor-pointer")}
            onClick={() => isEditing && avatarInputRef.current?.click()}
          >
            {avatar ? (
              <div
                className="h-[76px] w-[76px] overflow-hidden rounded-full bg-cover bg-center shadow-sm ring-4 ring-white dark:ring-[#0a0a0a]"
                style={{ backgroundImage: `url(${avatar})` }}
              />
            ) : (
              <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] text-[28px] font-bold tracking-tight text-white shadow-sm ring-4 ring-white dark:ring-[#0a0a0a]">
                {name.charAt(0)}
              </div>
            )}
            {!isEditing && (
              <div className="absolute bottom-0 right-0 z-10 rounded-full bg-white p-[1.5px] dark:bg-[#0a0a0a]">
                <SealCheck className="h-[18px] w-[18px] text-[#0060ff]" />
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                <PersonPencil width={22} height={22} className="text-white" />
              </div>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(event) => onImageUpload(event, "avatar")}
          />
        </div>

        {!isEditing && (
          <div className="absolute right-0 lg:right-2 top-2 flex items-center gap-4">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(`Copied link to ${name}'s profile`);
              }}
              aria-label="Share profile" 
              className="flex items-center justify-center text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white outline-none"
            >
              <ArrowUpFromSquare className="h-5 w-5" />
            </button>
            <Popover placement="bottom-end">
              <Popover.Trigger>
                <button aria-label="More profile actions" className="flex items-center justify-center text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white outline-none">
                  <EllipsisVertical className="h-5 w-5" />
                </button>
              </Popover.Trigger>
              <Popover.Content className="w-[180px] p-1">
                <ListBox 
                  aria-label="Profile Actions" 
                  onAction={(key) => {
                    if (key === "copy") {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success(`Copied link to ${name}'s profile`);
                    } else if (key === "report" || key === "block" || key === "mute") {
                      toast.success(`Account ${key}ed`);
                    } else {
                      toast.info("Feature coming soon");
                    }
                  }}
                >
                  {isOwnProfile ? [
                    <ListBox.Item key="settings" textValue="Settings">
                      <div className="flex items-center gap-2.5">
                        <Gear className="h-5 w-5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Settings</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="analytics" textValue="View Analytics">
                      <div className="flex items-center gap-2.5">
                        <ChartColumn className="h-5 w-5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">View Analytics</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="qr" textValue="Show QR code" showDivider>
                      <div className="flex items-center gap-2.5">
                        <QrCode className="h-5 w-5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Show QR code</span>
                      </div>
                    </ListBox.Item>
                  ] : [
                    <ListBox.Item key="mute" textValue="Mute account">
                      <div className="flex items-center gap-2.5">
                        <BellSlash className="h-5 w-5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Mute account</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="block" textValue="Block account">
                      <div className="flex items-center gap-2.5">
                        <Ban className="h-5 w-5 shrink-0 text-danger" />
                        <span className="text-[14px] font-medium text-danger">Block account</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="report" textValue="Report account">
                      <div className="flex items-center gap-2.5">
                        <CircleExclamation className="h-5 w-5 shrink-0 text-danger" />
                        <span className="text-[14px] font-medium text-danger">Report account</span>
                      </div>
                    </ListBox.Item>
                  ]}
                </ListBox>
              </Popover.Content>
            </Popover>
          </div>
        )}
      </div>
    </>
  )
}
