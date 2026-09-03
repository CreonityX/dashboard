"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  addMessageReaction as apiAdd,
  listMessageReactions as apiList,
  removeMessageReaction as apiRemove,
  type MessageReaction,
} from "@/lib/api";

async function getCookieHeader(): Promise<string | undefined> {
  const jar = await cookies();
  const all = jar.getAll();
  if (all.length === 0) return undefined;
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };
function errToString(e: unknown): string {
  if (e instanceof ApiCallError) return e.message;
  if (e instanceof Error) return e.message;
  return "Unexpected error";
}
async function authed<T>(
  fn: (c: string) => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const h = await getCookieHeader();
    if (!h) return { success: false, error: "Not authenticated." };
    return { success: true, data: await fn(h) };
  } catch (e) {
    return { success: false, error: errToString(e) };
  }
}

export async function getMessageReactionsAction(
  messageId: string,
): Promise<ActionResult<MessageReaction[]>> {
  return authed((c) => apiList(messageId, c));
}

export async function addMessageReactionAction(
  messageId: string,
  emoji: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiAdd(messageId, emoji, c));
}

export async function removeMessageReactionAction(
  messageId: string,
  emoji: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiRemove(messageId, emoji, c));
}
