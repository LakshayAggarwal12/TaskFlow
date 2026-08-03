import { useForm } from "react-hook-form";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { useCreateSprint } from "./hooks/useSprints";
import { useToast } from "../../context/ToastContext";

export default function CreateSprintModal({ isOpen, onClose, projectId }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const createSprint = useCreateSprint(projectId);
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      await createSprint.mutateAsync(data);
      toast.success("Sprint created.");
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create sprint.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a sprint">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Sprint name" placeholder="e.g. Sprint 1" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        <Textarea label="Goal (optional)" placeholder="What should this sprint accomplish?" rows={2} {...register("goal")} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Start date" type="date" error={errors.startDate?.message} {...register("startDate", { required: "Required" })} />
          <Input label="End date" type="date" error={errors.endDate?.message} {...register("endDate", { required: "Required" })} />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={createSprint.isPending}>Create sprint</Button>
        </div>
      </form>
    </Modal>
  );
}
