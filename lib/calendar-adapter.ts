/**
 * Adapter: backend `CalendarEvent` (lib/api.ts) → the existing UI's
 * `CalendarEvent` (lib/calendar-data.ts).
 *
 * The mock has a few fields the backend doesn't carry: `workflowStatus`,
 * `paymentStatus`, `notInvited`. Defaults:
 *   - workflowStatus = 'pending' (creators haven't requested approval yet)
 *   - paymentStatus  = 'scheduled' (a payment is on the deal but not yet released)
 *   - notInvited     = false
 *
 * `multiDay` is derived from `endDate != null`. The frontend uses the
 * date portion (YYYY-MM-DD) — we strip the time.
 */
import type {
  CalendarEvent as WireEvent,
  CalendarEventType as WireType,
  CalendarPlatform as WirePlatform,
  CalendarPriority as WirePriority,
} from "@/lib/api";
import type {
  CalendarEvent,
  EventType,
  Platform,
  Priority,
} from "./calendar-data";

const ALLOWED_EVENT_TYPES: ReadonlySet<EventType> = new Set([
  "post",
  "campaign",
  "deadline",
  "meeting",
  "shoot",
  "review",
  "approval",
  "payment",
  "personal",
]);
const ALLOWED_PLATFORMS: ReadonlySet<Platform> = new Set([
  "instagram",
  "youtube",
  "tiktok",
  "twitter",
  "linkedin",
]);

/** Convert an ISO timestamp (with time) to a YYYY-MM-DD date string. */
function toDateString(iso: string): string {
  return iso.slice(0, 10);
}

export function wireToUiEvent(w: WireEvent): CalendarEvent {
  return {
    id: w.id,
    title: w.title,
    type: (ALLOWED_EVENT_TYPES.has(w.type as EventType)
      ? w.type
      : "personal") as EventType,
    date: toDateString(w.startDate),
    startTime: w.startTime ?? undefined,
    endTime: w.endTime ?? undefined,
    allDay: w.allDay,
    description: w.description ?? undefined,
    platform:
      w.platform && ALLOWED_PLATFORMS.has(w.platform as Platform)
        ? (w.platform as Platform)
        : undefined,
    brand: w.brand ?? undefined,
    campaign: w.campaign ?? undefined,
    creator: w.creator ?? undefined,
    assignee: w.assignee ?? undefined,
    workflowStatus: "pending",
    paymentStatus: "scheduled",
    priority: (w.priority ?? undefined) as Priority | undefined,
    completed: w.completed || undefined,
    reminder: w.reminder ?? undefined,
    tags: w.tags.length > 0 ? w.tags : undefined,
    multiDay: w.endDate ? true : undefined,
    endDate: w.endDate ? toDateString(w.endDate) : undefined,
    notInvited: false,
  };
}

export function wireToUiEvents(
  rows: ReadonlyArray<WireEvent>,
): CalendarEvent[] {
  return rows.map(wireToUiEvent);
}

/** UI event → brand/creator create payload. Types already match the wire. */
export function uiToWirePayload(e: CalendarEvent): {
  title: string;
  type: WireEvent["type"];
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  description?: string;
  platform?: WirePlatform;
  brand?: string;
  campaign?: string;
  creator?: string;
  assignee?: string;
  priority?: WirePriority;
  completed?: boolean;
  reminder?: string;
  tags?: string[];
} {
  return {
    title: e.title,
    type: e.type as WireType,
    startDate: e.date,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    ...(e.startTime ? { startTime: e.startTime } : {}),
    ...(e.endTime ? { endTime: e.endTime } : {}),
    allDay: e.allDay,
    ...(e.description ? { description: e.description } : {}),
    ...(e.platform ? { platform: e.platform as WirePlatform } : {}),
    ...(e.brand ? { brand: e.brand } : {}),
    ...(e.campaign ? { campaign: e.campaign } : {}),
    ...(e.creator ? { creator: e.creator } : {}),
    ...(e.assignee ? { assignee: e.assignee } : {}),
    ...(e.priority ? { priority: e.priority as WirePriority } : {}),
    ...(e.completed ? { completed: true } : {}),
    ...(e.reminder ? { reminder: e.reminder } : {}),
    ...(e.tags && e.tags.length > 0 ? { tags: e.tags } : {}),
  };
}
