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
    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-hairline">
      {isEditing ? (
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => e.key === "Enter" && saveName()}
          className="h-10 max-w-sm font-display text-xl font-bold"
        />
      ) : (
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2.5">
            {board.name}
          </h1>
          <button
            onClick={() => setIsEditing(true)}
            title="Rename board"
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-surface2 transition-colors"
          >
            <Pencil size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          to={`/w/${workspaceId}/p/${projectId}/backlog`}
          className="flex items-center gap-2 px-3.5 h-9 rounded-lg border border-hairline/80 bg-surface2/60 hover:bg-surface2 text-body-sm font-medium text-slate-300 hover:text-white transition-all shadow-xs"
        >
          <ListTodo size={15} className="text-accent" /> <span className="hidden sm:inline">Backlog</span>
        </Link>
        <Dropdown
          align="right"
          trigger={({ toggle }) => (
            <button
              onClick={toggle}
              aria-label="More options"
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-hairline/80 bg-surface2/60 text-slate-400 hover:text-white hover:bg-surface2 transition-colors"
            >
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
