import { useState } from "react";
import { Plus, X, Calendar } from "lucide-react";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Chip from "../../components/ui/Chip";
import Avatar from "../../components/ui/Avatar";
import Tooltip from "../../components/ui/Tooltip";
import { toDateInputValue } from "../../lib/dateUtils";

export default function TaskMetaPanel({ task, members = [], onUpdate }) {
  const [labelInput, setLabelInput] = useState("");

  const toggleAssignee = (userId) => {
    const current = task.assignees.map((a) => a._id);
    const next = current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId];
    onUpdate({ assignees: next });
  };

  const addLabel = () => {
    if (!labelInput.trim()) return;
    onUpdate({ labels: [...(task.labels || []), labelInput.trim()] });
    setLabelInput("");
  };

  const removeLabel = (label) => {
    onUpdate({ labels: task.labels.filter((l) => l !== label) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-caption text-tertiary block mb-2">Priority</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              task.priority === "high"
                ? "bg-priority-high"
                : task.priority === "medium"
                ? "bg-priority-medium"
                : "bg-priority-low"
            }`} />
            <Select value={task.priority} onChange={(e) => onUpdate({ priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
        </div>
        <div>
          <span className="text-caption text-tertiary block mb-2">Due date</span>
          <div className="relative">
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
            <input
              type="date"
              value={toDateInputValue(task.dueDate)}
              onChange={(e) => onUpdate({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="h-10 w-full pl-8 pr-3 rounded-md bg-surface2 border border-hairline text-body text-primary focus:outline-none focus:border-accent transition-colors duration-fast"
            />
          </div>
        </div>
      </div>

      <div>
        <span className="text-caption text-tertiary block mb-2">Assignees</span>
        {task.assignees?.length === 0 && (
          <p className="text-body-sm text-tertiary italic mb-1">No assignees</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {members.map((m) => {
            const isAssigned = task.assignees.some((a) => a._id === m.user._id);
            return (
              <Tooltip key={m.user._id} content={m.user.name}>
                <button
                  onClick={() => toggleAssignee(m.user._id)}
                  className={`rounded-pill transition-all duration-fast ${isAssigned ? "ring-2 ring-accent" : "opacity-50 hover:opacity-100"}`}
                >
                  <Avatar name={m.user.name} size="sm" />
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div>
        <span className="text-caption text-tertiary block mb-2">Labels</span>
        <div className="flex flex-wrap gap-1.5 items-center">
          {task.labels?.map((label) => (
            <Chip key={label} onRemove={() => removeLabel(label)}>
              {label}
            </Chip>
          ))}
          <div className="flex items-center gap-1">
            <input
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLabel()}
              placeholder="Add label"
              className="w-24 h-6 px-1.5 bg-transparent border-b border-hairline text-body-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent"
            />
            <button onClick={addLabel} className="text-tertiary hover:text-accent transition-colors duration-fast">
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-caption text-tertiary block mb-1.5">Estimate (hrs)</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={task.estimatedHours || 0}
            onChange={(e) => onUpdate({ estimatedHours: parseFloat(e.target.value) || 0 })}
            className="h-9 w-full px-3 rounded-md bg-surface2 border border-hairline text-body-sm text-primary focus:outline-none focus:border-accent transition-colors duration-fast"
          />
        </div>
        <div>
          <span className="text-caption text-tertiary block mb-1.5">Logged (hrs)</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={task.loggedHours || 0}
            onChange={(e) => onUpdate({ loggedHours: parseFloat(e.target.value) || 0 })}
            className="h-9 w-full px-3 rounded-md bg-surface2 border border-hairline text-body-sm text-primary focus:outline-none focus:border-accent transition-colors duration-fast"
          />
        </div>
      </div>
    </div>
  );
}
