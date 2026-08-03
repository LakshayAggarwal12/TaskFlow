export default function LabelChips({ labels = [], max = 2 }) {
  if (!labels.length) return null;
  const shown = labels.slice(0, max);
  const extra = labels.length - shown.length;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {shown.map((label) => (
        <span key={label} className="px-1.5 h-4 inline-flex items-center rounded-sm bg-surface3 text-[10px] text-secondary">
          {label}
        </span>
      ))}
      {extra > 0 && <span className="text-[10px] text-tertiary">+{extra}</span>}
    </div>
  );
}
