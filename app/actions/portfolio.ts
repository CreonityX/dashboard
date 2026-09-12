"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  listPortfolioItems as apiList,
  reorderPortfolioItems as apiReorder,
  updatePortfolioItem as apiUpdate,
  type PortfolioItem,
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

export async function listPortfolioAction(): Promise<ActionResult<PortfolioItem[]>> {
  return authed((c) => apiList(c));
}

export async function updatePortfolioItemAction(
  id: string,
  payload: Parameters<typeof apiUpdate>[1],
): Promise<ActionResult<PortfolioItem>> {
  return authed((c) => apiUpdate(id, payload, c));
}

export async function reorderPortfolioAction(
  ids: string[],
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiReorder(ids, c));
}
