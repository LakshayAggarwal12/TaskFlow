import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../../../api/tasks.api";

export function useTask(taskId) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksApi.getOne(taskId),
    select: (data) => data.task,
    enabled: !!taskId,
  });
}

// If boardId is known (opened from a Board route) we invalidate that exact
// board's cache. If not (e.g. opened from Backlog, which has no :boardId in
// its URL), we fall back to invalidating every cached board query broadly —
// slightly less efficient, but guarantees no board view is left showing
// stale data after an edit made from Backlog.
function invalidateBoard(queryClient, boardId) {
  if (boardId) {
    queryClient.invalidateQueries({ queryKey: ["board", boardId] });
  } else {
    queryClient.invalidateQueries({ queryKey: ["board"] });
  }
}

export function useUpdateTask(taskId, boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tasksApi.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      invalidateBoard(queryClient, boardId);
    },
  });
}

export function useDeleteTaskDetail(taskId, boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tasksApi.remove(taskId),
    onSuccess: () => invalidateBoard(queryClient, boardId),
  });
}

export function useAddSubtask(taskId, boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tasksApi.addSubtask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      invalidateBoard(queryClient, boardId);
    },
  });
}

export function useToggleSubtask(taskId, boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subtaskId, done }) => tasksApi.toggleSubtask(taskId, subtaskId, { done }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      invalidateBoard(queryClient, boardId);
    },
  });
}
