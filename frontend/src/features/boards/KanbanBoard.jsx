import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import KanbanList from "./KanbanList";
import { useCreateList, useReorderList, useMoveTask } from "./hooks/useBoardData";
import { useDragStore } from "../../store/boardStore";

function NewListInline({ boardId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const createList = useCreateList(boardId);

  const submit = async () => {
    if (name.trim()) {
      await createList.mutateAsync({ name: name.trim() });
      setName("");
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-72 shrink-0 h-10 flex items-center gap-2 px-3 rounded-md border border-dashed border-hairline text-tertiary hover:text-secondary hover:border-strong transition-colors duration-fast"
      >
        <Plus size={15} /> Add list
      </button>
    );
  }

  return (
    <div className="w-72 shrink-0 bg-surface2 border border-strong rounded-md p-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        onBlur={submit}
        placeholder="List name..."
        className="w-full bg-transparent text-body-sm text-primary placeholder:text-tertiary focus:outline-none"
      />
    </div>
  );
}

export default function KanbanBoard({ board, lists }) {
  const reorderList = useReorderList(board._id);
  const moveTask = useMoveTask(board._id);
  const setActiveDrag = useDragStore((s) => s.setActiveDrag);
  const clearActiveDrag = useDragStore((s) => s.clearActiveDrag);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const sortedLists = [...lists].sort((a, b) => a.order - b.order);

  const handleDragStart = (event) => {
    const data = event.active.data.current;
    if (data?.type === "task") setActiveDrag(data.task._id, data.task.list);
  };

  const handleDragEnd = (event) => {
    clearActiveDrag();
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData) return;

    // ---- Reordering a LIST (column) ----
    if (activeData.type === "list" && overData?.type === "list") {
      const activeList = activeData.list;
      const overList = overData.list;
      if (activeList._id === overList._id) return;

      const overIndex = sortedLists.findIndex((l) => l._id === overList._id);
      const beforeList = overIndex > 0 ? sortedLists[overIndex - 1] : null;
      const beforeOrder = beforeList && beforeList._id !== activeList._id ? beforeList.order : null;

      reorderList.mutate({
        id: activeList._id,
        beforeListId: beforeList?._id ?? null,
        afterListId: overList._id,
        beforeOrder,
        afterOrder: overList.order,
      });
      return;
    }

    // ---- Moving a TASK (card) ----
    if (activeData.type === "task") {
      const activeTask = activeData.task;

      // Dropped on an empty area of a list (no cards to land next to)
      if (overData?.type === "list-container") {
        const targetListId = overData.listId;
        const targetList = lists.find((l) => l._id === targetListId);
        const siblings = targetList.tasks.filter((t) => t._id !== activeTask._id).sort((a, b) => a.order - b.order);
        const lastTask = siblings[siblings.length - 1];

        moveTask.mutate({
          taskId: activeTask._id,
          targetListId,
          beforeTaskId: lastTask?._id ?? null,
          afterTaskId: null,
          beforeOrder: lastTask?.order ?? null,
          afterOrder: null,
        });
        return;
      }

      // Dropped on/near another task — insert immediately before it
      if (overData?.type === "task") {
        const overTask = overData.task;
        const targetListId = overTask.list;
        const targetList = lists.find((l) => l._id === targetListId);
        const siblings = targetList.tasks.filter((t) => t._id !== activeTask._id).sort((a, b) => a.order - b.order);
        const overIndex = siblings.findIndex((t) => t._id === overTask._id);
        const beforeTask = overIndex > 0 ? siblings[overIndex - 1] : null;

        moveTask.mutate({
          taskId: activeTask._id,
          targetListId,
          beforeTaskId: beforeTask?._id ?? null,
          afterTaskId: overTask._id,
          beforeOrder: beforeTask?.order ?? null,
          afterOrder: overTask.order,
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
        }}
      >
        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 px-6">
          <SortableContext items={sortedLists.map((l) => `list-${l._id}`)} strategy={horizontalListSortingStrategy}>
            {sortedLists.map((list) => (
              <KanbanList key={list._id} list={list} boardId={board._id} />
            ))}
          </SortableContext>
          <NewListInline boardId={board._id} />
        </div>
      </div>
    </DndContext>
  );
}
