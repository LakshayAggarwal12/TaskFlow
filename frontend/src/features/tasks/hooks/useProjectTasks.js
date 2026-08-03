import { useQueries } from "@tanstack/react-query";
import { boardsApi } from "../../../api/boards.api";
import { useProjectBoards } from "../../boards/hooks/useProjectBoards";

// There's no single "all tasks in a project" backend endpoint — the closest
// thing is AI search (which is scoped to a project but meant for natural-
// language queries, not a default listing). So for the Backlog's plain,
// unfiltered view, we fetch each board's full data (already an existing,
// real endpoint) in parallel and flatten it client-side. This avoids
// spending an AI call just to list everything.
export function useProjectTasks(projectId) {
  const { data: boards, isLoading: boardsLoading } = useProjectBoards(projectId);

  const boardQueries = useQueries({
    queries: (boards || []).map((board) => ({
      queryKey: ["board", board._id],
      queryFn: () => boardsApi.getOne(board._id),
      enabled: !!boards,
    })),
  });

  const isLoading = boardsLoading || boardQueries.some((q) => q.isLoading);

  const tasks = boardQueries.flatMap((q, i) => {
    if (!q.data) return [];
    const boardName = boards[i].name;
    return q.data.lists.flatMap((list) =>
      list.tasks.map((task) => ({
        ...task,
        listName: list.name,
        isDoneList: list.isDoneList,
        boardName,
        boardId: boards[i]._id,
      }))
    );
  });

  return { tasks, isLoading };
}
