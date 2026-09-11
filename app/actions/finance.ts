"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  getBrandFinanceOverview as apiBrandOverview,
  getBrandFinanceRevenue as apiBrandRevenue,
  getCreatorFinanceOverview as apiCreatorOverview,
  getCreatorFinanceRevenue as apiCreatorRevenue,
  listBrandFinanceTransactions as apiBrandTx,
  listBrandFinanceUpcoming as apiBrandUpcoming,
  listCreatorFinanceTransactions as apiCreatorTx,
  listCreatorFinanceUpcoming as apiCreatorUpcoming,
  requestCreatorWithdrawal as apiWithdraw,
  type FinanceOverview,
  type LedgerEntry,
  type RevenuePoint,
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

export async function getFinanceOverviewAction(
  isBrand: boolean,
): Promise<ActionResult<FinanceOverview>> {
  return authed((c) => (isBrand ? apiBrandOverview(c) : apiCreatorOverview(c)));
}

export async function listFinanceTransactionsAction(
  isBrand: boolean,
): Promise<ActionResult<LedgerEntry[]>> {
  return authed((c) => (isBrand ? apiBrandTx({}, c) : apiCreatorTx({}, c)));
}

export async function getFinanceRevenueAction(
  isBrand: boolean,
): Promise<ActionResult<RevenuePoint[]>> {
  return authed((c) => (isBrand ? apiBrandRevenue(c) : apiCreatorRevenue(c)));
}

export async function listFinanceUpcomingAction(
  isBrand: boolean,
): Promise<ActionResult<LedgerEntry[]>> {
  return authed((c) => (isBrand ? apiBrandUpcoming(c) : apiCreatorUpcoming(c)));
}

export async function requestWithdrawalAction(
  amount: number,
  destination: string,
): Promise<ActionResult<LedgerEntry>> {
  return authed((c) => apiWithdraw({ amount, destination }, c));
}
