import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-md bg-surface2 border border-hairline flex items-center justify-center mb-4">
          <Icon size={22} className="text-tertiary" />
        </div>
      )}
      <h3 className="text-h3 text-primary mb-1">{title}</h3>
      {description && <p className="text-body-sm text-secondary max-w-sm mb-5">{description}</p>}
      {action}
    </motion.div>
  );
}
