import { motion, AnimatePresence } from "framer-motion";
import SignalDot from "../../components/ui/SignalDot";

export default function AISuggestionCard({ isLoading, children, onAccept, onDiscard, acceptLabel = "Use this" }) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22 }}
          className="flex items-center gap-2 px-3 py-3 rounded-md bg-surface2 border border-hairline"
        >
          <SignalDot variant="pulse" size={8} />
          <span className="text-body-sm text-secondary">Thinking...</span>
        </motion.div>
      ) : (
        children && (
          <motion.div
            key="result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="rounded-md bg-surface2 border border-accent/30 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 px-3 pt-2.5">
              <SignalDot size={6} />
              <span className="text-caption text-accent">AI suggestion — review before saving</span>
            </div>
            <div className="px-3 py-2.5">{children}</div>
            <div className="flex justify-end gap-2 px-3 pb-2.5">
              <button
                onClick={onDiscard}
                className="text-body-sm text-tertiary hover:text-primary transition-colors duration-fast"
              >
                Discard
              </button>
              <button
                onClick={onAccept}
                className="text-body-sm text-accent hover:text-accent-hover font-medium transition-colors duration-fast"
              >
                {acceptLabel}
              </button>
            </div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
