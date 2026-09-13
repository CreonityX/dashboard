"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  getPrivacySettings as apiGet,
  updatePrivacySettings as apiUpdate,
  type PrivacySettings,
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

export async function getPrivacySettingsAction(): Promise<
  ActionResult<PrivacySettings>
> {
  return authed((c) => apiGet(c));
}

export async function updatePrivacySettingsAction(
  payload: Partial<PrivacySettings>,
): Promise<ActionResult<PrivacySettings>> {
  return authed((c) => apiUpdate(payload, c));
}
