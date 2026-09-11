"use client";

import { useState } from "react";
import { WorkspaceApp } from "./workspace-app";
import { KanbanBoard } from "./kanban-board";

export function WorkspaceViews() {
  const [view, setView] = useState<"deals" | "projects">("deals");
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-1 border-b border-[#e4e4e7] dark:border-[#27272a] px-4 py-2">
        {(["deals", "projects"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-lg px-3 py-1.5 text-[14px] font-semibold capitalize transition-colors ${
              view === v
                ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
                : "text-[#737373] dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-4">
        {view === "deals" ? <WorkspaceApp /> : <KanbanBoard />}
      </div>
    </div>
  );
}
