import { motion } from "framer-motion";
import { FolderKanban, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, workspaceId, index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.03, ease: [0, 0, 0.2, 1] }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/w/${workspaceId}/p/${project._id}`)}
      className="text-left p-4 rounded-lg bg-surface1 border border-hairline hover:border-strong transition-colors duration-fast group w-full"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-8 h-8 rounded-md bg-surface3 flex items-center justify-center">
          <FolderKanban size={14} className="text-secondary" />
        </div>
        <ArrowRight size={14} className="text-tertiary group-hover:text-accent transition-colors duration-fast" />
      </div>
      <h3 className="text-h3 text-primary truncate">{project.name}</h3>
      {project.description && (
        <p className="text-body-sm text-tertiary truncate mt-0.5">{project.description}</p>
      )}
    </motion.button>
  );
}
