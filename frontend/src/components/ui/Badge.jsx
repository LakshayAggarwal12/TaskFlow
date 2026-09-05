const TONES = {
  neutral: "bg-surface3/80 text-secondary border-hairline",
  accent: "bg-accent/15 text-accent border-accent/25",
  low: "bg-priority-low/15 text-priority-low border-priority-low/30",
  medium: "bg-priority-medium/15 text-priority-medium border-priority-medium/30",
  high: "bg-priority-high/15 text-priority-high border-priority-high/30",
  success: "bg-status-success/15 text-status-success border-status-success/30",
  danger: "bg-status-danger/15 text-status-danger border-status-danger/30",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium uppercase tracking-wider border backdrop-blur-xs ${TONES[tone] || TONES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
