import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useCreateWorkspace } from "./hooks/useWorkspaces";
import { useToast } from "../../context/ToastContext";

export default function CreateWorkspaceModal({ isOpen, onClose }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const createWorkspace = useCreateWorkspace();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await createWorkspace.mutateAsync(data);
      toast.success(`"${result.workspace.name}" created.`);
      reset();
      onClose();
      navigate(`/w/${result.workspace._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create workspace.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Workspace name"
          placeholder="e.g. ACES Media Club"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="Description (optional)"
          placeholder="What's this workspace for?"
          {...register("description")}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createWorkspace.isPending}>
            Create workspace
          </Button>
        </div>
      </form>
    </Modal>
  );
}
