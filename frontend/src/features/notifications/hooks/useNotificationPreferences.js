import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../../api/users.api";

const KEY = ["notification-preferences"];

export function useNotificationPreferences() {
  return useQuery({ queryKey: KEY, queryFn: usersApi.getNotificationPreferences });
}

// Optimistic: a toggle flips instantly, and rolls back (with the caller's
// onError toast) if the save fails — same pattern as the board mutations.
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateNotificationPreferences,
    onMutate: async (update) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData(KEY);
      queryClient.setQueryData(KEY, (old) =>
        old
          ? {
              ...old,
              preferences: {
                emailEnabled: update.emailEnabled ?? old.preferences.emailEnabled,
                email: { ...old.preferences.email, ...(update.email || {}) },
              },
            }
          : old
      );
      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) queryClient.setQueryData(KEY, context.previous);
    },
    onSuccess: (data) => queryClient.setQueryData(KEY, data),
  });
}

export function useSendTestEmail() {
  return useMutation({ mutationFn: usersApi.sendTestEmail });
}