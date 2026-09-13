"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button, Switch } from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";
import { toast } from "sonner";
import {
  blockUserAction,
  exportSettingsDataAction,
  getDeletionRequestStatusAction,
  getPrivacySettingsAction,
  listUserBlocksAction,
  requestDataDeletionAction,
  unblockUserAction,
  updatePrivacySettingsAction,
} from "@/app/actions/settings";
import type { PrivacySettings, UserBlock } from "@/lib/api";
import { useAccount } from "@/context/account-context";

const VIS_TO_UI = {
  public: "public",
  members: "creators",
  private: "private",
} as const;
const VIS_TO_WIRE = {
  public: "public",
  creators: "members",
  private: "private",
} as const;

const MSG_TO_UI = {
  everyone: "Everyone",
  verified_only: "Verified Brands & Partners Only",
  connections_only: "Existing Connections Only",
} as const;
const MSG_TO_WIRE = {
  Everyone: "everyone",
  "Verified Brands & Partners Only": "verified_only",
  "Existing Connections Only": "connections_only",
} as const;

export function PrivacyView({ onBack }: { onBack?: () => void }) {
  const { isBrand } = useAccount();
  const [msgPrivacyOpen, setMsgPrivacyOpen] = useState(false);
  const [msgPrivacyValue, setMsgPrivacyValue] = useState(
    "Verified Brands & Partners Only",
  );
  const [visibility, setVisibility] = useState("public");
  const [showOnline, setShowOnline] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [typingIndicators, setTypingIndicators] = useState(true);
  const [privacyLive, setPrivacyLive] = useState(false);

  useEffect(() => {
    void getPrivacySettingsAction(isBrand).then((r) => {
      if (!r.success) return;
      setPrivacyLive(true);
      const w = r.data;
      setVisibility(VIS_TO_UI[w.visibility] ?? "public");
      setShowOnline(w.showOnlineStatus);
      setShowActivity(w.showActivityStatus);
      setShareAnalytics(w.shareAnalytics);
      setAllowIndexing(w.allowIndexing);
      setMsgPrivacyValue(
        MSG_TO_UI[w.messagePrivacy] ?? MSG_TO_UI.verified_only,
      );
      setReadReceipts(w.readReceipts);
      setTypingIndicators(w.typingIndicators);
    });
    void listUserBlocksAction(isBrand).then((r) => {
      if (r.success) setBlockedUsers(r.data);
    });
    void getDeletionRequestStatusAction(isBrand).then((r) => {
      if (r.success && r.data.status !== "none") setDeletionStatus(r.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrand]);

  function persist(patch: Partial<PrivacySettings>) {
    if (!privacyLive) return;
    void updatePrivacySettingsAction(isBrand, patch).then((r) => {
      if (!r.success) toast.error(r.error);
    });
  }

  function changeVisibility(v: "public" | "creators" | "private") {
    setVisibility(v);
    persist({ visibility: VIS_TO_WIRE[v] });
  }

  function changeMsgPrivacy(v: keyof typeof MSG_TO_WIRE) {
    setMsgPrivacyValue(v);
    setMsgPrivacyOpen(false);
    persist({ messagePrivacy: MSG_TO_WIRE[v] });
  }

  const [isManageBlockedOpen, setIsManageBlockedOpen] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<UserBlock[]>([]);
  const [blockEmail, setBlockEmail] = useState("");
  const [deletionStatus, setDeletionStatus] = useState<{
    status: string;
    requestedAt: string;
  } | null>(null);

  async function handleUnblock(user: UserBlock) {
    const r = await unblockUserAction(isBrand, user.blockedUserId);
    if (!r.success) {
      toast.error(r.error);
      return;
    }
    setBlockedUsers((prev) => prev.filter((u) => u.id !== user.id));
    toast.success("User unblocked");
  }

  async function handleBlock() {
    if (!blockEmail.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    const r = await blockUserAction(isBrand, { email: blockEmail.trim() });
    if (!r.success) {
      toast.error(r.error);
      return;
    }
    setBlockEmail("");
    const list = await listUserBlocksAction(isBrand);
    if (list.success) setBlockedUsers(list.data);
    toast.success("User blocked");
  }

  async function handleDeletionRequest() {
    const r = await requestDataDeletionAction(isBrand);
    if (!r.success) {
      toast.error(r.error);
      return;
    }
    setDeletionStatus(r.data);
    toast.success("Deletion request sent", {
      description: "We will process your request within 30 days.",
    });
  }

  async function handleDownloadData() {
    const r = await exportSettingsDataAction(isBrand);
    if (!r.success) {
      toast.error(r.error);
      return;
    }
    const blob = new Blob([JSON.stringify(r.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "creonity-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data download started", {
      description: "Your archive is downloading now.",
    });
  }

  return (
    <div className="mx-auto max-w-5xl pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors"
            >
              <Icon
                icon="gravity-ui:chevron-left"
                className="size-5 text-[#0a0a0a] dark:text-white"
              />
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">
            Privacy & Data
          </h1>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col gap-6">
        {/* PROFILE VISIBILITY */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">
            Profile Visibility
          </h3>

          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 cursor-pointer"
              onClick={() => changeVisibility("public")}
            >
              <div className="flex flex-col pointer-events-none">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Public (Recommended)
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa] mt-0.5">
                  Anyone can view your profile. Brands can find you in the
                  creator search.
                </span>
              </div>
              <div className="shrink-0 ml-4 pointer-events-none">
                <Switch
                  isSelected={visibility === "public"}
                  onChange={() => changeVisibility("public")}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>

            <div
              className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 cursor-pointer"
              onClick={() => changeVisibility("creators")}
            >
              <div className="flex flex-col pointer-events-none">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Creators & Brands Only
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa] mt-0.5">
                  Only registered users can view your profile. Hidden from
                  search engines.
                </span>
              </div>
              <div className="shrink-0 ml-4 pointer-events-none">
                <Switch
                  isSelected={visibility === "creators"}
                  onChange={() => changeVisibility("creators")}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>

            <div
              className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 cursor-pointer"
              onClick={() => changeVisibility("private")}
            >
              <div className="flex flex-col pointer-events-none">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Private
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa] mt-0.5">
                  Only you and brands you have active deals with can view your
                  profile.
                </span>
              </div>
              <div className="shrink-0 ml-4 pointer-events-none">
                <Switch
                  isSelected={visibility === "private"}
                  onChange={() => changeVisibility("private")}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Status */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">
            Activity Status
          </h3>

          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Show Online Status
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">
                  Allow brands and creators to see when you are online in
                  messages.
                </span>
              </div>
              <div className="shrink-0 ml-4">
                <Switch
                  isSelected={showOnline}
                  onChange={() => {
                    const v = !showOnline;
                    setShowOnline(v);
                    persist({ showOnlineStatus: v });
                  }}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Show Activity Status
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">
                  Share your recent activity (like "Viewed 2 hours ago") on your
                  profile.
                </span>
              </div>
              <div className="shrink-0 ml-4">
                <Switch
                  isSelected={showActivity}
                  onChange={() => {
                    const v = !showActivity;
                    setShowActivity(v);
                    persist({ showActivityStatus: v });
                  }}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Data sharing with analytics
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">
                  Help us improve Creonity by sharing anonymous usage data.
                </span>
              </div>
              <div className="shrink-0 ml-4">
                <Switch
                  isSelected={shareAnalytics}
                  onChange={() => {
                    const v = !shareAnalytics;
                    setShareAnalytics(v);
                    persist({ shareAnalytics: v });
                  }}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Indexing
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">
                  Allow search engines and AI to index your public profile and
                  content.
                </span>
              </div>
              <div className="shrink-0 ml-4">
                <Switch
                  isSelected={allowIndexing}
                  onChange={() => {
                    const v = !allowIndexing;
                    setAllowIndexing(v);
                    persist({ allowIndexing: v });
                  }}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGING PRIVACY */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">
            Messaging Privacy
          </h3>

          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
              <div className="flex flex-col gap-0.5 shrink-0">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Who can message you?
                </span>
              </div>

              <div className="relative w-full sm:max-w-[280px]">
                <button
                  onClick={() => setMsgPrivacyOpen(!msgPrivacyOpen)}
                  className="flex items-center justify-between w-full px-4 h-10 bg-transparent border border-[#e4e4e7] dark:border-[#27272a] hover:bg-[#e4e4e7]/50 dark:hover:bg-[#27272a]/50 text-[#0a0a0a] dark:text-white rounded-xl transition-colors font-medium text-[14px]"
                >
                  <span className="truncate">{msgPrivacyValue}</span>
                  <Icon
                    icon="gravity-ui:chevron-down"
                    className={`size-4 text-[#737373] dark:text-[#a1a1aa] transition-transform shrink-0 ml-2 ${msgPrivacyOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {msgPrivacyOpen && (
                  <div className="absolute right-0 top-full mt-2 w-full min-w-[240px] bg-white dark:bg-[#111111] border border-[#efefef] dark:border-[#27272a] rounded-xl shadow-xl flex flex-col p-1 overflow-hidden z-[100]">
                    {[
                      "Everyone",
                      "Verified Brands & Partners Only",
                      "Existing Connections Only",
                    ].map((val) => (
                      <button
                        key={val}
                        onClick={() =>
                          changeMsgPrivacy(val as keyof typeof MSG_TO_WIRE)
                        }
                        className={`flex items-center gap-3 px-3 py-2 text-left text-[14px] font-medium rounded-lg transition-colors ${
                          msgPrivacyValue === val
                            ? "bg-[#f4f4f5] dark:bg-[#27272a] text-[#0a0a0a] dark:text-white"
                            : "text-[#0a0a0a] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Read Receipts
                </span>
                <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">
                  Let others know when you've read their messages.
                </span>
              </div>
              <div className="shrink-0 ml-4">
                <Switch
                  isSelected={readReceipts}
                  onChange={() => {
                    const v = !readReceipts;
                    setReadReceipts(v);
                    persist({ readReceipts: v });
                  }}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 min-h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Typing Indicators
                </span>
                <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">
                  Show when you are typing a message.
                </span>
              </div>
              <div className="shrink-0 ml-4">
                <Switch
                  isSelected={typingIndicators}
                  onChange={() => {
                    const v = !typingIndicators;
                    setTypingIndicators(v);
                    persist({ typingIndicators: v });
                  }}
                  size="sm"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCKED ACCOUNTS */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">
            Blocked Accounts
          </h3>

          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
              <input
                value={blockEmail}
                onChange={(e) => setBlockEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleBlock();
                }}
                placeholder="Block by email"
                className="flex-1 min-w-0 h-9 px-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[14px] text-[#0a0a0a] dark:text-white outline-none placeholder:text-[#a1a1aa]"
              />
              <Button
                onClick={() => void handleBlock()}
                className="bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:hover:bg-[#27272a] text-[#0a0a0a] dark:text-white font-medium rounded-xl h-9 px-4 transition-colors"
              >
                Block
              </Button>
            </div>
            <div
              className={`flex items-center justify-between px-6 py-4 min-h-[72px] transition-colors ${isManageBlockedOpen ? "border-b border-[#f4f4f5] dark:border-[#1f1f1f] bg-gray-50/50 dark:bg-white/[0.02]" : ""}`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">
                  Manage Blocked Users
                </span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">
                  View and manage the list of accounts you have blocked from
                  messaging you or viewing your profile.
                </span>
              </div>
              <div className="shrink-0 ml-4">
                <Button
                  onClick={() => setIsManageBlockedOpen(!isManageBlockedOpen)}
                  className={`bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:hover:bg-[#27272a] text-[#0a0a0a] dark:text-white font-medium rounded-xl h-9 px-4 transition-colors ${isManageBlockedOpen ? "bg-[#e4e4e7] dark:bg-[#27272a]" : ""}`}
                >
                  {isManageBlockedOpen ? "Done" : "Manage"}
                </Button>
              </div>
            </div>

            {isManageBlockedOpen && (
              <div className="flex flex-col p-2">
                {blockedUsers.length > 0 ? (
                  blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#27272a] flex items-center justify-center text-[13px] font-bold text-[#737373] dark:text-[#a1a1aa]">
                          {user.blockedUserId.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">
                            Blocked user
                          </span>
                          <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() => void handleUnblock(user)}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#0a0a0a] dark:text-white font-medium rounded-lg h-8 px-3"
                      >
                        Unblock
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#27272a] flex items-center justify-center mb-3">
                      <Icon
                        icon="gravity-ui:shield-check"
                        className="w-6 h-6 text-[#737373] dark:text-[#a1a1aa]"
                      />
                    </div>
                    <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">
                      No blocked users
                    </span>
                    <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa] mt-1 max-w-[250px]">
                      You haven't blocked any accounts yet.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DATA EXPORT */}
        <div className="flex flex-col mb-8 max-w-3xl">
          <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white mb-4">
            Your Data
          </h3>

          <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] rounded-2xl flex flex-col overflow-hidden p-6 gap-6">
            <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa]">
              Manage the data you share with Creonity. You can download a copy
              of your data or request complete deletion of your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => void handleDownloadData()}
                className="bg-[#f4f4f5] dark:bg-[#1f1f1f] border border-[#e4e4e7] dark:border-[#3f3f46] text-[#0a0a0a] dark:text-white font-medium rounded-xl h-10 px-5"
                startContent={
                  <Icon icon="ph:download-simple" className="w-4 h-4" />
                }
              >
                Download my data
              </Button>{" "}
              <Button
                onClick={() => void handleDeletionRequest()}
                isDisabled={deletionStatus !== null}
                variant="flat"
                color="danger"
                className="font-medium rounded-xl h-10 px-5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                startContent={<TrashBin className="w-4 h-4" />}
              >
                {deletionStatus
                  ? "Deletion requested"
                  : "Request data deletion"}
              </Button>
            </div>
            {deletionStatus && (
              <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">
                Request filed on{" "}
                {new Date(deletionStatus.requestedAt).toLocaleDateString()}. We
                will process it within 30 days.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
