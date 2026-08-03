import { forwardRef } from "react";

const Textarea = forwardRef(({ label, error, className = "", id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-body-sm text-secondary font-medium">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={4}
        className={`px-3 py-2 rounded-md bg-surface2 border text-body text-primary resize-none
          placeholder:text-tertiary transition-colors duration-fast ease-standard
          focus:outline-none focus:border-accent
          ${error ? "border-status-danger" : "border-hairline"}
          ${className}`}
        {...props}
      />
      {error && <span className="text-body-sm text-status-danger">{error}</span>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export default Textarea;
