import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useProject, useUpdateProject, useArchiveProject, useSetProjectOverride, useRemoveProjectOverride } from "../features/projects/hooks/useProject";
import { useWorkspace } from "../features/workspaces/hooks/useWorkspaces";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import { useToast } from "../context/ToastContext";

export default function ProjectSettingsPage() {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: projectData } = useProject(projectId);
  const { data: workspace } = useWorkspace(workspaceId);
  const updateProject = useUpdateProject(projectId);
  const archiveProject = useArchiveProject(projectId);
  const setOverride = useSetProjectOverride(projectId);
  const removeOverride = useRemoveProjectOverride(projectId);

  const [name, setName] = useState("");
  const [overrideEmail, setOverrideEmail] = useState("");
  const [overrideRole, setOverrideRole] = useState("admin");

  const project = projectData?.project;

  if (!project) return null;

  const saveName = () => {
    if (name.trim() && name !== project.name) {
      updateProject.mutate({ name: name.trim() });
    }
  };

  const handleArchive = async () => {
    if (!confirm(`Archive "${project.name}"? It will be hidden from the project list.`)) return;
    try {
      await archiveProject.mutateAsync();
      toast.success("Project archived.");
      navigate(`/w/${workspaceId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not archive project.");
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-h1 font-display text-primary">Project settings</h1>

      <div className="bg-surface1 border border-hairline rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-h3 text-primary">General</h2>
        <Input
          label="Project name"
          defaultValue={project.name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
        />
      </div>

      <div className="bg-surface1 border border-hairline rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-h3 text-primary mb-1">Member role overrides</h2>
        <p className="text-body-sm text-tertiary -mt-2 mb-2">
          Override a workspace member's role for this project only — they must already be a workspace member.
        </p>

        {project.memberOverrides?.length > 0 && (
          <div className="flex flex-col gap-2 mb-2">
            {project.memberOverrides.map((o) => (
              <div key={o.user._id} className="flex items-center gap-2.5">
                <Avatar name={o.user.name} size="xs" />
                <span className="text-body-sm text-primary flex-1">{o.user.name}</span>
                <Badge tone="accent">{o.role}</Badge>
                <button
                  onClick={() => removeOverride.mutate(o.user._id)}
                  className="text-tertiary hover:text-status-danger transition-colors duration-fast"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Select value={overrideEmail} onChange={(e) => setOverrideEmail(e.target.value)} className="h-9 text-body-sm flex-1">
            <option value="">Select member...</option>
            {workspace?.members?.map((m) => (
              <option key={m.user._id} value={m.user.email}>{m.user.name}</option>
            ))}
          </Select>
          <Select value={overrideRole} onChange={(e) => setOverrideRole(e.target.value)} className="h-9 text-body-sm w-32">
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </Select>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => overrideEmail && setOverride.mutate({ email: overrideEmail, role: overrideRole })}
          >
            Set
          </Button>
        </div>
      </div>

      <div className="bg-surface1 border border-status-danger/30 rounded-lg p-5 flex items-center justify-between">
        <div>
          <h2 className="text-h3 text-primary">Archive project</h2>
          <p className="text-body-sm text-tertiary">Hides this project without deleting its data.</p>
        </div>
        <Button variant="danger" onClick={handleArchive}>Archive</Button>
      </div>
    </div>
  );
}
