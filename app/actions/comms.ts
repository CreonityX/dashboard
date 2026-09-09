"use server"

import { cookies } from "next/headers"
import {
  ApiCallError,
  createCommChannel as apiCreateCommChannel,
  getUnreadCounts as apiGetUnreadCounts,
  listChannelMessages as apiListChannelMessages,
  listCommChannels as apiListCommChannels,
  listDmMessages as apiListDmMessages,
  listDmThreads as apiListDmThreads,
  markChannelRead as apiMarkChannelRead,
  markDmRead as apiMarkDmRead,
  sendChannelMessage as apiSendChannelMessage,
  sendDmMessage as apiSendDmMessage,
  startDmThread as apiStartDmThread,
  type CommChannel,
  type CommMessage,
  type DmThread,
  type UnreadCounts,
} from "@/lib/api"

async function getCookieHeader(): Promise<string | undefined> {
  const jar = await cookies()
  const all = jar.getAll()
  if (all.length === 0) return undefined
  return all.map((c) => `${c.name}=${c.value}`).join("; ")
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function errToString(err: unknown): string {
  if (err instanceof ApiCallError) return err.message
  if (err instanceof Error) return err.message
  return "Unexpected error"
}

async function authed<T>(fn: (cookies: string) => Promise<T>): Promise<ActionResult<T>> {
  try {
    const header = await getCookieHeader()
    if (!header) return { success: false, error: "Not authenticated." }
    return { success: true, data: await fn(header) }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

// ── Access token for the WS connection ────────────────────────────────────────
// The access JWT lives in an httpOnly cookie, so browser JS can't read it.
// This action hands it to the realtime client, which keeps it in memory
// (never localStorage) and uses it as the ?token= query param.

export async function getWsTokenAction(): Promise<ActionResult<{ token: string }>> {
  const jar = await cookies()
  const token = jar.get("creonity_auth")?.value
  if (!token) return { success: false, error: "Not authenticated." }
  return { success: true, data: { token } }
}

// ── Channels ──────────────────────────────────────────────────────────────────

export async function getCommChannelsAction(): Promise<ActionResult<CommChannel[]>> {
  return authed((c) => apiListCommChannels(c))
}

export async function createCommChannelAction(payload: {
  name: string;
  description?: string;
  isPrivate?: boolean;
}): Promise<ActionResult<CommChannel>> {
  return authed((c) => apiCreateCommChannel(payload, c))
}

export async function getChannelMessagesAction(
  channelId: string,
  params: { before?: string; limit?: number } = {},
): Promise<ActionResult<CommMessage[]>> {
  return authed((c) => apiListChannelMessages(channelId, params, c))
}

export async function sendChannelMessageAction(
  channelId: string,
  payload: { body: string; parentMessageId?: string },
): Promise<ActionResult<CommMessage>> {
  return authed((c) => apiSendChannelMessage(channelId, payload, c))
}

export async function markChannelReadAction(
  channelId: string,
  messageId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiMarkChannelRead(channelId, messageId, c))
}

// ── DMs ───────────────────────────────────────────────────────────────────────

export async function getDmThreadsAction(): Promise<ActionResult<DmThread[]>> {
  return authed((c) => apiListDmThreads(c))
}

export async function startDmThreadAction(userId: string): Promise<ActionResult<DmThread>> {
  return authed((c) => apiStartDmThread(userId, c))
}

export async function getDmMessagesAction(
  threadId: string,
  params: { before?: string; limit?: number } = {},
): Promise<ActionResult<CommMessage[]>> {
  return authed((c) => apiListDmMessages(threadId, params, c))
}

export async function sendDmMessageAction(
  threadId: string,
  body: string,
): Promise<ActionResult<CommMessage>> {
  return authed((c) => apiSendDmMessage(threadId, { body }, c))
}

export async function markDmReadAction(
  threadId: string,
  messageId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiMarkDmRead(threadId, messageId, c))
}

// ── Unread ────────────────────────────────────────────────────────────────────

export async function getUnreadCountsAction(): Promise<ActionResult<UnreadCounts>> {
  return authed((c) => apiGetUnreadCounts(c))
}
