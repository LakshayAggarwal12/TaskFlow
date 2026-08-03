import { useParams } from "react-router-dom";
import { useBoardData } from "../features/boards/hooks/useBoardData";
import BoardToolbar from "../features/boards/BoardToolbar";
import KanbanBoard from "../features/boards/KanbanBoard";
import TaskDrawer from "../features/tasks/TaskDrawer";
import Skeleton from "../components/ui/Skeleton";

export default function BoardPage() {
  const { boardId } = useParams();
  const { data, isLoading, isError } = useBoardData(boardId);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-9 w-64 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="h-96 w-72 shrink-0" />
          <Skeleton className="h-96 w-72 shrink-0" />
          <Skeleton className="h-96 w-72 shrink-0" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-body text-secondary">Couldn't load this board.</p>;
  }

  return (
    <div>
      <BoardToolbar board={data.board} />
      <KanbanBoard board={data.board} lists={data.lists} />
      <TaskDrawer />
    </div>
  );
}
