"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { Button, Chip, Spinner, Typography } from "@heroui/react";
import { Check, X, Ban, RefreshCw, Play, ChevronRight } from "lucide-react";
import { CirclePlay, CircleCheck, CircleXmark } from "@gravity-ui/icons";
import {
  approveWorkflowStepAction,
  cancelWorkflowInstanceAction,
  getWorkflowInstanceAction,
  listWorkflowInstancesAction,
  startWorkflowAction,
} from "@/app/actions/workflows";
import type {
  WorkflowInstance,
  WorkflowInstanceWithSteps,
  WorkflowReferenceType,
  WorkflowTemplate,
} from "@/lib/api";

type Props = {
  initialTemplates: WorkflowTemplate[];
  initialError: string | null;
};

type ChipColor = "default" | "success" | "warning" | "danger" | "accent";
type ChipVariant = "primary" | "secondary" | "tertiary" | "soft";

const STATUS_COLOR: Record<string, ChipColor> = {
  pending: "warning",
  in_progress: "accent",
  waiting_approval: "accent",
  completed: "success",
  cancelled: "default",
  failed: "danger",
};

const STEP_STATUS_COLOR: Record<string, ChipColor> = {
  pending: "default",
  in_progress: "accent",
  approved: "success",
  rejected: "danger",
  skipped: "default",
  failed: "danger",
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  notify: <CirclePlay className="h-3.5 w-3.5" />,
  assign: <CirclePlay className="h-3.5 w-3.5" />,
  approval: <Check className="h-3.5 w-3.5" />,
  condition: <CirclePlay className="h-3.5 w-3.5" />,
  webhook: <CirclePlay className="h-3.5 w-3.5" />,
  wait: <CirclePlay className="h-3.5 w-3.5" />,
  create_task: <CirclePlay className="h-3.5 w-3.5" />,
  send_message: <CirclePlay className="h-3.5 w-3.5" />,
};

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function WorkflowApp({ initialTemplates, initialError }: Props) {
  const [templates] = useState<WorkflowTemplate[]>(initialTemplates);
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null,
  );
  const [selectedInstance, setSelectedInstance] =
    useState<WorkflowInstanceWithSteps | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(initialError);
  const [pending, startTransition] = useTransition();
  const [detailPending, setDetailPending] = useState(false);

  useEffect(() => {
    void loadInstances(statusFilter);
  }, [statusFilter]);

  async function loadInstances(status: string) {
    const result = await listWorkflowInstancesAction({
      ...(status !== "all"
        ? { status: status as WorkflowInstance["status"] }
        : {}),
      limit: 50,
    });
    if (result.success) {
      setInstances(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
  }

  useEffect(() => {
    if (!selectedInstanceId) {
      setSelectedInstance(null);
      return;
    }
    setDetailPending(true);
    void getWorkflowInstanceAction(selectedInstanceId).then((r) => {
      setDetailPending(false);
      if (r.success) {
        setSelectedInstance(r.data);
        setError(null);
      } else {
        setError(r.error);
      }
    });
  }, [selectedInstanceId]);

  function onApprove(stepIndex: number, approved: boolean) {
    if (!selectedInstance) return;
    startTransition(async () => {
      const r = await approveWorkflowStepAction(selectedInstance.id, {
        stepIndex,
        approved,
      });
      if (!r.success) {
        setError(r.error);
        return;
      }
      const detail = await getWorkflowInstanceAction(selectedInstance.id);
      if (detail.success) setSelectedInstance(detail.data);
      await loadInstances(statusFilter);
    });
  }

  function onCancel() {
    if (!selectedInstance) return;
    startTransition(async () => {
      const r = await cancelWorkflowInstanceAction(selectedInstance.id);
      if (!r.success) {
        setError(r.error);
        return;
      }
      const detail = await getWorkflowInstanceAction(selectedInstance.id);
      if (detail.success) setSelectedInstance(detail.data);
      await loadInstances(statusFilter);
    });
  }

  function onStart(template: WorkflowTemplate) {
    const ref = window.prompt(
      "Reference ID (campaign, deal, content, task, or any string):",
      `manual-${Date.now()}`,
    );
    if (!ref) return;
    const refType = (window.prompt(
      "Reference type: campaign | content | deal | task | custom",
      "custom",
    ) ?? "custom") as WorkflowReferenceType;
    startTransition(async () => {
      const r = await startWorkflowAction({
        templateId: template.id,
        referenceType: refType,
        referenceId: ref,
      });
      if (!r.success) {
        setError(r.error);
        return;
      }
      setSelectedInstanceId(r.data.id);
      await loadInstances(statusFilter);
    });
  }

  function onRefresh() {
    void loadInstances(statusFilter);
    if (selectedInstanceId) {
      setDetailPending(true);
      void getWorkflowInstanceAction(selectedInstanceId).then((r) => {
        setDetailPending(false);
        if (r.success) setSelectedInstance(r.data);
      });
    }
  }

  const customTemplates = useMemo(
    () => templates.filter((t) => t.creatorAccountId !== null),
    [templates],
  );
  const platformTemplates = useMemo(
    () => templates.filter((t) => t.creatorAccountId === null),
    [templates],
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Typography
            className="text-2xl font-semibold tracking-tight"
            type="h1"
          >
            Workflows
          </Typography>
          <Typography className="text-default-500" type="body-sm">
            Templates, instances, and approval flow.
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="tertiary"
            onPress={onRefresh}
            isDisabled={pending}
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-medium border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:bg-danger-950/30 dark:text-danger-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <div className="rounded-large border border-default-200 bg-content1 p-4">
            <Typography
              className="mb-3 text-sm font-semibold uppercase tracking-wider text-default-500"
              type="body-sm"
            >
              Platform defaults
            </Typography>
            <div className="space-y-2">
              {platformTemplates.length === 0 ? (
                <p className="text-sm text-default-400">
                  No platform templates.
                </p>
              ) : (
                platformTemplates.map((t) => (
                  <TemplateRow
                    key={t.id}
                    template={t}
                    onStart={onStart}
                    disabled={pending}
                  />
                ))
              )}
            </div>
            {customTemplates.length > 0 ? (
              <>
                <Typography
                  className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-default-500"
                  type="body-sm"
                >
                  Your templates
                </Typography>
                <div className="space-y-2">
                  {customTemplates.map((t) => (
                    <TemplateRow
                      key={t.id}
                      template={t}
                      onStart={onStart}
                      disabled={pending}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="rounded-large border border-default-200 bg-content1">
            <div className="flex flex-col gap-2 border-b border-default-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <Typography
                className="text-sm font-semibold uppercase tracking-wider text-default-500"
                type="body-sm"
              >
                Instances
              </Typography>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    "all",
                    "pending",
                    "in_progress",
                    "waiting_approval",
                    "completed",
                    "cancelled",
                    "failed",
                  ] as const
                ).map((s) => (
                  <Chip
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "primary" : "soft"}
                    color={statusFilter === s ? "accent" : "default"}
                    onClick={() => setStatusFilter(s)}
                    className="cursor-pointer"
                  >
                    {s.replace("_", " ")}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="divide-y divide-default-100">
              {instances.length === 0 ? (
                <p className="p-6 text-center text-sm text-default-400">
                  No instances yet.
                </p>
              ) : (
                instances.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setSelectedInstanceId(i.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-default-50 ${
                      selectedInstanceId === i.id
                        ? "bg-primary-50 dark:bg-primary-950/30"
                        : ""
                    }`}
                  >
                    <Chip
                      size="sm"
                      variant="soft"
                      color={STATUS_COLOR[i.status] ?? "default"}
                    >
                      {i.status.replace("_", " ")}
                    </Chip>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {findTemplateName(templates, i.templateId)}
                      </p>
                      <p className="truncate text-xs text-default-500">
                        {i.referenceType}:{i.referenceId}
                      </p>
                    </div>
                    <span className="text-xs text-default-400">
                      {formatRelative(i.createdAt)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-default-400" />
                  </button>
                ))
              )}
            </div>

            {selectedInstanceId ? (
              <div className="border-t border-default-200 bg-default-50/50 p-4 dark:bg-default-50/5">
                {detailPending || pending ? (
                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <Spinner size="sm" /> Loading…
                  </div>
                ) : selectedInstance ? (
                  <InstanceDetail
                    instance={selectedInstance}
                    templates={templates}
                    onApprove={onApprove}
                    onCancel={onCancel}
                    disabled={pending}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function findTemplateName(templates: WorkflowTemplate[], id: string): string {
  const t = templates.find((x) => x.id === id);
  return t?.name ?? "Unknown template";
}

function TemplateRow({
  template,
  onStart,
  disabled,
}: {
  template: WorkflowTemplate;
  onStart: (t: WorkflowTemplate) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-medium border border-default-100 bg-default-50/40 p-3 dark:bg-default-50/5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{template.name}</p>
        <p className="line-clamp-2 text-xs text-default-500">
          {template.description ?? "—"}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-wider text-default-400">
          {template.steps.length} step{template.steps.length === 1 ? "" : "s"} ·{" "}
          {template.triggerType}
        </p>
      </div>
      <Button
        size="sm"
        variant="secondary"
        isDisabled={disabled || !template.isActive}
        onPress={() => onStart(template)}
      >
        <Play className="h-3.5 w-3.5" />
        Start
      </Button>
    </div>
  );
}

function InstanceDetail({
  instance,
  templates,
  onApprove,
  onCancel,
  disabled,
}: {
  instance: WorkflowInstanceWithSteps;
  templates: WorkflowTemplate[];
  onApprove: (stepIndex: number, approved: boolean) => void;
  onCancel: () => void;
  disabled: boolean;
}) {
  const tpl = templates.find((t) => t.id === instance.templateId);
  const stepDefs = tpl?.steps ?? [];
  const isTerminal = ["completed", "cancelled", "failed"].includes(
    instance.status,
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Chip
          size="sm"
          variant="soft"
          color={STATUS_COLOR[instance.status] ?? "default"}
        >
          {instance.status.replace("_", " ")}
        </Chip>
        <span className="text-xs text-default-500">
          {tpl?.name ?? "Unknown"} · {instance.referenceType}:
          {instance.referenceId}
        </span>
        {!isTerminal ? (
          <Button
            size="sm"
            variant="danger"
            isDisabled={disabled}
            onPress={onCancel}
            className="ml-auto"
          >
            <Ban className="h-3.5 w-3.5" />
            Cancel
          </Button>
        ) : null}
      </div>
      <ol className="space-y-2">
        {instance.steps.length === 0 ? (
          <li className="text-sm text-default-400">No step records yet.</li>
        ) : (
          instance.steps.map((s) => {
            const def = stepDefs[s.stepIndex];
            const label = def?.label ?? def?.type ?? `Step ${s.stepIndex}`;
            const isCurrent =
              s.stepIndex === instance.currentStepIndex && !isTerminal;
            const canApprove =
              s.stepType === "approval" &&
              s.status === "in_progress" &&
              !isTerminal;
            return (
              <li
                key={s.id}
                className={`flex items-start gap-3 rounded-medium border p-2.5 ${
                  isCurrent
                    ? "border-primary-300 bg-primary-50/60 dark:border-primary-700 dark:bg-primary-950/30"
                    : "border-default-100"
                }`}
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-default-100 text-default-500">
                  {STEP_ICONS[s.stepType] ?? (
                    <CirclePlay className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{label}</span>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={STEP_STATUS_COLOR[s.status] ?? "default"}
                    >
                      {s.status.replace("_", " ")}
                    </Chip>
                  </div>
                  <p className="text-xs text-default-500">
                    {s.stepType}
                    {s.assignedTo
                      ? ` · assigned ${s.assignedTo.slice(0, 8)}…`
                      : ""}
                    {s.rejectionReason ? ` · ${s.rejectionReason}` : ""}
                  </p>
                </div>
                {canApprove ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      isDisabled={disabled}
                      onPress={() => onApprove(s.stepIndex, true)}
                      isIconOnly
                      aria-label="Approve"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      isDisabled={disabled}
                      onPress={() => onApprove(s.stepIndex, false)}
                      isIconOnly
                      aria-label="Reject"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })
        )}
      </ol>
      <div className="flex items-center justify-between text-xs text-default-400">
        <span>started {formatRelative(instance.startedAt)}</span>
        <span>updated {formatRelative(instance.updatedAt)}</span>
      </div>
    </div>
  );
}

export { CircleCheck, CircleXmark };
