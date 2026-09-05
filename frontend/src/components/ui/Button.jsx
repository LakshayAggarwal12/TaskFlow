import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-accent to-accent-hover text-slate-950 font-semibold shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 hover:brightness-105 active:brightness-95",
  secondary:
    "bg-surface2 text-primary hover:bg-surface3 border border-hairline hover:border-hairlineBright shadow-sm",
  ghost:
    "bg-transparent text-secondary hover:text-primary hover:bg-surface2/70 active:bg-surface2",
  danger:
    "bg-status-danger text-white hover:bg-red-500 shadow-md shadow-status-danger/20 active:opacity-90",
  outline:
    "border border-hairline hover:border-accent/40 text-secondary hover:text-accent bg-transparent hover:bg-accent-muted",
};

const SIZES = {
  sm: "h-8 px-3 text-body-sm rounded-md",
  md: "h-9 px-4 text-body-sm rounded-lg",
  lg: "h-11 px-5 text-body font-medium rounded-lg",
  icon: "h-9 w-9 p-0 rounded-lg",
};

const Button = forwardRef(
  (
    { variant = "primary", size = "md", isLoading = false, disabled, children, className = "", ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        whileHover={{ translateY: disabled || isLoading ? 0 : -1 }}
        transition={{ duration: 0.12 }}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 font-body select-none
          transition-all duration-fast ease-standard cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
          ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 size={16} className="animate-spin text-current" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export default Button;
