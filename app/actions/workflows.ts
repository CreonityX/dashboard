"use server";

import { cookies } from "next/headers";
import {
  ApiCallError,
  approveWorkflowStep as apiApprove,
  cancelWorkflowInstance as apiCancel,
  createWorkflowTemplate as apiCreate,
  getWorkflowInstance as apiGet,
  listWorkflowInstances as apiList,
  listWorkflowTemplates as apiTemplates,
  startWorkflow as apiStart,
  type WorkflowInstance,
  type WorkflowInstanceStatus,
  type WorkflowInstanceWithSteps,
  type WorkflowReferenceType,
  type WorkflowStepDefinition,
  type WorkflowTemplate,
  type WorkflowTriggerType,
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

export function listWorkflowTemplatesAction(): Promise<
  ActionResult<WorkflowTemplate[]>
> {
  return authed((c) => apiTemplates(c));
}

export function getWorkflowInstanceAction(
  id: string,
): Promise<ActionResult<WorkflowInstanceWithSteps>> {
  return authed((c) => apiGet(id, c));
}

export function listWorkflowInstancesAction(
  params: {
    status?: WorkflowInstanceStatus;
    referenceType?: WorkflowReferenceType;
    limit?: number;
  } = {},
): Promise<ActionResult<WorkflowInstance[]>> {
  return authed((c) => apiList(params, c));
}

export function startWorkflowAction(payload: {
  templateId: string;
  referenceType: WorkflowReferenceType;
  referenceId: string;
}): Promise<ActionResult<WorkflowInstance>> {
  return authed((c) => apiStart(payload, c));
}

export function approveWorkflowStepAction(
  instanceId: string,
  payload: { stepIndex: number; approved: boolean; rejectionReason?: string },
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiApprove(instanceId, payload, c));
}

export function cancelWorkflowInstanceAction(
  instanceId: string,
): Promise<ActionResult<{ message: string }>> {
  return authed((c) => apiCancel(instanceId, c));
}

export function createWorkflowTemplateAction(payload: {
  name: string;
  description?: string;
  triggerType?: WorkflowTriggerType;
  steps: WorkflowStepDefinition[];
}): Promise<ActionResult<WorkflowTemplate>> {
  return authed((c) => apiCreate(payload, c));
}
