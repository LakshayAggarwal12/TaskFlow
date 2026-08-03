import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(({ label, error, className = "", id, children, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-body-sm text-secondary font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={`h-10 w-full pl-3 pr-9 rounded-md bg-surface2 border text-body text-primary appearance-none
            transition-colors duration-fast ease-standard
            focus:outline-none focus:border-accent
            ${error ? "border-status-danger" : "border-hairline"}
            ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
      </div>
      {error && <span className="text-body-sm text-status-danger">{error}</span>}
    </div>
  );
});
Select.displayName = "Select";

export default Select;
