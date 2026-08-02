import { NavLink, useParams } from "react-router-dom";
import { LayoutDashboard, KanbanSquare, ListTodo, Zap, BarChart3, Activity, Settings, LogOut } from "lucide-react";
import WorkspaceSwitcher from "../features/workspaces/WorkspaceSwitcher";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

const PROJECT_SCOPED_ITEMS = [
  { label: "Board", icon: KanbanSquare },
  { label: "Backlog", icon: ListTodo },
  { label: "Sprints", icon: Zap },
  { label: "Analytics", icon: BarChart3 },
  { label: "Activity", icon: Activity },
];

export default function Sidebar() {
  const { workspaceId } = useParams();
  const { user, logout } = useAuth();

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
        <NavLink
          to={`/w/${workspaceId}`}
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 h-9 rounded-md text-body transition-colors duration-fast ${
              isActive ? "bg-accent-muted text-accent" : "text-secondary hover:text-primary hover:bg-surface2"
            }`
          }
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <div className="mt-3 mb-1 px-3 text-caption text-tertiary">Project</div>
        {PROJECT_SCOPED_ITEMS.map(({ label, icon: Icon }) => (
          <div
            key={label}
            title="Available once you create your first project"
            className="flex items-center gap-2.5 px-3 h-9 rounded-md text-body text-tertiary cursor-not-allowed opacity-60"
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 pt-3 border-t border-hairline">
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 h-9 rounded-md text-body transition-colors duration-fast ${
              isActive ? "bg-accent-muted text-accent" : "text-secondary hover:text-primary hover:bg-surface2"
            }`
          }
        >
          <Settings size={16} />
          Settings
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
