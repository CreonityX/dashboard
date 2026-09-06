/**
 * Adapter: backend `Notification` → the existing UI's `NotificationGroup[]`.
 *
 * The notifications page hasn't changed in years and the visual design
 * (gradient avatar, kind chip, right-side badge/icon) is part of the
 * product. The backend doesn't carry `avatarTone` or `actors[].name`
 * because the actors are users referenced by id; the inbox page is
 * best-effort: if there's an actor_user_id, show "Someone" (a future
 * phase can join to user_accounts / creator_accounts and resolve the
 * display name). Otherwise the system did it.
 *
 * The kind → category mapping is the only opinionated piece: it picks
 * one of the 5 existing categories (offers / finance / analytics /
 * campaigns / mentions) so the existing filter chips keep working
 * unchanged.
 */
import type { Notification } from "@/lib/api";
import type { NotificationGroup } from "./notifications-data";
import type { AvatarTone } from "@/components/messages/gradient-avatar";

const TONES: ReadonlyArray<AvatarTone> = [
  "blue",
  "pink",
  "purple",
  "teal",
  "gray",
  "green",
];

type Tone = AvatarTone;

function hashTone(seed: string): Tone {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return TONES[Math.abs(h) % TONES.length] as Tone;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const sec = Math.round(diffMs / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d`;
  const w = Math.round(day / 7);
  if (w < 5) return `${w}w`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function groupTitle(iso: string): string {
  const then = new Date(iso);
  const now = new Date();
  const sameDay = then.toDateString() === now.toDateString();
  if (sameDay) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (then.toDateString() === yesterday.toDateString()) return "Yesterday";
  return "Earlier";
}

function kindToCategory(
  kind: Notification["kind"],
): "offers" | "finance" | "analytics" | "campaigns" | "mentions" {
  switch (kind) {
    case "application_received":
    case "application_accepted":
    case "application_rejected":
    case "deal_content_submitted":
    case "deal_approved":
    case "deal_cancelled":
      return "offers";
    case "payment_released":
      return "finance";
    case "social_sync_completed":
    case "social_sync_failed":
      return "analytics";
    case "message_received":
    case "channel_invite":
    case "workflow_step":
    case "system":
    default:
      return "campaigns";
  }
}

function kindToAction(kind: Notification["kind"]): string {
  switch (kind) {
    case "application_received":
      return "sent a new brand deal request.";
    case "application_accepted":
      return "accepted your application.";
    case "application_rejected":
      return "rejected your application.";
    case "deal_content_submitted":
      return "submitted content for review on";
    case "deal_approved":
      return "approved your delivery for";
    case "deal_cancelled":
      return "cancelled the deal.";
    case "payment_released":
      return "released payment for";
    case "message_received":
      return "sent you a new message.";
    case "channel_invite":
      return "invited you to a channel.";
    case "workflow_step":
      return "needs your approval on";
    case "social_sync_completed":
      return "finished syncing your social data.";
    case "social_sync_failed":
      return "had a problem syncing your social data.";
    case "system":
    default:
      return "sent an update.";
  }
}

function kindToRightElement(
  kind: Notification["kind"],
):
  | { type: "thumbnail"; colorClass: string }
  | { type: "badge"; text: string; bgClass: string; textClass: string }
  | { type: "icon"; name: "chart" | "money" | "doc" }
  | undefined {
  switch (kind) {
    case "application_received":
      return {
        type: "badge",
        text: "Review",
        bgClass: "bg-[#0a0a0a] dark:bg-white",
        textClass: "text-white dark:text-[#0a0a0a]",
      };
    case "application_accepted":
    case "deal_approved":
    case "payment_released":
      return {
        type: "badge",
        text: "Pay",
        bgClass: "bg-[#0a0a0a] dark:bg-white",
        textClass: "text-white dark:text-[#0a0a0a]",
      };
    case "deal_content_submitted":
      return {
        type: "badge",
        text: "Mark as read",
        bgClass: "bg-[#0a0a0a] dark:bg-white",
        textClass: "text-white dark:text-[#0a0a0a]",
      };
    case "social_sync_completed":
      return { type: "icon", name: "chart" };
    case "payment_released":
      return { type: "icon", name: "money" };
    case "system":
    default:
      return { type: "icon", name: "doc" };
  }
}

/**
 * Convert a list of backend notifications into the shape the existing
 * UI consumes. Group by Today / Yesterday / Earlier. The UI filter
 * (all | offers | finance | …) is applied by the component as before.
 */
export function notificationsToGroups(
  rows: ReadonlyArray<Notification>,
): NotificationGroup[] {
  const buckets = new Map<string, NotificationGroup>();
  for (const n of rows) {
    const title = groupTitle(n.createdAt);
    let bucket = buckets.get(title);
    if (!bucket) {
      bucket = { title, items: [] };
      buckets.set(title, bucket);
    }
    const tone = hashTone(n.actorUserId ?? n.kind);
    bucket.items.push({
      id: n.id,
      category: kindToCategory(n.kind),
      actors: [
        { name: n.actorUserId ? "Creonity" : "Creonity", avatarTone: tone },
      ],
      action: kindToAction(n.kind),
      target: n.referenceId ?? undefined,
      time: formatRelative(n.createdAt),
      isUnread: !n.isRead,
      rightElement: kindToRightElement(n.kind),
    });
  }
  // Stable ordering: Today, Yesterday, Earlier
  const order = ["Today", "Yesterday", "Earlier"];
  return order
    .map((t) => buckets.get(t))
    .filter((g): g is NotificationGroup => Boolean(g));
}
