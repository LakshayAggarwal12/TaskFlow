import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Bell, Menu } from "lucide-react";
import { useWorkspace } from "../features/workspaces/hooks/useWorkspaces";
import { useProject } from "../features/projects/hooks/useProject";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import NotificationPanel from "../features/notifications/NotificationPanel";
import SignalDot from "../components/ui/SignalDot";

export default function Topbar({ onMenuClick }) {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: projectData } = useProject(projectId);
  const { data: notifData } = useNotifications({ unreadOnly: true, limit: 1 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const unreadCount = notifData?.unreadCount ?? 0;
  const project = projectData?.project;

  const breadcrumb = project ? `${workspace?.name || ""} / ${project.name}` : workspace?.name;

  return (
    <header className="h-14 shrink-0 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 bg-canvas/95 backdrop-blur border-b border-hairline">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="md:hidden -ml-1 w-9 h-9 shrink-0 rounded-md flex items-center justify-center text-secondary hover:text-primary hover:bg-surface2 transition-colors duration-fast"
        >
          <Menu size={18} />
        </button>
        <p className="text-body-sm text-secondary truncate">
          {breadcrumb || <span className="inline-block w-32 h-3.5 rounded bg-surface2 animate-pulse" />}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {projectId ? (
          <>
            {/* Full search field on tablet+; icon-only on phones to save space */}
            <button
              onClick={() => navigate(`/w/${workspaceId}/p/${projectId}/backlog`)}
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md bg-surface2 border border-hairline hover:border-strong text-tertiary hover:text-secondary text-body-sm transition-colors duration-fast w-64"
            >
              <Search size={14} />
              Ask AI or search...
            </button>
            <button
              onClick={() => navigate(`/w/${workspaceId}/p/${projectId}/backlog`)}
              aria-label="Search"
              className="md:hidden w-9 h-9 rounded-md flex items-center justify-center text-secondary hover:text-primary hover:bg-surface2 transition-colors duration-fast"
            >
              <Search size={17} />
            </button>
          </>
        ) : (
          <div
            title="Available once you're inside a project"
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md bg-surface2 border border-hairline text-tertiary text-body-sm cursor-not-allowed w-64"
          >
            <Search size={14} />
            Ask AI or search...
          </div>
        )}

        <button
          onClick={() => setIsPanelOpen((o) => !o)}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          className="relative w-9 h-9 rounded-md flex items-center justify-center text-secondary hover:text-primary hover:bg-surface2 transition-colors duration-fast"
        >
          <Bell size={17} />
          {unreadCount > 0 && <SignalDot size={7} className="absolute top-1.5 right-1.5" />}
        </button>
      </div>

      <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </header>
  );
}
