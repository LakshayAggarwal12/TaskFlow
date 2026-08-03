import { motion } from "framer-motion";
import SignalDot from "../../components/ui/SignalDot";

export default function AISummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="rounded-lg bg-surface2 border border-accent/30 p-4"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <SignalDot size={7} />
        <span className="text-caption text-accent">AI Summary</span>
      </div>
      <p className="text-body-sm text-primary leading-relaxed">{summary}</p>
    </motion.div>
  );
}
