// Accessible on/off toggle (role="switch"). Matches the accent/surface tokens
// used by Checkbox so it sits naturally next to existing form controls.
export default function Switch({ checked, onChange, disabled = false, label, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-fast ease-standard
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
        ${checked ? "bg-accent border-accent" : "bg-surface3 border-strong"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-fast ease-standard
          ${checked ? "translate-x-[18px]" : "translate-x-[3px]"}`}
      />
    </button>
  );
}