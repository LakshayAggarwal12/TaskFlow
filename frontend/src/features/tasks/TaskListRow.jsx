import { useSearchParams } from "react-router-dom";
import PriorityDot from "./PriorityDot";
import AssigneeAvatarGroup from "./AssigneeAvatarGroup";
import Badge from "../../components/ui/Badge";
import { formatDate, isOverdue } from "../../lib/dateUtils";
import { Clock, ChevronRight } from "lucide-react";

export default function TaskListRow({ task }) {
  const [, setSearchParams] = useSearchParams();
  const overdue = isOverdue(task.dueDate) && !task.isDoneList;

  const priorityBorder =
    task.priority === "high"
      ? "border-l-priority-high"
      : task.priority === "medium"
      ? "border-l-priority-medium"
      : task.priority === "low"
      ? "border-l-priority-low"
      : "border-l-hairline";

  return (
    <button
      onClick={() => setSearchParams((prev) => ({ ...Object.fromEntries(prev), task: task._id }))}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface2 transition-colors duration-fast group border-l-2 ${priorityBorder}`}
    >
      <PriorityDot priority={task.priority} />
      <span className="text-body-sm text-primary flex-1 truncate">{task.title}</span>
      {task.listName && (
        <Badge tone={task.isDoneList ? "success" : "neutral"}>{task.listName}</Badge>
      )}
      {task.dueDate && (
        <span className={`flex items-center gap-1 text-caption shrink-0 ${overdue ? "text-status-danger" : "text-tertiary"}`}>
          <Clock size={11} />
          {formatDate(task.dueDate)}
        </span>
      )}
      <AssigneeAvatarGroup assignees={task.assignees} max={2} />
      <ChevronRight size={13} className="text-tertiary opacity-0 group-hover:opacity-60 shrink-0 transition-opacity duration-fast" />
    </button>
  );
}
