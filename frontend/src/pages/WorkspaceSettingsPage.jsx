import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, UserPlus } from "lucide-react";
import {
  useWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
  useAddWorkspaceMember,
  useUpdateWorkspaceMemberRole,
  useRemoveWorkspaceMember,
} from "../features/workspaces/hooks/useWorkspaces";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { useToast } from "../context/ToastContext";

const ROLE_TONE = { owner: "accent", admin: "success", member: "neutral", viewer: "neutral" };

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { data: workspace } = useWorkspace(workspaceId);
  const updateWorkspace = useUpdateWorkspace(workspaceId);
  const deleteWorkspace = useDeleteWorkspace();
  const addMember = useAddWorkspaceMember(workspaceId);
  const updateRole = useUpdateWorkspaceMemberRole(workspaceId);
  const removeMember = useRemoveWorkspaceMember(workspaceId);

  const [name, setName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  if (!workspace) return null;

  const myRole = workspace.members?.find((m) => m.user._id === user?._id)?.role;
  const isAdminOrOwner = myRole === "admin" || myRole === "owner";

  const saveName = () => {
    if (name.trim() && name !== workspace.name) {
      updateWorkspace.mutate({ name: name.trim() });
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await addMember.mutateAsync({ email: inviteEmail.trim(), role: "member" });
      toast.success(`${inviteEmail} added.`);
      setInviteEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add member.");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${workspace.name}" permanently? This cannot be undone.`)) return;
    try {
      await deleteWorkspace.mutateAsync(workspaceId);
      toast.success("Workspace deleted.");
      navigate("/workspaces");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete workspace.");
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-h1 font-display text-primary">Workspace settings</h1>

      <div className="bg-surface1 border border-hairline rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-h3 text-primary">General</h2>
        <Input
          label="Workspace name"
          defaultValue={workspace.name}
          disabled={!isAdminOrOwner}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
        />
      </div>

      <div className="bg-surface1 border border-hairline rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-h3 text-primary mb-1">Members</h2>

        <div className="flex flex-col gap-2.5">
          {workspace.members?.map((m) => (
            <div key={m.user._id} className="flex items-center gap-2.5">
              <Avatar name={m.user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-primary truncate">{m.user.name}</p>
                <p className="text-caption text-tertiary truncate">{m.user.email}</p>
              </div>
              {isAdminOrOwner && m.role !== "owner" ? (
                <Select
                  value={m.role}
                  onChange={(e) => updateRole.mutate({ memberId: m.user._id, role: e.target.value })}
                  className="h-8 text-body-sm w-28"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </Select>
              ) : (
                <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge>
              )}
              {isAdminOrOwner && m.role !== "owner" && (
                <button
                  onClick={() => removeMember.mutate(m.user._id)}
                  aria-label="Remove member"
                  className="text-tertiary hover:text-status-danger transition-colors duration-fast"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdminOrOwner && (
          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-hairline">
            <Input
              placeholder="teammate@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              className="h-9 flex-1"
            />
            <Button size="sm" onClick={handleInvite} isLoading={addMember.isPending}>
              <UserPlus size={14} /> Invite
            </Button>
          </div>
        )}
      </div>

      {myRole === "owner" && (
        <div className="bg-surface1 border border-status-danger/30 rounded-lg p-5 flex items-center justify-between">
          <div>
            <h2 className="text-h3 text-primary">Delete workspace</h2>
            <p className="text-body-sm text-tertiary">Permanently deletes this workspace and everything in it.</p>
          </div>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      )}
    </div>
  );
}
