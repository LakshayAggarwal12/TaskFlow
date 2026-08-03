import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../../api/ai.api";

export function useDraftTask(projectId) {
  return useMutation({
    mutationFn: (data) => aiApi.draftTask(projectId, data),
  });
}

export function useSuggestLabel(projectId) {
  return useMutation({
    mutationFn: (data) => aiApi.suggestLabel(projectId, data),
  });
}

export function useAISearch(projectId) {
  return useMutation({
    mutationFn: (data) => aiApi.search(projectId, data),
  });
}
