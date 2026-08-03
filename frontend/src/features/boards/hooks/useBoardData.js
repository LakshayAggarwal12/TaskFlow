import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../../../api/boards.api";
import { listsApi } from "../../../api/lists.api";
import { tasksApi } from "../../../api/tasks.api";
import { computeOrder, nextOrder } from "../../../lib/ordering";

export function useBoardData(boardId) {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardsApi.getOne(boardId),
    enabled: !!boardId,
  });
}

// ---------- Lists ----------

export function useCreateList(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => listsApi.create(boardId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });
}

export function useUpdateList(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => listsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });
}

export function useDeleteList(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => listsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });
}

// Reorders a LIST within the board (dragging a column). Optimistically
// updates the cached order so the column doesn't snap back while the
// PATCH .../reorder request is in flight.
export function useReorderList(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, beforeListId, afterListId }) =>
      listsApi.reorder(id, { beforeListId, afterListId }),
    onMutate: async ({ id, beforeOrder, afterOrder }) => {
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });
      const previous = queryClient.getQueryData(["board", boardId]);
      const newOrder = computeOrder(beforeOrder ?? null, afterOrder ?? null);

      queryClient.setQueryData(["board", boardId], (old) => {
        if (!old) return old;
        const lists = old.lists
          .map((l) => (l._id === id ? { ...l, order: newOrder } : l))
          .sort((a, b) => a.order - b.order);
        return { ...old, lists };
      });

      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) queryClient.setQueryData(["board", boardId], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });
}

// ---------- Tasks ----------

export function useCreateTask(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, data }) => tasksApi.create(listId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });
}

export function useDeleteTask(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tasksApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });
}

// THE drag-and-drop mutation — moves a task to a (possibly different) list
// and position. Optimistically patches the cached board so the card lands
// in its new spot instantly; on failure it rolls back to the pre-drag state.
export function useMoveTask(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, targetListId, beforeTaskId, afterTaskId }) =>
      tasksApi.move(taskId, { targetListId, beforeTaskId, afterTaskId }),
    onMutate: async ({ taskId, targetListId, beforeOrder, afterOrder }) => {
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });
      const previous = queryClient.getQueryData(["board", boardId]);
      const newOrder = computeOrder(beforeOrder ?? null, afterOrder ?? null);

      queryClient.setQueryData(["board", boardId], (old) => {
        if (!old) return old;
        let movedTask = null;

        const listsWithoutTask = old.lists.map((list) => {
          const found = list.tasks.find((t) => t._id === taskId);
          if (found) movedTask = found;
          return { ...list, tasks: list.tasks.filter((t) => t._id !== taskId) };
        });

        if (!movedTask) return old;
        const updatedTask = { ...movedTask, list: targetListId, order: newOrder };

        const lists = listsWithoutTask.map((list) => {
          if (list._id !== targetListId) return list;
          const tasks = [...list.tasks, updatedTask].sort((a, b) => a.order - b.order);
          return { ...list, tasks };
        });

        return { ...old, lists };
      });

      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) queryClient.setQueryData(["board", boardId], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });
}

export function useAddSubtask(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tasksApi.addSubtask(taskId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useToggleSubtask(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subtaskId, done }) => tasksApi.toggleSubtask(taskId, subtaskId, { done }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export { nextOrder };
