import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useWorkspace } from "../features/workspaces/hooks/useWorkspaces";
import { useAuth } from "../context/AuthContext";
import ProjectsWidget from "../features/projects/ProjectsWidget";
import RecentNotificationsWidget from "../features/notifications/RecentNotificationsWidget";
import TeamWidget from "../features/workspaces/TeamWidget";
import Skeleton from "../components/ui/Skeleton";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function WorkspaceDashboardPage() {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const { data: workspace, isLoading } = useWorkspace(workspaceId);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
        className="mb-8"
      >
        <h1 className="text-display-xl font-display text-primary">
          {greeting()}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-body text-secondary mt-1">
          Here's what's happening in <span className="text-primary">{workspace?.name || "your workspace"}</span>.
        </p>
      </motion.div>

      {/* Asymmetric grid: wide left column (Projects), narrow right column (Team) */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 flex flex-col gap-5">
          <ProjectsWidget workspaceId={workspaceId} />
          <RecentNotificationsWidget />
        </div>
        <div className="col-span-1">
          {isLoading ? <Skeleton className="h-64" /> : <TeamWidget workspace={workspace} />}
        </div>
      </div>
    </div>
  );
}
