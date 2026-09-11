"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  addWsComment as apiAddComment,
  createWsProject as apiCreateProject,
  createWsTask as apiCreateTask,
  listWsComments as apiListComments,
  listWsProjects as apiListProjects,
  listWsTasksByLane as apiListLanes,
  moveWsTaskLane as apiMoveLane,
  type WsLanes,
  type WsLane,
  type WsComment,
  type WsProject,
  type WsTask,
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

export async function listWsProjectsAction(): Promise<
  ActionResult<WsProject[]>
> {
  return authed((c) => apiListProjects(c));
}

export async function createWsProjectAction(
  name: string,
  description?: string,
): Promise<ActionResult<WsProject>> {
  return authed((c) =>
    apiCreateProject({ name, ...(description ? { description } : {}) }, c),
  );
}

export async function listWsLanesAction(
  projectId: string,
): Promise<ActionResult<WsLanes>> {
  return authed((c) => apiListLanes(projectId, c));
}

export async function createWsTaskAction(
  projectId: string,
  title: string,
): Promise<ActionResult<WsTask>> {
  return authed((c) => apiCreateTask(projectId, { title }, c));
}

export async function moveWsTaskLaneAction(
  taskId: string,
  lane: WsLane,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiMoveLane(taskId, lane, c));
}

export async function listWsCommentsAction(
  taskId: string,
): Promise<ActionResult<WsComment[]>> {
  return authed((c) => apiListComments(taskId, c));
}

export async function addWsCommentAction(
  taskId: string,
  body: string,
): Promise<ActionResult<WsComment>> {
  return authed((c) => apiAddComment(taskId, body, c));
}
