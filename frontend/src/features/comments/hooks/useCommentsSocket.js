import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../../context/SocketContext";

// Board-room events are filtered down to this specific task client-side —
// comment events are emitted to the whole board room (not a per-task room)
// since that's the room clients are already in, so each handler just
// ignores events for other tasks.
export function useCommentsSocket(taskId) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!taskId) return;

    const patchComments = (updater) => {
      queryClient.setQueryData(["comments", taskId], (old) => {
        if (!old) return old;
        return updater(old);
      });
    };

    const onCommentAdded = ({ comment, taskId: eventTaskId }) => {
      if (eventTaskId !== taskId) return;
      patchComments((old) => {
        if (old.comments.some((c) => c._id === comment._id)) return old; // already have it (own action)
        return { ...old, comments: [...old.comments, comment] };
      });
    };

    const onCommentUpdated = ({ comment, taskId: eventTaskId }) => {
      if (eventTaskId !== taskId) return;
      patchComments((old) => ({
        ...old,
        comments: old.comments.map((c) => (c._id === comment._id ? comment : c)),
      }));
    };

    const onCommentDeleted = ({ commentId, taskId: eventTaskId }) => {
      if (eventTaskId !== taskId) return;
      patchComments((old) => ({ ...old, comments: old.comments.filter((c) => c._id !== commentId) }));
    };

    socket.on("comment:added", onCommentAdded);
    socket.on("comment:updated", onCommentUpdated);
    socket.on("comment:deleted", onCommentDeleted);

    return () => {
      socket.off("comment:added", onCommentAdded);
      socket.off("comment:updated", onCommentUpdated);
      socket.off("comment:deleted", onCommentDeleted);
    };
  }, [taskId, socket, queryClient]);
}