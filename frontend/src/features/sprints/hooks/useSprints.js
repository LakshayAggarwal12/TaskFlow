import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sprintsApi } from "../../../api/sprints.api";

export function useSprints(projectId) {
  return useQuery({
    queryKey: ["sprints", projectId],
    queryFn: () => sprintsApi.listForProject(projectId),
    select: (data) => data.sprints,
    enabled: !!projectId,
  });
}

export function useCreateSprint(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => sprintsApi.create(projectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sprints", projectId] }),
  });
}

export function useSprint(id) {
  return useQuery({
    queryKey: ["sprint", id],
    queryFn: () => sprintsApi.getOne(id),
    enabled: !!id,
  });
}

export function useAddTaskToSprint(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => sprintsApi.addTask(id, { taskId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sprint", id] }),
  });
}

export function useRemoveTaskFromSprint(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => sprintsApi.removeTask(id, taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sprint", id] }),
  });
}

export function useCloseSprint(id, projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sprintsApi.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprint", id] });
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
    },
  });
}
