"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  deleteBrandNotification as apiBrandDelete,
  deleteNotification as apiCreatorDelete,
  getBrandUnreadCount as apiBrandUnread,
  getUnreadCount as apiCreatorUnread,
  listBrandNotifications as apiBrandList,
  listNotifications as apiCreatorList,
  markAllBrandNotificationsRead as apiBrandMarkAll,
  markAllNotificationsRead as apiCreatorMarkAll,
  markBrandNotificationRead as apiBrandRead,
  markNotificationRead as apiCreatorRead,
  type Notification,
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

// The route prefix (creator vs brand) is decided by the account_type in
// the JWT, which lives in the access-token cookie. The same cookie is
// forwarded to either endpoint. The server picks the right one based on
// the bearer; the client just needs to know which prefix to call.

// ── List ─────────────────────────────────────────────────────────────────────

export async function listCreatorNotificationsAction(
  params: { unreadOnly?: boolean; limit?: number } = {},
): Promise<ActionResult<Notification[]>> {
  return authed((c) => apiCreatorList(params, c));
}

export async function listBrandNotificationsAction(
  params: { unreadOnly?: boolean; limit?: number } = {},
): Promise<ActionResult<Notification[]>> {
  return authed((c) => apiBrandList(params, c));
}

// ── Unread count (bell badge) ────────────────────────────────────────────────

export async function getCreatorUnreadCountAction(): Promise<
  ActionResult<{ count: number }>
> {
  return authed((c) => apiCreatorUnread(c));
}

export async function getBrandUnreadCountAction(): Promise<
  ActionResult<{ count: number }>
> {
  return authed((c) => apiBrandUnread(c));
}

// ── Mark read / delete ───────────────────────────────────────────────────────

export async function markCreatorNotificationReadAction(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiCreatorRead(id, c));
}

export async function markBrandNotificationReadAction(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiBrandRead(id, c));
}

export async function markAllCreatorNotificationsReadAction(): Promise<
  ActionResult<{ updated: number }>
> {
  return authed((c) => apiCreatorMarkAll(c));
}

export async function markAllBrandNotificationsReadAction(): Promise<
  ActionResult<{ updated: number }>
> {
  return authed((c) => apiBrandMarkAll(c));
}

export async function deleteCreatorNotificationAction(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiCreatorDelete(id, c));
}

export async function deleteBrandNotificationAction(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiBrandDelete(id, c));
}
