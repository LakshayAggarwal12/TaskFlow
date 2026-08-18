import { NavLink, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, KanbanSquare, ListTodo, Zap, BarChart3, Activity, Settings, LogOut, X } from "lucide-react";
import WorkspaceSwitcher from "../features/workspaces/WorkspaceSwitcher";
import { useProjectBoards } from "../features/boards/hooks/useProjectBoards";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

const PROJECT_SCOPED_ITEMS = [
  { label: "Board", icon: KanbanSquare },
  { label: "Backlog", icon: ListTodo },
  { label: "Sprints", icon: Zap },
  { label: "Analytics", icon: BarChart3 },
  { label: "Activity", icon: Activity },
];

// The actual nav content, shared between the always-visible desktop rail
// and the mobile slide-in overlay — written once, rendered in two shells.
function SidebarContent({ onNavigate }) {
  const { workspaceId, projectId } = useParams();
  const { user, logout } = useAuth();
  const { data: boards } = useProjectBoards(projectId);
  const primaryBoardId = boards?.[0]?._id;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 h-10 md:h-9 rounded-md text-body transition-colors duration-fast border-l-2 ${
      isActive
        ? "bg-accent-muted text-accent border-accent"
        : "text-secondary hover:text-primary hover:bg-surface2 border-transparent"
    }`;

  const disabledClass =
    "flex items-center gap-2.5 px-3 h-10 md:h-9 rounded-md text-body text-tertiary cursor-not-allowed opacity-60 border-l-2 border-transparent";

  return (
    <>
      <div className="flex items-center gap-2 px-1 mb-5">
        <span className="w-6 h-6 rounded-sm bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-canvas text-caption font-bold">
          T
        </span>
        <span className="text-h3 text-primary font-display">TaskFlow</span>
      </div>

      <WorkspaceSwitcher />

      <nav className="flex flex-col gap-0.5 mt-5">
        <NavLink to={`/w/${workspaceId}`} end className={navLinkClass} onClick={onNavigate}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        {projectId && (
          <>
            <div className="mt-4 mb-1 px-3 text-caption text-tertiary uppercase tracking-widest">Project</div>
            {primaryBoardId ? (
              <NavLink to={`/w/${workspaceId}/p/${projectId}/board/${primaryBoardId}`} className={navLinkClass} onClick={onNavigate}>
                <KanbanSquare size={16} />
                Board
              </NavLink>
            ) : (
              <div title="Create a board first" className={disabledClass}>
                <KanbanSquare size={16} />
                Board
              </div>
            )}
            <NavLink to={`/w/${workspaceId}/p/${projectId}/backlog`} className={navLinkClass} onClick={onNavigate}>
              <ListTodo size={16} />
              Backlog
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/sprints`} className={navLinkClass} onClick={onNavigate}>
              <Zap size={16} />
              Sprints
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/analytics`} className={navLinkClass} onClick={onNavigate}>
              <BarChart3 size={16} />
              Analytics
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/activity`} className={navLinkClass} onClick={onNavigate}>
              <Activity size={16} />
              Activity
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 pt-3 border-t border-hairline">
        {projectId && (
          <NavLink to={`/w/${workspaceId}/p/${projectId}/settings`} className={navLinkClass} onClick={onNavigate}>
            <Settings size={16} />
            Project settings
          </NavLink>
        )}
        <NavLink to={`/w/${workspaceId}/settings`} className={navLinkClass} onClick={onNavigate}>
          <Settings size={16} />
          Workspace settings
        </NavLink>
        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-md bg-surface2">
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
    </>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop: always visible, static, takes up real layout space */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 flex-col bg-surface1 border-r border-hairline px-3 py-4">
        <SidebarContent />
      </aside>

      {/* Mobile: off-canvas overlay, only mounted while open */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-surface1 border-r border-hairline px-3 py-4"
            >
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute top-4 right-3 text-tertiary hover:text-primary transition-colors duration-fast"
              >
                <X size={18} />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
