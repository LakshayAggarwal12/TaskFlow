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
    <header className="h-16 min-h-[64px] shrink-0 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 bg-canvas/80 backdrop-blur-xl border-b border-hairline transition-all">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="md:hidden -ml-1.5 w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface2 transition-colors duration-fast"
        >
          <Menu size={19} />
        </button>
        <div className="flex items-center gap-2 text-body-sm truncate">
          {breadcrumb ? (
            project ? (
              <>
                <span className="text-slate-400 hover:text-slate-300 font-medium cursor-default">{workspace?.name || ""}</span>
                <span className="text-slate-600">/</span>
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse"></span>
                  {project.name}
                </span>
              </>
            ) : (
              <span className="text-white font-semibold">{workspace?.name}</span>
            )
          ) : (
            <span className="inline-block w-36 h-4 rounded-md bg-surface2/60 animate-pulse" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {projectId ? (
          <>
            {/* Full search field on tablet+; icon-only on phones to save space */}
            <button
              onClick={() => navigate(`/w/${workspaceId}/p/${projectId}/backlog`)}
              className="hidden md:flex items-center gap-2.5 h-9 px-3 rounded-lg bg-surface2/70 border border-hairline hover:border-accent/40 text-slate-400 hover:text-slate-200 text-body-sm transition-all duration-fast w-64 shadow-inner"
            >
              <Search size={14} className="text-slate-400" />
              <span className="flex-1 text-left text-slate-400 text-xs font-normal">Ask AI or search...</span>
              <span className="text-[10px] text-slate-400 bg-surface3/80 border border-hairline px-1.5 py-0.5 rounded font-mono shrink-0">⌘K</span>
            </button>
            <button
              onClick={() => navigate(`/w/${workspaceId}/p/${projectId}/backlog`)}
              aria-label="Search"
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface2 transition-colors duration-fast"
            >
              <Search size={18} />
            </button>
          </>
        ) : (
          <div
            title="Available once you're inside a project"
            className="hidden md:flex items-center gap-2.5 h-9 px-3 rounded-lg bg-surface2/40 border border-hairline/60 text-slate-600 text-body-sm cursor-not-allowed w-64"
          >
            <Search size={14} />
            <span className="flex-1 text-left text-slate-600 text-xs">Ask AI or search...</span>
            <span className="text-[10px] text-slate-600 bg-surface3/40 rounded px-1.5 py-0.5 font-mono shrink-0">⌘K</span>
          </div>
        )}

        <button
          onClick={() => setIsPanelOpen((o) => !o)}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface2 transition-colors duration-fast"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
          )}
        </button>
      </div>

      <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </header>
  );
}
