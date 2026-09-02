"use server"

import { cookies } from "next/headers"
import {
  ApiCallError,
  onboardingAvailability as apiOnboardingAvailability,
  onboardingAvatar as apiOnboardingAvatar,
  onboardingComplete as apiOnboardingComplete,
  onboardingExpertiseTags as apiOnboardingExpertiseTags,
  onboardingPayoutMethod as apiOnboardingPayoutMethod,
  onboardingProfileBasics as apiOnboardingProfileBasics,
  onboardingStatus as apiOnboardingStatus,
  type OnboardingStatus,
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

// ── Read ─────────────────────────────────────────────────────────────────────

export async function getOnboardingStatusAction(): Promise<ActionResult<OnboardingStatus>> {
  try {
    const cookies = await getCookieHeader()
    if (!cookies) return { success: false, error: "Not authenticated." }
    const data = await apiOnboardingStatus(cookies)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function saveProfileBasicsAction(payload: {
  displayName: string;
  username: string;
  bio?: string;
  tagline?: string;
}): Promise<ActionResult<{ message: string }>> {
  try {
    const cookies = await getCookieHeader()
    if (!cookies) return { success: false, error: "Not authenticated." }
    const data = await apiOnboardingProfileBasics(payload, cookies)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

// Avatar is multipart — server actions can take FormData.
export async function uploadAvatarAction(formData: FormData): Promise<
  ActionResult<{ avatarUrl: string; avatarThumbUrl: string }>
> {
  try {
    const cookiesHeader = await getCookieHeader()
    if (!cookiesHeader) return { success: false, error: "Not authenticated." }
    const file = formData.get("file")
    if (!(file instanceof File)) return { success: false, error: "No file provided." }
    const data = await apiOnboardingAvatar(file, cookiesHeader)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

export async function saveExpertiseTagsAction(
  tags: string[],
): Promise<ActionResult<{ message: string }>> {
  try {
    const cookies = await getCookieHeader()
    if (!cookies) return { success: false, error: "Not authenticated." }
    const data = await apiOnboardingExpertiseTags(tags, cookies)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

export async function saveAvailabilityAction(payload: {
  acceptingGigs: boolean;
  responseSla?: string;
}): Promise<ActionResult<{ message: string }>> {
  try {
    const cookies = await getCookieHeader()
    if (!cookies) return { success: false, error: "Not authenticated." }
    const data = await apiOnboardingAvailability(payload, cookies)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

export async function savePayoutMethodAction(payload: {
  type: "bank_account" | "upi";
  details?: Record<string, unknown>;
}): Promise<ActionResult<{ message: string }>> {
  try {
    const cookies = await getCookieHeader()
    if (!cookies) return { success: false, error: "Not authenticated." }
    const data = await apiOnboardingPayoutMethod(payload, cookies)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}

export async function completeOnboardingAction(): Promise<ActionResult<{ message: string }>> {
  try {
    const cookies = await getCookieHeader()
    if (!cookies) return { success: false, error: "Not authenticated." }
    const data = await apiOnboardingComplete(cookies)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: errToString(err) }
  }
}
