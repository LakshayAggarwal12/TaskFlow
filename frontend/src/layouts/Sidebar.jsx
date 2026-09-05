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
    `flex items-center gap-2.5 px-3 h-9 rounded-lg text-body-sm font-medium transition-all duration-fast ${
      isActive
        ? "bg-accent/10 text-accent font-semibold shadow-xs"
        : "text-slate-400 hover:text-slate-200 hover:bg-surface2/60"
    }`;

  const disabledClass =
    "flex items-center gap-2.5 px-3 h-9 rounded-lg text-body-sm text-slate-600 cursor-not-allowed opacity-50";

  return (
    <>
      <div className="flex items-center gap-2.5 px-1.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-slate-950 text-caption font-bold shadow-md shadow-accent/20">
          T
        </div>
        <div>
          <span className="text-h3 font-bold tracking-tight text-white font-display">TaskFlow</span>
          <span className="block text-[10px] uppercase font-mono tracking-widest text-accent font-semibold -mt-1">Workspace</span>
        </div>
      </div>

      <div className="mb-4">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-thin pr-1">
        <NavLink to={`/w/${workspaceId}`} end className={navLinkClass} onClick={onNavigate}>
          <LayoutDashboard size={16} className="shrink-0 opacity-80" />
          <span>Dashboard</span>
        </NavLink>

        {projectId && (
          <>
            <div className="mt-5 mb-1 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Project Navigation
            </div>
            {primaryBoardId ? (
              <NavLink to={`/w/${workspaceId}/p/${projectId}/board/${primaryBoardId}`} className={navLinkClass} onClick={onNavigate}>
                <KanbanSquare size={16} className="shrink-0 opacity-80" />
                <span>Active Board</span>
              </NavLink>
            ) : (
              <div title="Create a board first" className={disabledClass}>
                <KanbanSquare size={16} className="shrink-0" />
                <span>Active Board</span>
              </div>
            )}
            <NavLink to={`/w/${workspaceId}/p/${projectId}/backlog`} className={navLinkClass} onClick={onNavigate}>
              <ListTodo size={16} className="shrink-0 opacity-80" />
              <span>Backlog</span>
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/sprints`} className={navLinkClass} onClick={onNavigate}>
              <Zap size={16} className="shrink-0 opacity-80" />
              <span>Sprints</span>
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/analytics`} className={navLinkClass} onClick={onNavigate}>
              <BarChart3 size={16} className="shrink-0 opacity-80" />
              <span>Analytics</span>
            </NavLink>
            <NavLink to={`/w/${workspaceId}/p/${projectId}/activity`} className={navLinkClass} onClick={onNavigate}>
              <Activity size={16} className="shrink-0 opacity-80" />
              <span>Activity</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-3 border-t border-hairline">
        {projectId && (
          <NavLink to={`/w/${workspaceId}/p/${projectId}/settings`} className={navLinkClass} onClick={onNavigate}>
            <Settings size={15} className="shrink-0 opacity-80" />
            <span>Project Settings</span>
          </NavLink>
        )}
        <NavLink to={`/w/${workspaceId}/settings`} className={navLinkClass} onClick={onNavigate}>
          <Settings size={15} className="shrink-0 opacity-80" />
          <span>Workspace Settings</span>
        </NavLink>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-2 rounded-xl bg-surface2/80 border border-hairline/60">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            title="Log out"
            className="p-1.5 rounded-md text-slate-400 hover:text-status-danger hover:bg-status-danger/10 transition-colors duration-fast"
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
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 flex-col bg-surface1/90 backdrop-blur-xl border-r border-hairline px-3.5 py-4 z-20">
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
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-surface1/95 backdrop-blur-xl border-r border-hairline px-3.5 py-4 shadow-2xl"
            >
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute top-4 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface2 transition-colors duration-fast"
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
