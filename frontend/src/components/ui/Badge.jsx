const TONES = {
  neutral: "bg-surface3 text-secondary",
  accent: "bg-accent-muted text-accent",
  low: "bg-priority-low/15 text-priority-low",
  medium: "bg-priority-medium/15 text-priority-medium",
  high: "bg-priority-high/15 text-priority-high",
  success: "bg-status-success/15 text-status-success",
  danger: "bg-status-danger/15 text-status-danger",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-caption font-medium uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
