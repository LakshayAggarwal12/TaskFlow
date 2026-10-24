import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../../context/SocketContext";

// Removes a task by id from every list, then inserts it into targetListId
// (or nowhere, if targetListId is null — used for deletes), re-sorting that
// list by order. Shared by task:created / task:updated / task:moved since
// all three boil down to "this task now belongs here, at this order".
const placeTaskInLists = (lists, task, targetListId) => {
  const withoutTask = lists.map((list) => ({
    ...list,
    tasks: list.tasks.filter((t) => t._id !== task._id),
  }));

  if (!targetListId) return withoutTask;

  return withoutTask.map((list) => {
    if (list._id !== targetListId) return list;
    const tasks = [...list.tasks, task].sort((a, b) => a.order - b.order);
    return { ...list, tasks };
  });
};

// Joins the board's socket room for as long as this hook is mounted (i.e.
// for as long as BoardPage is open), and patches the board's React Query
// cache directly on every incoming event — the same cache shape the
// optimistic updates in useBoardData.js already use, so this is consistent
// with what a user's own drag-and-drop already does to the cache.
export function useBoardSocket(boardId) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) return;

    socket.emit("board:join", boardId);

    const patchBoard = (updater) => {
      queryClient.setQueryData(["board", boardId], (old) => {
        if (!old) return old;
        return updater(old);
      });
    };

    const onTaskCreated = ({ task, listId }) =>
      patchBoard((old) => ({ ...old, lists: placeTaskInLists(old.lists, task, listId) }));

    const onTaskUpdated = ({ task }) =>
      patchBoard((old) => ({
        ...old,
        lists: old.lists.map((list) => ({
          ...list,
          tasks: list.tasks.map((t) => (t._id === task._id ? { ...t, ...task } : t)),
        })),
      }));

    const onTaskMoved = ({ task, targetListId }) =>
      patchBoard((old) => ({ ...old, lists: placeTaskInLists(old.lists, task, targetListId) }));

    const onTaskDeleted = ({ taskId }) =>
      patchBoard((old) => ({ ...old, lists: placeTaskInLists(old.lists, { _id: taskId }, null) }));

    const onListCreated = ({ list }) =>
      patchBoard((old) => ({
        ...old,
        lists: [...old.lists, { ...list, tasks: [] }].sort((a, b) => a.order - b.order),
      }));

    const onListUpdated = ({ list }) =>
      patchBoard((old) => ({
        ...old,
        lists: old.lists.map((l) => (l._id === list._id ? { ...l, ...list } : l)),
      }));

    const onListReordered = ({ list }) =>
      patchBoard((old) => ({
        ...old,
        lists: old.lists
          .map((l) => (l._id === list._id ? { ...l, order: list.order } : l))
          .sort((a, b) => a.order - b.order),
      }));

    const onListDeleted = ({ listId }) =>
      patchBoard((old) => ({ ...old, lists: old.lists.filter((l) => l._id !== listId) }));

    // Submissions aren't part of the board cache (they live under their own
    // ["submissions", taskId] query, only fetched while a task drawer is
    // open) — invalidating is enough; React Query only refetches if that
    // query is actually mounted right now.
    const onSubmissionEvent = ({ taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", taskId] });
    };

    socket.on("task:created", onTaskCreated);
    socket.on("task:updated", onTaskUpdated);
    socket.on("task:moved", onTaskMoved);
    socket.on("task:deleted", onTaskDeleted);
    socket.on("list:created", onListCreated);
    socket.on("list:updated", onListUpdated);
    socket.on("list:reordered", onListReordered);
    socket.on("list:deleted", onListDeleted);
    socket.on("submission:created", onSubmissionEvent);
    socket.on("submission:reviewed", onSubmissionEvent);

    return () => {
      socket.emit("board:leave", boardId);
      socket.off("task:created", onTaskCreated);
      socket.off("task:updated", onTaskUpdated);
      socket.off("task:moved", onTaskMoved);
      socket.off("task:deleted", onTaskDeleted);
      socket.off("list:created", onListCreated);
      socket.off("list:updated", onListUpdated);
      socket.off("list:reordered", onListReordered);
      socket.off("list:deleted", onListDeleted);
      socket.off("submission:created", onSubmissionEvent);
      socket.off("submission:reviewed", onSubmissionEvent);
    };
  }, [boardId, socket, queryClient]);
}