import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import Dropdown from "../../components/ui/Dropdown";
import { useAuth } from "../../context/AuthContext";
import { useComments, useAddComment, useUpdateComment, useDeleteComment } from "./hooks/useComments";
import { timeAgo } from "../../lib/dateUtils";
import Skeleton from "../../components/ui/Skeleton";

function CommentInput({ onSubmit, isSubmitting }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
        placeholder="Write a comment... (⌘+Enter to send)"
        rows={2}
        className="flex-1 px-3 py-2 rounded-md bg-surface2 border border-hairline text-body-sm text-primary placeholder:text-tertiary resize-none focus:outline-none focus:border-accent transition-colors duration-fast"
      />
      <button
        onClick={submit}
        disabled={isSubmitting || !text.trim()}
        className="self-end px-3 h-8 rounded-md bg-accent text-canvas text-body-sm font-medium hover:bg-accent-hover transition-colors duration-fast disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}

export default function CommentThread({ taskId }) {
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(taskId);
  const addComment = useAddComment(taskId);
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-h3 text-primary">Comments</h3>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      )}

      <AnimatePresence initial={false}>
        {comments?.map((c) => {
          const isAuthor = c.author._id === user?._id;
          const isEditing = editingId === c._id;

          return (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex gap-2.5"
            >
              <Avatar name={c.author.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-primary font-medium">{c.author.name}</span>
                  <span className="text-caption text-tertiary font-mono">
                    {timeAgo(c.createdAt)}
                    {c.edited && " · edited"}
                  </span>
                  {isAuthor && (
                    <Dropdown
                      align="right"
                      trigger={({ toggle }) => (
                        <button
                          onClick={toggle}
                          className="ml-auto text-tertiary hover:text-primary transition-colors duration-fast"
                        >
                          <MoreHorizontal size={13} />
                        </button>
                      )}
                      items={[
                        {
                          label: "Edit",
                          icon: Pencil,
                          onClick: () => {
                            setEditingId(c._id);
                            setEditText(c.text);
                          },
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          danger: true,
                          onClick: () => deleteComment.mutate(c._id),
                        },
                      ]}
                    />
                  )}
                </div>

                {isEditing ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && updateComment.mutate({ id: c._id, data: { text: editText } }, { onSuccess: () => setEditingId(null) })}
                      className="flex-1 px-2 h-8 rounded-md bg-surface2 border border-hairline text-body-sm text-primary focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-body-sm text-tertiary hover:text-primary transition-colors duration-fast"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-body-sm text-secondary mt-0.5 whitespace-pre-wrap">{c.text}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <CommentInput onSubmit={(text) => addComment.mutate({ text })} isSubmitting={addComment.isPending} />
    </div>
  );
}
