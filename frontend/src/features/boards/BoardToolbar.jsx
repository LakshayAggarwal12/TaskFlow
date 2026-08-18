import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2, ListTodo } from "lucide-react";
import Dropdown from "../../components/ui/Dropdown";
import Input from "../../components/ui/Input";
import { useBoardData } from "./hooks/useBoardData";
import { boardsApi } from "../../api/boards.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../context/ToastContext";

export default function BoardToolbar({ board }) {
  const { workspaceId, projectId, boardId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(board.name);

  const updateBoard = useMutation({
    mutationFn: (data) => boardsApi.update(boardId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });

  const deleteBoard = useMutation({
    mutationFn: () => boardsApi.remove(boardId),
    onSuccess: () => {
      toast.success("Board deleted.");
      navigate(`/w/${workspaceId}/p/${projectId}`);
    },
  });

  const saveName = () => {
    setIsEditing(false);
    if (name.trim() && name !== board.name) {
      updateBoard.mutate({ name: name.trim() });
    } else {
      setName(board.name);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      {isEditing ? (
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => e.key === "Enter" && saveName()}
          className="h-9 max-w-xs"
        />
      ) : (
        <h1 className="text-h1 font-display text-primary truncate tracking-tight">{board.name}</h1>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/w/${workspaceId}/p/${projectId}/backlog`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-md border border-hairline text-body-sm text-secondary hover:text-primary hover:bg-surface2 transition-colors duration-fast"
        >
          <ListTodo size={14} /> <span className="hidden sm:inline">Backlog</span>
        </Link>
        <Dropdown
          align="right"
          trigger={({ toggle }) => (
            <button onClick={toggle} className="text-tertiary hover:text-primary transition-colors duration-fast p-2">
              <MoreHorizontal size={16} />
            </button>
          )}
          items={[
            { label: "Rename board", icon: Pencil, onClick: () => setIsEditing(true) },
            {
              label: "Delete board",
              icon: Trash2,
              danger: true,
              onClick: () => {
                if (confirm(`Delete "${board.name}" and everything in it?`)) deleteBoard.mutate();
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
