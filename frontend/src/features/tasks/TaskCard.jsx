import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import PriorityDot from "./PriorityDot";
import LabelChips from "./LabelChips";
import AssigneeAvatarGroup from "./AssigneeAvatarGroup";
import SubtaskProgressBar from "./SubtaskProgressBar";
import { formatDate, isOverdue } from "../../lib/dateUtils";

export default function TaskCard({ task }) {
  const [, setSearchParams] = useSearchParams();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(task.dueDate);

  const priorityBorder =
    task.priority === "high"
      ? "border-l-priority-high"
      : task.priority === "medium"
      ? "border-l-priority-medium"
      : task.priority === "low"
      ? "border-l-priority-low"
      : "border-l-hairline";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSearchParams((prev) => ({ ...Object.fromEntries(prev), task: task._id }))}
      animate={isDragging ? { scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" } : { scale: 1, boxShadow: "none" }}
      transition={{ duration: 0.16 }}
      className={`bg-surface2 border-l-2 ${priorityBorder} border border-hairline rounded-md p-3 cursor-pointer
        hover:border-strong hover:shadow-elevate hover:-translate-y-px
        transition-all duration-fast ease-standard flex flex-col gap-2
        ${isDragging ? "opacity-90 z-10 ring-2 ring-accent/30" : ""}`}
    >
      <div className="flex items-start gap-1.5">
        <PriorityDot priority={task.priority} className="mt-1.5" />
        <p className="text-body-sm text-primary leading-snug flex-1">{task.title}</p>
      </div>

      {task.subtasks?.length > 0 && <SubtaskProgressBar subtasks={task.subtasks} />}

      <div className="flex items-center justify-between gap-2">
        <LabelChips labels={task.labels} />
        {task.dueDate && (
          <span className={`flex items-center gap-1 text-[10px] shrink-0 rounded-sm px-1.5 py-0.5 ${
            overdue ? "text-status-danger bg-status-danger/10" : "text-tertiary bg-surface3"
          }`}>
            <Clock size={10} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {task.assignees?.length > 0 && (
        <div className="flex justify-end">
          <AssigneeAvatarGroup assignees={task.assignees} />
        </div>
      )}
    </motion.div>
  );
}
