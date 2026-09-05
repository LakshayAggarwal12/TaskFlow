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
      : "border-l-transparent";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSearchParams((prev) => ({ ...Object.fromEntries(prev), task: task._id }))}
      animate={isDragging ? { scale: 1.02, boxShadow: "0 14px 28px rgba(0,0,0,0.6)" } : { scale: 1, boxShadow: "none" }}
      transition={{ duration: 0.16 }}
      className={`group bg-surface2/90 border-l-[3px] ${priorityBorder} border border-hairline/80 rounded-xl p-3.5 cursor-pointer
        hover:border-hairlineBright hover:bg-surface2 hover:shadow-card hover:-translate-y-0.5
        transition-all duration-fast ease-standard flex flex-col gap-2.5 relative
        ${isDragging ? "opacity-95 z-20 ring-2 ring-accent shadow-2xl" : ""}`}
    >
      <div className="flex items-start gap-2">
        <PriorityDot priority={task.priority} className="mt-1" />
        <p className="text-body-sm font-medium text-slate-200 group-hover:text-white leading-snug flex-1">
          {task.title}
        </p>
      </div>

      {task.subtasks?.length > 0 && <SubtaskProgressBar subtasks={task.subtasks} />}

      <div className="flex items-center justify-between gap-2 mt-0.5">
        <LabelChips labels={task.labels} />
        {task.dueDate && (
          <span className={`flex items-center gap-1.5 text-[11px] font-mono shrink-0 rounded-md px-2 py-0.5 font-medium ${
            overdue ? "text-status-danger bg-status-danger/15 border border-status-danger/25" : "text-slate-400 bg-surface3/80 border border-hairline"
          }`}>
            <Clock size={11} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {task.assignees?.length > 0 && (
        <div className="flex justify-end pt-1 border-t border-hairline/40">
          <AssigneeAvatarGroup assignees={task.assignees} />
        </div>
      )}
    </motion.div>
  );
}
