import { motion } from "framer-motion";
import Avatar from "../../components/ui/Avatar";

export default function WorkloadByMemberChart({ workload = [] }) {
  const max = Math.max(...workload.map((w) => w.taskCount), 1);

  if (workload.length === 0) {
    return <p className="text-body-sm text-tertiary">No assigned tasks yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {workload.map((w) => (
        <div key={w.userId} className="flex items-center gap-3">
          <Avatar name={w.name} size="xs" />
          <span className="text-body-sm text-secondary w-24 shrink-0 truncate">{w.name}</span>
          <div className="flex-1 h-2 rounded-pill bg-surface3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(w.taskCount / max) * 100}%` }}
              transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
              className="h-full rounded-pill bg-priority-low"
            />
          </div>
          <span className="text-body-sm text-tertiary font-mono w-6 text-right shrink-0">{w.taskCount}</span>
        </div>
      ))}
    </div>
  );
}
