import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useCreateTask } from "./hooks/useBoardData";

export default function QuickAddTask({ listId, boardId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const createTask = useCreateTask(boardId);

  const submit = async () => {
    if (!title.trim()) {
      setIsOpen(false);
      return;
    }
    await createTask.mutateAsync({ listId, data: { title: title.trim() } });
    setTitle("");
    // Keep the input open for rapid successive entry, matching how Trello/Linear behave
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-1.5 px-2 py-2 rounded-md text-body-sm text-tertiary hover:text-secondary hover:bg-surface2 transition-colors duration-fast"
      >
        <Plus size={14} />
        Add task
      </button>
    );
  }

  return (
    <div className="bg-surface2 border border-strong rounded-md p-2">
      <textarea
        autoFocus
        rows={2}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape") setIsOpen(false);
        }}
        placeholder="Task title..."
        className="w-full bg-transparent text-body-sm text-primary placeholder:text-tertiary resize-none focus:outline-none"
      />
      <div className="flex items-center gap-2 mt-1.5">
        <button
          onClick={submit}
          disabled={createTask.isPending}
          className="px-2.5 h-7 rounded-sm bg-accent text-canvas text-body-sm font-medium hover:bg-accent-hover transition-colors duration-fast disabled:opacity-50"
        >
          Add
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            setTitle("");
          }}
          aria-label="Cancel"
          className="text-tertiary hover:text-primary transition-colors duration-fast"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
