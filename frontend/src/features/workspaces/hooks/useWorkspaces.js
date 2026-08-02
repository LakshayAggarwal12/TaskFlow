import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../../../api/workspaces.api";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: workspacesApi.list,
    select: (data) => data.workspaces,
  });
}

export function useWorkspace(id) {
  return useQuery({
    queryKey: ["workspaces", id],
    queryFn: () => workspacesApi.getOne(id),
    select: (data) => data.workspace,
    enabled: !!id,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspacesApi.create,
    onSuccess: () => {
      // Simplest correct invalidation: refetch the list rather than manually
      // splicing the new workspace in — this list is small and infrequent,
      // so the extra round-trip is worth the guaranteed consistency.
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
