import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-accent text-canvas hover:bg-accent-hover",
  secondary: "bg-surface3 text-primary hover:bg-strong border border-hairline",
  ghost: "bg-transparent text-secondary hover:text-primary hover:bg-surface2",
  danger: "bg-status-danger text-primary hover:opacity-90",
};

const SIZES = {
  sm: "h-8 px-3 text-body-sm",
  md: "h-10 px-4 text-body",
  lg: "h-12 px-6 text-h3",
};

const Button = forwardRef(
  (
    { variant = "primary", size = "md", isLoading = false, disabled, children, className = "", ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ duration: 0.1 }}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-body font-medium
          transition-colors duration-fast ease-standard
          disabled:opacity-50 disabled:cursor-not-allowed
          ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export default Button;
