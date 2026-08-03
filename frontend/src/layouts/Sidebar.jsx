import { NavLink, useParams } from "react-router-dom";
import { LayoutDashboard, KanbanSquare, ListTodo, Zap, BarChart3, Activity, Settings, LogOut } from "lucide-react";
import WorkspaceSwitcher from "../features/workspaces/WorkspaceSwitcher";
import { useProjectBoards } from "../features/boards/hooks/useProjectBoards";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { workspaceId, projectId } = useParams();
  const { user, logout } = useAuth();
  const { data: boards } = useProjectBoards(projectId);
  const primaryBoardId = boards?.[0]?._id;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 h-9 rounded-md text-body transition-colors duration-fast ${
      isActive ? "bg-accent-muted text-accent" : "text-secondary hover:text-primary hover:bg-surface2"
    }`;

  const disabledClass =
    "flex items-center gap-2.5 px-3 h-9 rounded-md text-body text-tertiary cursor-not-allowed opacity-60";

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-surface1 border-r border-hairline px-3 py-4">
      <div className="flex items-center gap-2 px-1 mb-5">
        <span className="w-6 h-6 rounded-sm bg-accent flex items-center justify-center text-canvas text-caption font-bold">
          T
        </span>
        <span className="text-h3 text-primary font-display">TaskFlow</span>
      </div>

      <WorkspaceSwitcher />

      <nav className="flex flex-col gap-0.5 mt-5">
        <NavLink to={`/w/${workspaceId}`} end className={navLinkClass}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        {projectId && (
          <>
            <div className="mt-3 mb-1 px-3 text-caption text-tertiary">Project</div>
            {primaryBoardId ? (
              <NavLink to={`/w/${workspaceId}/p/${projectId}/board/${primaryBoardId}`} className={navLinkClass}>
                <KanbanSquare size={16} />
                Board
              </NavLink>
            ) : (
              <div title="Create a board first" className={disabledClass}>
                <KanbanSquare size={16} />
                Board
              </div>
            )}
            <NavLink to={`/w/${workspaceId}/p/${projectId}/backlog`} className={navLinkClass}>
              <ListTodo size={16} />
              Backlog
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/sprints`} className={navLinkClass}>
              <Zap size={16} />
              Sprints
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/analytics`} className={navLinkClass}>
              <BarChart3 size={16} />
              Analytics
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/activity`} className={navLinkClass}>
              <Activity size={16} />
              Activity
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 pt-3 border-t border-hairline">
        {projectId && (
          <NavLink to={`/w/${workspaceId}/p/${projectId}/settings`} className={navLinkClass}>
            <Settings size={16} />
            Project settings
          </NavLink>
        )}
        <NavLink to={`/w/${workspaceId}/settings`} className={navLinkClass}>
          <Settings size={16} />
          Workspace settings
        </NavLink>
        <div className="flex items-center gap-2.5 px-3 h-11 mt-1">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-body-sm text-primary truncate">{user?.name}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="text-tertiary hover:text-status-danger transition-colors duration-fast"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
