import { useState } from "react";
import { useParams } from "react-router-dom";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import { useActivity } from "../features/activity/useActivity";
import ActivityItem from "../features/activity/ActivityItem";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function ActivityPage() {
  const { projectId } = useParams();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivity(projectId, { page, limit: 20 });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-h1 font-display text-primary mb-6">Activity</h1>

      <div className="bg-surface1 border border-hairline rounded-lg overflow-hidden">
        {isLoading && (
          <div className="p-4 flex flex-col gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}

        {!isLoading && data?.activities.length === 0 && (
          <EmptyState icon={History} title="No activity yet" description="Actions across this project will show up here." className="py-12" />
        )}

        {!isLoading && data?.activities.length > 0 && (
          <div className="divide-y divide-hairline">
            {data.activities.map((a) => (
              <ActivityItem key={a._id} activity={a} />
            ))}
          </div>
        )}
      </div>

      {data?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-tertiary hover:text-primary disabled:opacity-30 transition-colors duration-fast"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-body-sm text-secondary font-mono">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="text-tertiary hover:text-primary disabled:opacity-30 transition-colors duration-fast"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
