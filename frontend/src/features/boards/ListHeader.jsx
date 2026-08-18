import { useState } from "react";
import { MoreHorizontal, CheckCircle2, Trash2, Pencil, GripVertical } from "lucide-react";
import Dropdown from "../../components/ui/Dropdown";
import Input from "../../components/ui/Input";
import { useUpdateList, useDeleteList } from "./hooks/useBoardData";
import { useParams } from "react-router-dom";

export default function ListHeader({ list, taskCount, dragHandleProps }) {
  const { boardId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const updateList = useUpdateList(boardId);
  const deleteList = useDeleteList(boardId);

  const saveName = () => {
    setIsEditing(false);
    if (name.trim() && name !== list.name) {
      updateList.mutate({ id: list._id, data: { name: name.trim() } });
    } else {
      setName(list.name);
    }
  };

  return (
    <div className="flex items-center justify-between px-1 mb-3">
      <div
        {...dragHandleProps}
        className="flex items-center gap-2 min-w-0 cursor-grab active:cursor-grabbing flex-1 group"
      >
        {isEditing ? (
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            onClick={(e) => e.stopPropagation()}
            className="h-7 text-body-sm py-0"
          />
        ) : (
          <h3 className="text-h3 text-primary truncate">{list.name}</h3>
        )}
        {list.isDoneList && <CheckCircle2 size={13} className="text-status-success shrink-0" />}
        <span className="text-caption text-tertiary font-mono shrink-0 bg-surface3 rounded-pill px-1.5 py-0.5">{taskCount}</span>
        <GripVertical size={13} className="text-tertiary opacity-0 group-hover:opacity-60 transition-opacity duration-fast shrink-0 ml-auto" />
      </div>

      <Dropdown
        align="right"
        trigger={({ toggle }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className="text-tertiary hover:text-primary transition-colors duration-fast p-1"
          >
            <MoreHorizontal size={15} />
          </button>
        )}
        items={[
          { label: "Rename", icon: Pencil, onClick: () => setIsEditing(true) },
          {
            label: list.isDoneList ? "Unmark as Done list" : "Mark as Done list",
            icon: CheckCircle2,
            onClick: () => updateList.mutate({ id: list._id, data: { isDoneList: !list.isDoneList } }),
          },
          {
            label: "Delete list",
            icon: Trash2,
            danger: true,
            onClick: () => {
              if (confirm(`Delete "${list.name}" and all its tasks?`)) deleteList.mutate(list._id);
            },
          },
        ]}
      />
    </div>
  );
}
