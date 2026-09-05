import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ListHeader from "./ListHeader";
import QuickAddTask from "./QuickAddTask";
import TaskCard from "../tasks/TaskCard";

export default function KanbanList({ list, boardId }) {
  // The whole column is the sortable node (so it animates as one piece),
  // but drag listeners are only spread onto ListHeader — meaning you drag
  // a column by its header, not by clicking anywhere in its body.
  const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } = useSortable({
    id: `list-${list._id}`,
    data: { type: "list", list },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `list-container-${list._id}`,
    data: { type: "list-container", listId: list._id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={`w-80 shrink-0 flex flex-col bg-surface1/80 backdrop-blur-md border border-hairline/80 rounded-xl p-2.5 shadow-sm transition-all duration-fast ${
        isDragging ? "opacity-50 scale-95 border-accent/40 shadow-2xl" : ""
      }`}
    >
      <ListHeader list={list} taskCount={list.tasks.length} dragHandleProps={{ ...attributes, ...listeners }} />
      <div
        ref={setDroppableRef}
        className={`flex-1 flex flex-col gap-2.5 p-1 rounded-lg min-h-[100px] transition-all duration-fast
          ${isOver ? "bg-accent/10 ring-2 ring-accent/30 rounded-lg shadow-inner" : ""}`}
      >
        <SortableContext items={list.tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {list.tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
        <QuickAddTask listId={list._id} boardId={boardId} />
      </div>
    </div>
  );
}
