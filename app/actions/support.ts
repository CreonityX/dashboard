"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  addSupportTicketComment as apiAddComment,
  createSupportTicket as apiCreate,
  listMySupportTickets as apiList,
  type SupportTicket,
  type SupportTicketComment,
} from "@/lib/api";

async function getCookieHeader(): Promise<string | undefined> {
  const jar = await cookies();
  const all = jar.getAll();
  if (all.length === 0) return undefined;
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function errToString(err: unknown): string {
  if (err instanceof ApiCallError) return err.message;
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

async function authed<T>(fn: (cookies: string) => Promise<T>): Promise<ActionResult<T>> {
  try {
    const header = await getCookieHeader();
    if (!header) return { success: false, error: "Not authenticated." };
    return { success: true, data: await fn(header) };
  } catch (err) {
    return { success: false, error: errToString(err) };
  }
}

export async function listMyTicketsAction(
  isBrand: boolean,
): Promise<ActionResult<SupportTicket[]>> {
  return authed((c) => apiList(isBrand, c));
}

export async function createTicketAction(
  isBrand: boolean,
  payload: { title: string; description?: string; category?: string },
): Promise<ActionResult<SupportTicket>> {
  return authed((c) => apiCreate(isBrand, payload, c));
}

export async function replyTicketAction(
  isBrand: boolean,
  ticketId: string,
  body: string,
): Promise<ActionResult<SupportTicketComment>> {
  return authed((c) => apiAddComment(isBrand, ticketId, body, c));
}
