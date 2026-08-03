import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useTask, useUpdateTask, useDeleteTaskDetail } from "./hooks/useTask";
import { useWorkspace } from "../workspaces/hooks/useWorkspaces";
import TaskMetaPanel from "./TaskMetaPanel";
import SubtaskChecklist from "./SubtaskChecklist";
import AIAssistPanel from "../ai/AIAssistPanel";
import CommentThread from "../comments/CommentThread";
import Skeleton from "../../components/ui/Skeleton";
import PriorityDot from "./PriorityDot";
import { useToast } from "../../context/ToastContext";

export default function TaskDrawer() {
  const { workspaceId, projectId, boardId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get("task");
  const isOpen = !!taskId;

  const { data: task, isLoading } = useTask(taskId);
  const { data: workspace } = useWorkspace(workspaceId);
  const updateTask = useUpdateTask(taskId, boardId);
  const deleteTask = useDeleteTaskDetail(taskId, boardId);
  const toast = useToast();

  const [titleDraft, setTitleDraft] = useState("");
  const [descDraft, setDescDraft] = useState("");

  useEffect(() => {
    if (task) {
      setTitleDraft(task.title);
      setDescDraft(task.description || "");
    }
  }, [task?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    setSearchParams((prev) => {
      const next = Object.fromEntries(prev);
      delete next.task;
      return next;
    });
  };

  const handleUpdate = (fields) => {
    updateTask.mutate(fields, {
      onError: (err) => toast.error(err.response?.data?.message || "Update failed."),
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this task? This can't be undone.")) return;
    deleteTask.mutate(undefined, {
      onSuccess: () => {
        toast.success("Task deleted.");
        close();
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.36, ease: [0, 0, 0.2, 1] }}
            className="fixed top-0 right-0 z-50 h-screen w-full max-w-xl bg-surface1 border-l border-hairline shadow-modal overflow-y-auto scrollbar-thin"
          >
            {isLoading || !task ? (
              <div className="p-6 flex flex-col gap-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24" />
                <Skeleton className="h-32" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div className="flex items-center gap-2">
                    <PriorityDot priority={task.priority} />
                    <span className="text-caption text-tertiary">Task</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={handleDelete} aria-label="Delete task" className="text-tertiary hover:text-status-danger transition-colors duration-fast">
                      <Trash2 size={16} />
                    </button>
                    <button onClick={close} aria-label="Close" className="text-tertiary hover:text-primary transition-colors duration-fast">
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="px-6 flex flex-col gap-6 pb-10">
                  <textarea
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={() => titleDraft.trim() && titleDraft !== task.title && handleUpdate({ title: titleDraft.trim() })}
                    rows={1}
                    className="text-h1 font-display text-primary bg-transparent resize-none focus:outline-none border-b border-transparent focus:border-hairline transition-colors duration-fast leading-tight"
                  />

                  <div>
                    <span className="text-caption text-tertiary block mb-1.5">Description</span>
                    <textarea
                      value={descDraft}
                      onChange={(e) => setDescDraft(e.target.value)}
                      onBlur={() => descDraft !== (task.description || "") && handleUpdate({ description: descDraft })}
                      rows={4}
                      placeholder="Add a description..."
                      className="w-full text-body text-primary bg-surface2 border border-hairline rounded-md p-3 resize-none focus:outline-none focus:border-accent placeholder:text-tertiary transition-colors duration-fast"
                    />
                    <div className="mt-2">
                      <AIAssistPanel
                        task={task}
                        projectId={projectId}
                        onApplyDescription={(desc) => {
                          setDescDraft(desc);
                          handleUpdate({ description: desc });
                        }}
                        onApplyLabel={(suggestion) => {
                          handleUpdate({
                            priority: suggestion.priority,
                            labels: [...new Set([...(task.labels || []), suggestion.label])],
                          });
                        }}
                      />
                    </div>
                  </div>

                  <TaskMetaPanel task={task} members={workspace?.members || []} onUpdate={handleUpdate} />

                  <SubtaskChecklist task={task} boardId={boardId} />

                  <div className="border-t border-hairline pt-5">
                    <CommentThread taskId={task._id} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
