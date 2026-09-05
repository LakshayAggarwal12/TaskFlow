import { forwardRef } from "react";

const Input = forwardRef(({ label, error, className = "", id, icon: Icon, ...props }, ref) => {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-body-sm text-slate-300 font-medium select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-tertiary pointer-events-none flex items-center justify-center">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`h-10 w-full ${Icon ? "pl-9" : "px-3.5"} pr-3.5 rounded-lg bg-surface2/80 border text-body text-primary
            placeholder:text-tertiary/70
            transition-all duration-fast ease-standard
            focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-surface2
            ${error ? "border-status-danger focus:border-status-danger focus:ring-status-danger/20" : "border-hairline hover:border-hairlineBright"}
            ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-caption text-status-danger font-medium">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";

export default Input;
