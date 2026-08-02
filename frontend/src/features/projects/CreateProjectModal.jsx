import { useForm } from "react-hook-form";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useCreateProject } from "./hooks/useProjects";
import { useToast } from "../../context/ToastContext";

export default function CreateProjectModal({ isOpen, onClose, workspaceId }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const createProject = useCreateProject(workspaceId);
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const result = await createProject.mutateAsync(data);
      toast.success(`"${result.project.name}" created.`);
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create project.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a project">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Project name"
          placeholder="e.g. Instagram Campaign"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="Description (optional)"
          placeholder="What's this project about?"
          {...register("description")}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createProject.isPending}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
