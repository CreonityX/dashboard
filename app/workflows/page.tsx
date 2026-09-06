import { DesktopSidebar } from "@/components/desktop-sidebar";
import { MessagesPill } from "@/components/messages-pill";
import { MobileNav } from "@/components/mobile-nav";
import { listWorkflowTemplatesAction } from "@/app/actions/workflows";
import { WorkflowApp } from "@/components/workflows/workflow-app";

export const metadata = { title: "Workflows — Creonity" };

export default async function WorkflowsPage() {
  const result = await listWorkflowTemplatesAction();
  const initialTemplates = result.success ? result.data : [];

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="workflows" />
      <div className="flex-1 lg:pl-[88px] min-h-0">
        <MessagesPill />
        <MobileNav />
        <div className="h-full overflow-y-auto">
          <WorkflowApp
            initialTemplates={initialTemplates}
            initialError={result.success ? null : result.error}
          />
        </div>
      </div>
    </main>
  );
}
