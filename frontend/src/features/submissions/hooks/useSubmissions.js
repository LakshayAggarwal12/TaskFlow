import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionsApi } from "../../../api/submissions.api";

export function useTaskSubmissions(taskId) {
  return useQuery({
    queryKey: ["submissions", taskId],
    queryFn: () => submissionsApi.listForTask(taskId),
    select: (data) => data.submissions,
    enabled: !!taskId,
  });
}

// Submitting invalidates both the submissions list and the task itself
// (reviewStatus lives on the task, and the board cache needs the fresh
// task so the drag-and-drop gate has up-to-date data). Live updates for
// other users arrive via useBoardSocket's submission:* listeners instead.
export function useCreateSubmission(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ notes, files }) => submissionsApi.create(taskId, { notes, files }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });
}

export function useReviewSubmission(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision, reviewNote }) => submissionsApi.review(id, { decision, reviewNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });
}