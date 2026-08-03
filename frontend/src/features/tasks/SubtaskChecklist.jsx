import { useState } from "react";
import { Plus } from "lucide-react";
import Checkbox from "../../components/ui/Checkbox";
import { useAddSubtask, useToggleSubtask } from "./hooks/useTask";

export default function SubtaskChecklist({ task, boardId }) {
  const [text, setText] = useState("");
  const addSubtask = useAddSubtask(task._id, boardId);
  const toggleSubtask = useToggleSubtask(task._id, boardId);

  const done = task.subtasks.filter((s) => s.done).length;

  const submit = () => {
    if (!text.trim()) return;
    addSubtask.mutate({ text: text.trim() });
    setText("");
  };

  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-h3 text-primary">
        Subtasks {task.subtasks.length > 0 && <span className="text-tertiary font-mono text-body-sm">({done}/{task.subtasks.length})</span>}
      </h3>
      <div className="flex flex-col gap-2">
        {task.subtasks.map((s) => (
          <Checkbox
            key={s._id}
            checked={s.done}
            onChange={(done) => toggleSubtask.mutate({ subtaskId: s._id, done })}
            label={s.text}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add subtask"
          className="flex-1 h-8 px-2.5 rounded-md bg-surface2 border border-hairline text-body-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent transition-colors duration-fast"
        />
        <button onClick={submit} className="text-tertiary hover:text-accent transition-colors duration-fast">
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
