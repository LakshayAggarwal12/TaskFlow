import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Tooltip({ content, children, side = "top" }) {
  const [show, setShow] = useState(false);

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && content && (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-50 whitespace-nowrap px-2 py-1 rounded-sm bg-surface3 border border-hairline text-caption text-primary pointer-events-none ${sideClasses[side]}`}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
