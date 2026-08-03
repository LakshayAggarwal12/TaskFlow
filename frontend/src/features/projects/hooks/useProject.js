import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../../../api/projects.api";

export function useProject(id) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.getOne(id),
    select: (data) => ({ project: data.project, yourRole: data.yourRole }),
    enabled: !!id,
  });
}

export function useUpdateProject(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project", id] }),
  });
}

export function useArchiveProject(id) {
  return useMutation({
    mutationFn: () => projectsApi.remove(id),
  });
}

export function useSetProjectOverride(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectsApi.setOverride(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project", id] }),
  });
}

export function useRemoveProjectOverride(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId) => projectsApi.removeOverride(id, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project", id] }),
  });
}
