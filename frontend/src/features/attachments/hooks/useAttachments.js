import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attachmentsApi } from "../../../api/attachments.api";

export function useAttachments(taskId) {
  return useQuery({
    queryKey: ["attachments", taskId],
    queryFn: () => attachmentsApi.listForTask(taskId),
    select: (data) => data.attachments,
    enabled: !!taskId,
  });
}

export function useUploadAttachment(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onUploadProgress }) => attachmentsApi.upload(taskId, file, onUploadProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", taskId] }),
  });
}

export function useDeleteAttachment(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => attachmentsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", taskId] }),
  });
}