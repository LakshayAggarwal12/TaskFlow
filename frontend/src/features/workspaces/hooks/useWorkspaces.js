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

export function useUpdateWorkspace(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => workspacesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", id] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeleteWorkspace() {
  return useMutation({
    mutationFn: (id) => workspacesApi.remove(id),
  });
}

export function useAddWorkspaceMember(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => workspacesApi.addMember(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspaces", id] }),
  });
}

export function useUpdateWorkspaceMemberRole(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }) => workspacesApi.updateMemberRole(id, memberId, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspaces", id] }),
  });
}

export function useRemoveWorkspaceMember(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId) => workspacesApi.removeMember(id, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspaces", id] }),
  });
}
