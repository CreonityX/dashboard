"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Typography } from "@heroui/react";
import {
  addWsCommentAction,
  createWsProjectAction,
  createWsTaskAction,
  listWsCommentsAction,
  listWsLanesAction,
  listWsProjectsAction,
  moveWsTaskLaneAction,
} from "@/app/actions/workspace";
import type { WsComment, WsLane, WsLanes, WsProject, WsTask } from "@/lib/api";

const LANES: { id: WsLane; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "approved", label: "Approved" },
  { id: "blocked", label: "Blocked" },
];

const EMPTY_LANES: WsLanes = {
  todo: [],
  in_progress: [],
  in_review: [],
  approved: [],
  blocked: [],
};

function TaskCard({
  task,
  onOpen,
}: {
  task: WsTask;
  onOpen: (t: WsTask) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(task)}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={`w-full text-left rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#131316] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#0ea5e9]/50 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white leading-snug">
        {task.title}
      </p>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-[#737373] dark:text-[#a1a1aa]">
        <span className="capitalize">{task.priority}</span>
        {task.commentsCount > 0 && <span>{task.commentsCount} comments</span>}
        {task.dueAt && <span>{new Date(task.dueAt).toLocaleDateString()}</span>}
      </div>
    </button>
  );
}

function Lane({
  lane,
  tasks,
  onOpen,
}: {
  lane: { id: WsLane; label: string };
  tasks: WsTask[];
  onOpen: (t: WsTask) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: lane.id });
  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-2xl border p-3 transition-colors ${
        isOver
          ? "border-[#0ea5e9]/60 bg-[#0ea5e9]/5"
          : "border-[#e4e4e7] dark:border-[#27272a] bg-gray-50/60 dark:bg-white/[0.02]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <Typography
          type="body-sm"
          className="font-bold text-[#0a0a0a] dark:text-white text-[14px]"
        >
          {lane.label}
        </Typography>
        <span className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa]">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [projects, setProjects] = useState<WsProject[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [lanes, setLanes] = useState<WsLanes>(EMPTY_LANES);
  const [newProject, setNewProject] = useState("");
  const [newTask, setNewTask] = useState("");
  const [openTask, setOpenTask] = useState<WsTask | null>(null);
  const [comments, setComments] = useState<WsComment[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  useEffect(() => {
    void listWsProjectsAction().then((r) => {
      if (r.success) {
        setProjects(r.data);
        if (r.data.length > 0 && !projectId) setProjectId(r.data[0]?.id ?? "");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!projectId) return;
    void listWsLanesAction(projectId).then((r) => {
      if (r.success) setLanes(r.data);
    });
  }, [projectId]);

  useEffect(() => {
    if (!openTask) return;
    void listWsCommentsAction(openTask.id).then((r) => {
      if (r.success) setComments(r.data);
    });
  }, [openTask]);

  const laneOf = useMemo(() => {
    const map = new Map<string, WsLane>();
    (Object.keys(lanes) as WsLane[]).forEach((l) =>
      lanes[l].forEach((t) => map.set(t.id, l)),
    );
    return map;
  }, [lanes]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const taskId = String(active.id);
    const to = over.id as WsLane;
    const from = laneOf.get(taskId);
    if (!from || from === to) return;
    const task = lanes[from].find((t) => t.id === taskId);
    if (!task) return;
    setLanes((prev) => ({
      ...prev,
      [from]: prev[from].filter((t) => t.id !== taskId),
      [to]: [...prev[to], { ...task, lane: to }],
    }));
    const r = await moveWsTaskLaneAction(taskId, to);
    if (!r.success && projectId) {
      const fresh = await listWsLanesAction(projectId);
      if (fresh.success) setLanes(fresh.data);
    }
  }

  async function handleCreateProject() {
    const name = newProject.trim();
    if (!name) return;
    const r = await createWsProjectAction(name);
    if (r.success) {
      setProjects((p) => [...p, r.data]);
      setProjectId(r.data.id);
      setNewProject("");
    }
  }

  async function handleCreateTask() {
    const title = newTask.trim();
    if (!title || !projectId) return;
    const r = await createWsTaskAction(projectId, title);
    if (r.success) {
      setLanes((prev) => ({ ...prev, todo: [...prev.todo, r.data] }));
      setNewTask("");
    }
  }

  async function handleAddComment() {
    const body = commentDraft.trim();
    if (!body || !openTask) return;
    const r = await addWsCommentAction(openTask.id, body);
    if (r.success) {
      setComments((c) => [...c, r.data]);
      setCommentDraft("");
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#131316] px-3 py-2 text-[14px] font-medium text-[#0a0a0a] dark:text-white"
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void handleCreateProject()}
          placeholder="New project name"
          className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#131316] px-3 py-2 text-[14px] text-[#0a0a0a] dark:text-white placeholder:text-[#a1a1aa]"
        />
        <button
          onClick={() => void handleCreateProject()}
          className="rounded-xl bg-[#0a0a0a] dark:bg-white px-3 py-2 text-[14px] font-semibold text-white dark:text-[#0a0a0a]"
        >
          Add project
        </button>
        <div className="flex flex-1 items-center gap-2 lg:justify-end">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleCreateTask()}
            placeholder="New task title"
            className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#131316] px-3 py-2 text-[14px] text-[#0a0a0a] dark:text-white placeholder:text-[#a1a1aa]"
          />
          <button
            onClick={() => void handleCreateTask()}
            className="rounded-xl bg-[#0ea5e9] px-3 py-2 text-[14px] font-semibold text-white"
          >
            Add task
          </button>
        </div>
      </div>

      {!projectId ? (
        <p className="text-[14px] text-[#737373] dark:text-[#a1a1aa]">
          Create a project to start tracking tasks.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => void handleDragEnd(e)}
        >
          <div className="flex flex-1 gap-3 overflow-x-auto pb-2">
            {LANES.map((lane) => (
              <Lane
                key={lane.id}
                lane={lane}
                tasks={lanes[lane.id]}
                onOpen={setOpenTask}
              />
            ))}
          </div>
        </DndContext>
      )}

      {openTask && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-2xl sm:rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#131316] p-5">
            <div className="mb-1 flex items-start justify-between gap-3">
              <p className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">
                {openTask.title}
              </p>
              <button
                onClick={() => setOpenTask(null)}
                className="text-[13px] font-semibold text-[#737373] dark:text-[#a1a1aa] hover:underline"
              >
                Close
              </button>
            </div>
            <div className="mb-4 flex max-h-64 flex-col gap-2 overflow-y-auto">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl bg-gray-50 dark:bg-white/5 p-3 text-[14px] text-[#0a0a0a] dark:text-white"
                >
                  {c.body}
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">
                  No comments yet.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void handleAddComment()}
                placeholder="Write a comment"
                className="flex-1 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] px-3 py-2 text-[14px] text-[#0a0a0a] dark:text-white placeholder:text-[#a1a1aa]"
              />
              <button
                onClick={() => void handleAddComment()}
                className="rounded-xl bg-[#0a0a0a] dark:bg-white px-3 py-2 text-[14px] font-semibold text-white dark:text-[#0a0a0a]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
