"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  exportSettingsData as apiExport,
  getPrivacySettings as apiGet,
  listUserBlocks as apiListBlocks,
  unblockUser as apiUnblock,
  updatePrivacySettings as apiUpdate,
  type PrivacySettings,
  type UserBlock,
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

export async function getPrivacySettingsAction(
  isBrand: boolean,
): Promise<ActionResult<PrivacySettings>> {
  return authed((c) => apiGet(isBrand, c));
}

export async function updatePrivacySettingsAction(
  isBrand: boolean,
  payload: Partial<PrivacySettings>,
): Promise<ActionResult<PrivacySettings>> {
  return authed((c) => apiUpdate(isBrand, payload, c));
}

export async function listUserBlocksAction(
  isBrand: boolean,
): Promise<ActionResult<UserBlock[]>> {
  return authed((c) => apiListBlocks(isBrand, c));
}

export async function unblockUserAction(
  isBrand: boolean,
  blockedUserId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiUnblock(isBrand, blockedUserId, c));
}

export async function exportSettingsDataAction(
  isBrand: boolean,
): Promise<ActionResult<Record<string, unknown>>> {
  return authed((c) => apiExport(isBrand, c));
}
