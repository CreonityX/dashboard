"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  addMessageAttachment as apiAddMessageAttachment,
  archiveCommChannel as apiArchiveCommChannel,
  browseCommChannels as apiBrowseCommChannels,
  createCommChannel as apiCreateCommChannel,
  deleteChannelMessage as apiDeleteChannelMessage,
  editChannelMessage as apiEditChannelMessage,
  getCommChannel as apiGetCommChannel,
  getThreadReplies as apiGetThreadReplies,
  getUnreadCounts as apiGetUnreadCounts,
  inviteToCommChannel as apiInviteToCommChannel,
  joinCommChannel as apiJoinCommChannel,
  leaveCommChannel as apiLeaveCommChannel,
  listChannelMessages as apiListChannelMessages,
  listCommChannels as apiListCommChannels,
  listDmMessages as apiListDmMessages,
  listDmThreads as apiListDmThreads,
  listMessageAttachments as apiListMessageAttachments,
  markChannelRead as apiMarkChannelRead,
  markDmRead as apiMarkDmRead,
  sendChannelMessage as apiSendChannelMessage,
  sendDmMessage as apiSendDmMessage,
  startDmThread as apiStartDmThread,
  updateCommChannel as apiUpdateCommChannel,
  type CommChannel,
  type CommMessage,
  type CommMessageAttachment,
  type DmThread,
  type UnreadCounts,
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

// ── Access token for the WS connection ────────────────────────────────────────
// The access JWT lives in an httpOnly cookie, so browser JS can't read it.
// This action hands it to the realtime client, which keeps it in memory
// (never localStorage) and uses it as the ?token= query param.

export async function getWsTokenAction(): Promise<
  ActionResult<{ token: string }>
> {
  const jar = await cookies();
  const token = jar.get("creonity_auth")?.value;
  if (!token) return { success: false, error: "Not authenticated." };
  return { success: true, data: { token } };
}

// ── Channels ──────────────────────────────────────────────────────────────────

export async function getCommChannelsAction(): Promise<
  ActionResult<CommChannel[]>
> {
  return authed((c) => apiListCommChannels(c));
}

export async function createCommChannelAction(payload: {
  name: string;
  description?: string;
  isPrivate?: boolean;
}): Promise<ActionResult<CommChannel>> {
  return authed((c) => apiCreateCommChannel(payload, c));
}

export async function getChannelMessagesAction(
  channelId: string,
  params: { before?: string; limit?: number } = {},
): Promise<ActionResult<CommMessage[]>> {
  return authed((c) => apiListChannelMessages(channelId, params, c));
}

export async function sendChannelMessageAction(
  channelId: string,
  payload: { body: string; parentMessageId?: string },
): Promise<ActionResult<CommMessage>> {
  return authed((c) => apiSendChannelMessage(channelId, payload, c));
}

export async function markChannelReadAction(
  channelId: string,
  messageId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiMarkChannelRead(channelId, messageId, c));
}

export async function getCommChannelAction(
  channelId: string,
): Promise<ActionResult<CommChannel>> {
  return authed((c) => apiGetCommChannel(channelId, c));
}

export async function updateCommChannelAction(
  channelId: string,
  payload: { name?: string; description?: string },
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUpdateCommChannel(channelId, payload, c));
}

export async function joinCommChannelAction(
  channelId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiJoinCommChannel(channelId, c));
}

export async function leaveCommChannelAction(
  channelId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiLeaveCommChannel(channelId, c));
}

export async function browseCommChannelsAction(): Promise<
  ActionResult<CommChannel[]>
> {
  return authed((c) => apiBrowseCommChannels(c));
}

export async function inviteToCommChannelAction(
  channelId: string,
  payload: { userId?: string; email?: string },
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiInviteToCommChannel(channelId, payload, c));
}

export async function archiveCommChannelAction(
  channelId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiArchiveCommChannel(channelId, c));
}

export async function editChannelMessageAction(
  messageId: string,
  body: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiEditChannelMessage(messageId, body, c));
}

export async function deleteChannelMessageAction(
  messageId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiDeleteChannelMessage(messageId, c));
}

export async function getThreadRepliesAction(
  messageId: string,
): Promise<ActionResult<CommMessage[]>> {
  return authed((c) => apiGetThreadReplies(messageId, c));
}

export async function listMessageAttachmentsAction(
  messageId: string,
): Promise<ActionResult<CommMessageAttachment[]>> {
  return authed((c) => apiListMessageAttachments(messageId, c));
}

export async function addMessageAttachmentAction(
  messageId: string,
  file: File,
): Promise<
  ActionResult<{ attachmentId: string; storageKey: string; url: string }>
> {
  return authed((c) => apiAddMessageAttachment(messageId, file, c));
}

// ── DMs ───────────────────────────────────────────────────────────────────────

export async function getDmThreadsAction(): Promise<ActionResult<DmThread[]>> {
  return authed((c) => apiListDmThreads(c));
}

export async function startDmThreadAction(
  userId: string,
): Promise<ActionResult<DmThread>> {
  return authed((c) => apiStartDmThread(userId, c));
}

export async function getDmMessagesAction(
  threadId: string,
  params: { before?: string; limit?: number } = {},
): Promise<ActionResult<CommMessage[]>> {
  return authed((c) => apiListDmMessages(threadId, params, c));
}

export async function sendDmMessageAction(
  threadId: string,
  body: string,
): Promise<ActionResult<CommMessage>> {
  return authed((c) => apiSendDmMessage(threadId, { body }, c));
}

export async function markDmReadAction(
  threadId: string,
  messageId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiMarkDmRead(threadId, messageId, c));
}

// ── Unread ────────────────────────────────────────────────────────────────────

export async function getUnreadCountsAction(): Promise<
  ActionResult<UnreadCounts>
> {
  return authed((c) => apiGetUnreadCounts(c));
}
