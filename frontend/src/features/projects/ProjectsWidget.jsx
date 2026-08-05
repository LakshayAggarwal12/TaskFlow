import { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { useProjects } from "./hooks/useProjects";
import CreateProjectModal from "./CreateProjectModal";
import ProjectCard from "./ProjectCard";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

export default function ProjectsWidget({ workspaceId }) {
  const { data: projects, isLoading } = useProjects(workspaceId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="bg-surface1 border border-hairline rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h2 font-display text-primary">Projects</h2>
        <Button size="sm" variant="secondary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={14} /> New
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      )}

      {!isLoading && projects?.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project to start building boards, sprints, and tracking work."
          action={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus size={14} /> Create project
            </Button>
          }
          className="py-8"
        />
      )}

      {!isLoading && projects?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((p, i) => (
            <ProjectCard key={p._id} project={p} workspaceId={workspaceId} index={i} />
          ))}
        </div>
      )}

      <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} workspaceId={workspaceId} />
    </div>
  );
}
