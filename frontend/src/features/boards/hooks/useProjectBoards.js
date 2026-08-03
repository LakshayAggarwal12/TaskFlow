import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../../../api/boards.api";

export function useProjectBoards(projectId) {
  return useQuery({
    queryKey: ["boards", projectId],
    queryFn: () => boardsApi.listForProject(projectId),
    select: (data) => data.boards,
    enabled: !!projectId,
  });
}

export function useCreateBoard(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => boardsApi.create(projectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boards", projectId] }),
  });
}
