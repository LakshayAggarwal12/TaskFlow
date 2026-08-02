import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Plus, Check } from "lucide-react";
import { useWorkspaces } from "./hooks/useWorkspaces";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

export default function WorkspaceSwitcher() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const current = workspaces.find((w) => w._id === workspaceId);

  if (isLoading) {
    return <div className="h-10 rounded-md bg-surface2 animate-pulse" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 h-10 rounded-md bg-surface2 border border-hairline hover:border-strong transition-colors duration-fast"
      >
        <span className="text-body text-primary truncate font-medium">
          {current?.name || "Select workspace"}
        </span>
        <ChevronsUpDown size={14} className="text-tertiary shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="absolute left-0 right-0 mt-1.5 z-40 bg-surface2 border border-hairline rounded-md shadow-modal overflow-hidden"
            >
              <div className="max-h-64 overflow-y-auto scrollbar-thin py-1">
                {workspaces.map((w) => (
                  <button
                    key={w._id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/w/${w._id}`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-body text-primary hover:bg-surface3 transition-colors duration-fast text-left"
                  >
                    <span className="truncate">{w.name}</span>
                    {w._id === workspaceId && <Check size={14} className="text-accent shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-hairline">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsCreateOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-body-sm text-accent hover:bg-surface3 transition-colors duration-fast"
                >
                  <Plus size={14} />
                  New workspace
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreateWorkspaceModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
