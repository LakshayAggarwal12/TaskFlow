import { X } from "lucide-react";

export default function Chip({ children, onRemove, tone = "neutral", className = "" }) {
  const TONES = {
    neutral: "bg-surface3 text-secondary",
    accent: "bg-accent-muted text-accent",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 h-6 rounded-sm text-body-sm ${TONES[tone]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="hover:text-primary transition-colors duration-fast"
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}
