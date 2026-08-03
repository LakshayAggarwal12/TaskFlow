import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useAnalytics } from "../features/analytics/useAnalytics";
import StatusDistributionChart from "../features/analytics/StatusDistributionChart";
import WorkloadByMemberChart from "../features/analytics/WorkloadByMemberChart";
import TaskListRow from "../features/tasks/TaskListRow";
import TaskDrawer from "../features/tasks/TaskDrawer";
import ProgressRing from "../components/ui/ProgressRing";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function AnalyticsPage() {
  const { projectId } = useParams();
  const { data: overview, isLoading } = useAnalytics(projectId);

  if (isLoading || !overview) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-9 w-48 mb-6" />
        <div className="grid grid-cols-3 gap-5">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-h1 font-display text-primary mb-6">Analytics</h1>

      <div className="grid grid-cols-3 gap-5 mb-5">
        <div className="bg-surface1 border border-hairline rounded-lg p-5 flex flex-col items-center justify-center">
          <ProgressRing percent={overview.completionRate} label="complete" />
          <p className="text-body-sm text-tertiary mt-3 text-center">
            {overview.completedTasks} of {overview.totalTasks} tasks
          </p>
        </div>

        <div className="col-span-2 bg-surface1 border border-hairline rounded-lg p-5">
          <h2 className="text-h2 font-display text-primary mb-4">Status distribution</h2>
          <StatusDistributionChart distribution={overview.statusDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-surface1 border border-hairline rounded-lg p-5">
          <h2 className="text-h2 font-display text-primary mb-4">Team workload</h2>
          <WorkloadByMemberChart workload={overview.workloadByMember} />
        </div>

        <div className="bg-surface1 border border-hairline rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-hairline">
            <AlertTriangle size={15} className="text-status-danger" />
            <h2 className="text-h2 font-display text-primary">Overdue ({overview.overdueCount})</h2>
          </div>
          {overview.overdueTasks.length === 0 ? (
            <EmptyState title="Nothing overdue" description="Everything is on track." className="py-8" />
          ) : (
            <div className="divide-y divide-hairline max-h-64 overflow-y-auto scrollbar-thin">
              {overview.overdueTasks.map((task) => (
                <TaskListRow key={task._id} task={{ ...task, isDoneList: false }} />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskDrawer />
    </div>
  );
}
