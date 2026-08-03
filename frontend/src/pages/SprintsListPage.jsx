import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Zap } from "lucide-react";
import { useSprints } from "../features/sprints/hooks/useSprints";
import SprintCard from "../features/sprints/SprintCard";
import CreateSprintModal from "../features/sprints/CreateSprintModal";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function SprintsListPage() {
  const { projectId } = useParams();
  const { data: sprints, isLoading } = useSprints(projectId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 font-display text-primary">Sprints</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus size={15} /> New sprint
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      {!isLoading && sprints?.length === 0 && (
        <EmptyState
          icon={Zap}
          title="No sprints yet"
          description="Group tasks into a time-boxed sprint to track a burndown and get an AI recap when it closes."
          action={<Button onClick={() => setIsCreateOpen(true)}><Plus size={15} /> Create sprint</Button>}
        />
      )}

      {!isLoading && sprints?.length > 0 && (
        <div className="flex flex-col gap-3">
          {sprints.map((s, i) => (
            <SprintCard key={s._id} sprint={s} index={i} />
          ))}
        </div>
      )}

      <CreateSprintModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} projectId={projectId} />
    </div>
  );
}
