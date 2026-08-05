import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Users, ArrowRight, Boxes } from "lucide-react";
import { useWorkspaces } from "../features/workspaces/hooks/useWorkspaces";
import CreateWorkspaceModal from "../features/workspaces/CreateWorkspaceModal";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function WorkspaceSelectorPage() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  // If the user belongs to exactly one workspace, skip the picker entirely.
  useEffect(() => {
    if (workspaces?.length === 1) {
      navigate(`/w/${workspaces[0]._id}`, { replace: true });
    }
  }, [workspaces, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 sm:py-16">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (workspaces?.length === 1) return null; // redirect effect above is handling this

  if (workspaces?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <EmptyState
          icon={Boxes}
          title="Create your first workspace"
          description="A workspace holds your team's projects, boards, and sprints — think of it as your team's home base."
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} /> Create workspace
            </Button>
          }
        />
        <CreateWorkspaceModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-h1 font-display text-primary">Your workspaces</h1>
        <Button variant="secondary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} /> New workspace
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workspaces.map((w, i) => (
          <motion.button
            key={w._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: i * 0.03, ease: [0, 0, 0.2, 1] }}
            whileHover={{ y: -2 }}
            onClick={() => navigate(`/w/${w._id}`)}
            className="text-left p-5 rounded-lg bg-surface1 border border-hairline hover:border-strong transition-colors duration-fast group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-md bg-surface3 flex items-center justify-center">
                <Boxes size={16} className="text-secondary" />
              </div>
              <ArrowRight size={15} className="text-tertiary group-hover:text-accent transition-colors duration-fast" />
            </div>
            <h3 className="text-h3 text-primary mb-1 truncate">{w.name}</h3>
            <div className="flex items-center gap-1.5 text-body-sm text-tertiary">
              <Users size={12} />
              {w.members?.length ?? 0} member{w.members?.length === 1 ? "" : "s"}
            </div>
          </motion.button>
        ))}
      </div>
      <CreateWorkspaceModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
