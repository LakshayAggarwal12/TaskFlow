import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Zap, CheckCircle2 } from "lucide-react";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../lib/dateUtils";

const STATUS_TONE = { planning: "neutral", active: "accent", completed: "success" };

export default function SprintCard({ sprint, index = 0 }) {
  const { workspaceId, projectId } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <Link
        to={`/w/${workspaceId}/p/${projectId}/sprints/${sprint._id}`}
        className="flex items-center justify-between p-4 rounded-lg bg-surface1 border border-hairline hover:border-strong transition-colors duration-fast"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-md bg-surface3 flex items-center justify-center shrink-0">
            {sprint.status === "completed" ? (
              <CheckCircle2 size={16} className="text-status-success" />
            ) : (
              <Zap size={16} className="text-secondary" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-h3 text-primary truncate">{sprint.name}</h3>
            <p className="text-body-sm text-tertiary truncate">
              {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
            </p>
          </div>
        </div>
        <Badge tone={STATUS_TONE[sprint.status]}>{sprint.status}</Badge>
      </Link>
    </motion.div>
  );
}
