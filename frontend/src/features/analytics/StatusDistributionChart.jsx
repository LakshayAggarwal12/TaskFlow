import { motion } from "framer-motion";

export default function StatusDistributionChart({ distribution = [] }) {
  const max = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-3">
      {distribution.map((d) => (
        <div key={d.listId} className="flex items-center gap-3">
          <span className="text-body-sm text-secondary w-28 shrink-0 truncate">{d.listName}</span>
          <div className="flex-1 h-2 rounded-pill bg-surface3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
              className={`h-full rounded-pill ${d.isDoneList ? "bg-status-success" : "bg-accent"}`}
            />
          </div>
          <span className="text-body-sm text-tertiary font-mono w-6 text-right shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
