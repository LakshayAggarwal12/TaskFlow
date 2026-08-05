import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, LayoutGrid } from "lucide-react";
import { useProject } from "../features/projects/hooks/useProject";
import { useProjectBoards, useCreateBoard } from "../features/boards/hooks/useProjectBoards";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { useForm } from "react-hook-form";
import { useToast } from "../context/ToastContext";

function CreateBoardModal({ isOpen, onClose, projectId }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const createBoard = useCreateBoard(projectId);
  const toast = useToast();
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const onSubmit = async (data) => {
    try {
      const result = await createBoard.mutateAsync(data);
      reset();
      onClose();
      navigate(`/w/${workspaceId}/p/${projectId}/board/${result.board._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create board.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a board">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Board name"
          placeholder="e.g. Main Board"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={createBoard.isPending}>Create board</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function ProjectHubPage() {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { data: projectData } = useProject(projectId);
  const project = projectData?.project;
  const { data: boards, isLoading } = useProjectBoards(projectId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-h1 font-display text-primary truncate">{project?.name || "Project"}</h1>
          {project?.description && <p className="text-body-sm text-secondary mt-1">{project.description}</p>}
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shrink-0">
          <Plus size={15} /> New board
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      {!isLoading && boards?.length === 0 && (
        <EmptyState
          icon={LayoutGrid}
          title="No boards yet"
          description="Create a board to start organizing tasks into lists."
          action={<Button onClick={() => setIsCreateOpen(true)}><Plus size={15} /> Create board</Button>}
        />
      )}

      {!isLoading && boards?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((b, i) => (
            <motion.button
              key={b._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              onClick={() => navigate(`/w/${workspaceId}/p/${projectId}/board/${b._id}`)}
              className="text-left p-5 rounded-lg bg-surface1 border border-hairline hover:border-strong transition-colors duration-fast"
            >
              <div className="w-9 h-9 rounded-md bg-surface3 flex items-center justify-center mb-3">
                <LayoutGrid size={16} className="text-secondary" />
              </div>
              <h3 className="text-h3 text-primary">{b.name}</h3>
            </motion.button>
          ))}
        </div>
      )}

      <CreateBoardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} projectId={projectId} />
    </div>
  );
}
