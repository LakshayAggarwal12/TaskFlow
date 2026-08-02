import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { useWorkspace } from "../features/workspaces/hooks/useWorkspaces";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import NotificationPanel from "../features/notifications/NotificationPanel";
import SignalDot from "../components/ui/SignalDot";

export default function Topbar() {
  const { workspaceId } = useParams();
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: notifData } = useNotifications({ unreadOnly: true, limit: 1 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const unreadCount = notifData?.unreadCount ?? 0;

  return (
    <header className="h-14 shrink-0 sticky top-0 z-20 flex items-center justify-between px-6 bg-canvas/95 backdrop-blur border-b border-hairline">
      <p className="text-body-sm text-secondary truncate">
        {workspace?.name || <span className="inline-block w-32 h-3.5 rounded bg-surface2 animate-pulse" />}
      </p>

      <div className="flex items-center gap-3">
        <div
          title="Available once you create your first project"
          className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md bg-surface2 border border-hairline text-tertiary text-body-sm cursor-not-allowed w-64"
        >
          <Search size={14} />
          Ask AI or search...
        </div>

        <button
          onClick={() => setIsPanelOpen((o) => !o)}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          className="relative w-9 h-9 rounded-md flex items-center justify-center text-secondary hover:text-primary hover:bg-surface2 transition-colors duration-fast"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <SignalDot size={7} className="absolute top-1.5 right-1.5" />
          )}
        </button>
      </div>

      <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </header>
  );
}
