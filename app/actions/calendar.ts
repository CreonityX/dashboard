"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  createBrandCalendarEvent as apiBrandCreate,
  createCalendarEvent as apiCreatorCreate,
  deleteBrandCalendarEvent as apiBrandDelete,
  deleteCalendarEvent as apiCreatorDelete,
  listBrandCalendar as apiBrandList,
  listCreatorCalendar as apiCreatorList,
  updateBrandCalendarEvent as apiBrandUpdate,
  updateCalendarEvent as apiCreatorUpdate,
  type CalendarEvent,
  type CalendarEventType,
  type CalendarPlatform,
  type CalendarPriority,
} from "@/lib/api";

async function getCookieHeader(): Promise<string | undefined> {
  const jar = await cookies();
  const all = jar.getAll();
  if (all.length === 0) return undefined;
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

function errToString(err: unknown): string {
  if (err instanceof ApiCallError) return err.message;
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

async function authed<T>(
  fn: (cookies: string) => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const header = await getCookieHeader();
    if (!header) return { success: false, error: "Not authenticated." };
    return { success: true, data: await fn(header) };
  } catch (err) {
    return { success: false, error: errToString(err) };
  }
}

// ── List ─────────────────────────────────────────────────────────────────────

export function listCreatorCalendarAction(
  params: { from?: string; to?: string; type?: CalendarEventType } = {},
): Promise<ActionResult<CalendarEvent[]>> {
  return authed((c) => apiCreatorList(params, c));
}

export function listBrandCalendarAction(
  params: { from?: string; to?: string; type?: CalendarEventType } = {},
): Promise<ActionResult<CalendarEvent[]>> {
  return authed((c) => apiBrandList(params, c));
}

// ── Create / Update / Delete ──────────────────────────────────────────────────

export type CalendarEventPayload = {
  title: string;
  type: CalendarEventType;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  description?: string;
  platform?: CalendarPlatform;
  brand?: string;
  campaign?: string;
  creator?: string;
  assignee?: string;
  priority?: CalendarPriority;
  completed?: boolean;
  reminder?: string;
  tags?: string[];
};

export function createCreatorCalendarEventAction(
  payload: CalendarEventPayload,
): Promise<ActionResult<CalendarEvent>> {
  return authed((c) => apiCreatorCreate(payload, c));
}

export function createBrandCalendarEventAction(
  payload: CalendarEventPayload,
): Promise<ActionResult<CalendarEvent>> {
  return authed((c) => apiBrandCreate(payload, c));
}

export function updateCreatorCalendarEventAction(
  id: string,
  payload: Partial<CalendarEventPayload>,
): Promise<ActionResult<CalendarEvent>> {
  return authed((c) => apiCreatorUpdate(id, payload, c));
}

export function updateBrandCalendarEventAction(
  id: string,
  payload: Partial<CalendarEventPayload>,
): Promise<ActionResult<CalendarEvent>> {
  return authed((c) => apiBrandUpdate(id, payload, c));
}

export function deleteCreatorCalendarEventAction(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiCreatorDelete(id, c));
}

export function deleteBrandCalendarEventAction(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiBrandDelete(id, c));
}
