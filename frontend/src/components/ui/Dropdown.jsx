import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Simple trigger + floating menu. `trigger` is a render-prop receiving
 * `{ open, toggle }`. `items` is an array of { label, icon, onClick, danger }.
 */
export default function Dropdown({ trigger, items, align = "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="relative inline-block">
      {trigger({ open: isOpen, toggle: () => setIsOpen((o) => !o) })}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={close} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className={`absolute z-40 mt-1.5 min-w-[160px] bg-surface2 border border-hairline rounded-md shadow-modal py-1 ${
                align === "right" ? "right-0" : "left-0"
              }`}
            >
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    close();
                    item.onClick();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-body-sm text-left transition-colors duration-fast
                    ${item.danger ? "text-status-danger hover:bg-status-danger/10" : "text-primary hover:bg-surface3"}`}
                >
                  {item.icon && <item.icon size={14} />}
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
