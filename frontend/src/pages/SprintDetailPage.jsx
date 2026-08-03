import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Flag, Plus, X } from "lucide-react";
import { useSprint, useCloseSprint, useAddTaskToSprint, useRemoveTaskFromSprint } from "../features/sprints/hooks/useSprints";
import { useProjectTasks } from "../features/tasks/hooks/useProjectTasks";
import BurndownChart from "../features/sprints/BurndownChart";
import AISummaryCard from "../features/sprints/AISummaryCard";
import TaskListRow from "../features/tasks/TaskListRow";
import TaskDrawer from "../features/tasks/TaskDrawer";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import ProgressRing from "../components/ui/ProgressRing";
import Skeleton from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../lib/dateUtils";

export default function SprintDetailPage() {
  const { projectId, sprintId } = useParams();
  const { data, isLoading } = useSprint(sprintId);
  const { tasks: allProjectTasks } = useProjectTasks(projectId);
  const closeSprint = useCloseSprint(sprintId, projectId);
  const addTask = useAddTaskToSprint(sprintId);
  const removeTask = useRemoveTaskFromSprint(sprintId);
  const toast = useToast();
  const [selectedTaskId, setSelectedTaskId] = useState("");

  if (isLoading || !data) {
    return (
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-9 w-56 mb-6" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const { sprint, tasks, snapshot } = data;
  const availableTasks = allProjectTasks.filter((t) => !tasks.some((st) => st._id === t._id));

  const handleClose = async () => {
    if (!confirm(`Close "${sprint.name}"? This generates an AI recap and can't be undone.`)) return;
    try {
      await closeSprint.mutateAsync();
      toast.success("Sprint closed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not close sprint.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-display text-primary">{sprint.name}</h1>
            <Badge tone={sprint.status === "completed" ? "success" : "accent"}>{sprint.status}</Badge>
          </div>
          <p className="text-body-sm text-tertiary mt-1">
            {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
          </p>
        </div>
        {sprint.status !== "completed" && (
          <Button variant="secondary" onClick={handleClose} isLoading={closeSprint.isPending}>
            <Flag size={14} /> Close sprint
          </Button>
        )}
      </div>

      {sprint.goal && <p className="text-body text-secondary mt-3 mb-6">"{sprint.goal}"</p>}

      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 bg-surface1 border border-hairline rounded-lg p-5">
          <h2 className="text-h2 font-display text-primary mb-4">Burndown</h2>
          <BurndownChart snapshot={snapshot} />
        </div>
        <div className="bg-surface1 border border-hairline rounded-lg p-5 flex flex-col items-center justify-center">
          <ProgressRing percent={(snapshot.completedTasks / Math.max(snapshot.totalTasks, 1)) * 100} label="complete" />
          <p className="text-body-sm text-tertiary mt-3 text-center">
            {snapshot.completedTasks} of {snapshot.totalTasks} tasks done
          </p>
        </div>
      </div>

      {sprint.aiSummary && (
        <div className="mb-6">
          <AISummaryCard summary={sprint.aiSummary} />
        </div>
      )}

      <div className="bg-surface1 border border-hairline rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <h2 className="text-h2 font-display text-primary">Tasks ({tasks.length})</h2>
          {sprint.status !== "completed" && availableTasks.length > 0 && (
            <div className="flex items-center gap-2">
              <Select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} className="h-8 text-body-sm w-48">
                <option value="">Add a task...</option>
                {availableTasks.map((t) => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </Select>
              <button
                onClick={() => {
                  if (selectedTaskId) {
                    addTask.mutate(selectedTaskId);
                    setSelectedTaskId("");
                  }
                }}
                className="text-tertiary hover:text-accent transition-colors duration-fast"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-hairline">
          {tasks.map((task) => (
            <div key={task._id} className="flex items-center">
              <div className="flex-1">
                <TaskListRow task={task} />
              </div>
              {sprint.status !== "completed" && (
                <button
                  onClick={() => removeTask.mutate(task._id)}
                  aria-label="Remove from sprint"
                  className="text-tertiary hover:text-status-danger transition-colors duration-fast px-3"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <TaskDrawer />
    </div>
  );
}
