const COLORS = { low: "bg-priority-low", medium: "bg-priority-medium", high: "bg-priority-high" };

export default function PriorityDot({ priority, className = "" }) {
  if (!priority) return null;
  return (
    <span
      title={`${priority} priority`}
      className={`inline-block w-1.5 h-1.5 rounded-pill shrink-0 ${COLORS[priority] || "bg-tertiary"} ${className}`}
    />
  );
}
