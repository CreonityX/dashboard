"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Popover, ListBox } from "@heroui/react";
import {
  Plus,
  Microphone,
  Camera,
  ArrowUp,
  Picture,
  File as FileIcon,
  Folder,
  Calendar,
  Xmark,
} from "@gravity-ui/icons";
import { toast } from "sonner";

type AttachItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ATTACH_ITEMS: AttachItem[] = [
  { id: "media", label: "Media", icon: Picture },
  { id: "document", label: "Document", icon: FileIcon },
  { id: "drive", label: "Drive", icon: Folder },
  { id: "schedule", label: "Schedule", icon: Calendar },
];

export function Composer({
  onSend,
  replyingTo,
  onCancelReply,
  onTypingChange,
}: {
  onSend: (text: string, files: File[]) => void;
  replyingTo?: any;
  onCancelReply?: () => void;
  onTypingChange?: (typing: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [picker, setPicker] = useState<"media" | "document" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (picker) fileRef.current?.click();
  }, [picker]);

  function send() {
    const text = value.trim();
    if (!text && files.length === 0) return;
    onSend(text, files);
    setValue("");
    setFiles([]);
    onTypingChange?.(false);
    toast.success("Message sent");
  }

  function pickFiles(kind: "media" | "document") {
    setPicker(kind);
  }

  return (
    <div className="shrink-0 border-t border-[#efefef] bg-white px-0 dark:border-white/10 dark:bg-[#0a0a0a] flex flex-col">
      {replyingTo && (
        <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-4 py-2 border-b border-[#efefef] dark:border-white/10">
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-[#0a0a0a] dark:text-white truncate">
              Replying to{" "}
              {replyingTo.sender === "me"
                ? "You"
                : replyingTo.senderName || "Unknown"}
            </span>
            <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa] truncate mt-0.5">
              {replyingTo.kind === "text" ? replyingTo.text : "Attachment"}
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-[#0a0a0a] dark:text-white hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
          >
            <Xmark className="h-3 w-3" />
          </button>
        </div>
      )}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-[#efefef] dark:border-white/10">
          {files.map((f, i) => (
            <span
              key={`${f.name}-${i}`}
              className="flex items-center gap-1.5 rounded-lg bg-black/5 dark:bg-white/10 pl-2.5 pr-1.5 py-1 text-[12px] font-medium text-[#0a0a0a] dark:text-white"
            >
              <span className="max-w-[140px] truncate">{f.name}</span>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() =>
                  setFiles((prev) => prev.filter((_, j) => j !== i))
                }
                className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/20"
              >
                <Xmark className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center h-[56px] bg-transparent transition-colors focus-within:bg-black/[0.02] dark:focus-within:bg-white/[0.02]">
        {/* Attachment popover */}
        <Popover placement={"top" as any} offset={15} crossOffset={70 as any}>
          <Popover.Trigger>
            <button
              aria-label="Add attachment"
              className="h-[56px] w-[56px] shrink-0 flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </Popover.Trigger>
          <Popover.Content className="w-[180px] p-1">
            <ListBox
              aria-label="Attachment options"
              className="w-full"
              selectionMode="none"
              onAction={(key) => {
                if (key === "media" || key === "document") pickFiles(key);
                else
                  toast.info("Coming Soon", {
                    description: "This feature is not yet available.",
                  });
              }}
            >
              {ATTACH_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.label}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-5 w-5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                      <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">
                        {item.label}
                      </span>
                    </div>
                  </ListBox.Item>
                );
              })}
            </ListBox>
          </Popover.Content>
        </Popover>

        {/* Message input — native input for full className control */}
        <input
          aria-label="Message"
          placeholder="Message..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onTypingChange?.(e.target.value.length > 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          className="flex-1 h-full bg-transparent px-2 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none dark:text-white"
        />
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          accept={picker === "media" ? "image/*,video/*" : "*/*"}
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []).slice(0, 5);
            if (picked.length > 0)
              setFiles((prev) => [...prev, ...picked].slice(0, 5));
            e.target.value = "";
            setPicker(null);
          }}
        />

        {/* Send / media controls */}
        <div className="flex shrink-0 items-center">
          <button
            aria-label="Voice message"
            className="h-[56px] w-[40px] flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
          >
            <Microphone className="h-5 w-5" />
          </button>
          <button
            aria-label="Camera"
            className="h-[56px] w-[40px] flex sm:hidden items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors"
          >
            <Camera className="h-5 w-5" />
          </button>
          <button
            aria-label="Send"
            onClick={send}
            className="h-[56px] w-[56px] shrink-0 bg-transparent text-[#0a0a0a] dark:text-white flex items-center justify-center transition-colors hover:text-[#737373] dark:hover:text-[#a1a1aa]"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
