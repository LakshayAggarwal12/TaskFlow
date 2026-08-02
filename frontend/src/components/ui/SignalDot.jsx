import { motion } from "framer-motion";

/**
 * The one recurring visual motif across the app (see design doc Section 0).
 * Same shape, three meanings depending on `variant`:
 *  - "static": a plain solid dot (unread notification, active nav item)
 *  - "pulse": a breathing glow (AI is "thinking" / loading)
 *  - "ring": a dot with a soft halo ring (active/live state, e.g. active sprint)
 */
export default function SignalDot({ variant = "static", size = 8, className = "" }) {
  if (variant === "pulse") {
    return (
      <motion.span
        className={`inline-block rounded-pill bg-accent ${className}`}
        style={{ width: size, height: size }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  if (variant === "ring") {
    return (
      <span className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
        <span className="absolute inset-0 rounded-pill bg-accent opacity-30 animate-ping" />
        <span className="relative inline-block rounded-pill bg-accent" style={{ width: size, height: size }} />
      </span>
    );
  }

  return (
    <span
      className={`inline-block rounded-pill bg-accent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
