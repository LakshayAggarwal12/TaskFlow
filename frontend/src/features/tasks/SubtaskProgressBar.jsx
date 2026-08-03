export default function SubtaskProgressBar({ subtasks = [] }) {
  if (!subtasks.length) return null;
  const done = subtasks.filter((s) => s.done).length;
  const percent = (done / subtasks.length) * 100;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1 rounded-pill bg-surface3 overflow-hidden">
        <div
          className="h-full rounded-pill bg-accent transition-all duration-base ease-standard"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-tertiary font-mono shrink-0">
        {done}/{subtasks.length}
      </span>
    </div>
  );
}
