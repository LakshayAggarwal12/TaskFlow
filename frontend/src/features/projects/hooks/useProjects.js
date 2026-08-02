import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../../../api/projects.api";

export function useProjects(workspaceId) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => projectsApi.listForWorkspace(workspaceId),
    select: (data) => data.projects,
    enabled: !!workspaceId,
  });
}

export function useCreateProject(workspaceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectsApi.create(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
