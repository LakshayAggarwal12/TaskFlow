import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Checkbox({ checked, onChange, label, className = "" }) {
  return (
    <label className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0
          transition-colors duration-fast ease-standard
          ${checked ? "bg-accent border-accent" : "border-strong bg-surface2"}`}
      >
        {checked && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.1 }}>
            <Check size={11} strokeWidth={3} className="text-canvas" />
          </motion.div>
        )}
      </button>
      {label && (
        <span className={`text-body-sm ${checked ? "text-tertiary line-through" : "text-primary"}`}>
          {label}
        </span>
      )}
    </label>
  );
}
