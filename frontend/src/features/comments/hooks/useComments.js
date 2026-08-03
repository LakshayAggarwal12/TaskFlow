import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../../../api/comments.api";

export function useComments(taskId) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => commentsApi.listForTask(taskId),
    select: (data) => data.comments,
    enabled: !!taskId,
  });
}

export function useAddComment(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => commentsApi.create(taskId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", taskId] }),
  });
}

export function useUpdateComment(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => commentsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", taskId] }),
  });
}

export function useDeleteComment(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => commentsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", taskId] }),
  });
}
