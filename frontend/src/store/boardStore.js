import { create } from "zustand";

// Deliberately tiny: this store holds ONLY the transient "what's being
// dragged right now" state. Actual board/task data lives in React Query's
// cache (see useBoardData) — duplicating server data into Zustand would risk
// the two falling out of sync. This store exists purely so that during a
// drag, only the dragged card and its list re-render, instead of the whole
// board re-rendering on every pixel of pointer movement (see planning doc
// Section 8 for the justification).
export const useDragStore = create((set) => ({
  activeTaskId: null,
  activeListId: null,
  setActiveDrag: (taskId, listId) => set({ activeTaskId: taskId, activeListId: listId }),
  clearActiveDrag: () => set({ activeTaskId: null, activeListId: null }),
}));
