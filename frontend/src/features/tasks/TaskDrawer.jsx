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
import AttachmentSection from "../attachments/AttachmentSection";
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
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-50 h-screen w-full max-w-2xl bg-surface1/95 backdrop-blur-2xl border-l border-hairlineBright shadow-2xl overflow-y-auto scrollbar-thin"
          >
            {isLoading || !task ? (
              <div className="p-6 flex flex-col gap-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24" />
                <Skeleton className="h-32" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="sticky top-0 z-10 flex items-center justify-between px-7 py-4.5 bg-surface1/90 backdrop-blur-md border-b border-hairline/80">
                  <div className="flex items-center gap-2.5">
                    <PriorityDot priority={task.priority} />
                    <span className="text-caption font-mono uppercase tracking-wider text-slate-400 font-medium">Task Inspector</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDelete}
                      aria-label="Delete task"
                      title="Delete task"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-status-danger hover:bg-status-danger/15 transition-colors duration-fast"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={close}
                      aria-label="Close"
                      title="Close drawer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface2 transition-colors duration-fast"
                    >
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
                    className="text-h1 font-display text-primary bg-transparent resize-none focus:outline-none pb-1 border-b border-transparent focus:border-accent transition-colors duration-fast leading-tight w-full"
                  />

                  <div>
                    <span className="text-caption font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">Description</span>
                    <textarea
                      value={descDraft}
                      onChange={(e) => setDescDraft(e.target.value)}
                      onBlur={() => descDraft !== (task.description || "") && handleUpdate({ description: descDraft })}
                      rows={4}
                      placeholder="Add a description..."
                      className="w-full text-body text-slate-100 bg-surface2/80 border border-hairline rounded-xl p-3.5 resize-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 placeholder:text-slate-500 transition-all duration-fast leading-relaxed"
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

                  <div className="border-t border-hairline" />

                  <SubtaskChecklist task={task} boardId={boardId} />

                  <div className="border-t border-hairline pt-5">
                    <AttachmentSection taskId={task._id} />
                  </div>

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