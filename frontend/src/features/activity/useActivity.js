import { useQuery } from "@tanstack/react-query";
import { activityApi } from "../../api/activity.api";

export function useActivity(projectId, params = {}) {
  return useQuery({
    queryKey: ["activity", projectId, params],
    queryFn: () => activityApi.list(projectId, params),
    enabled: !!projectId,
  });
}
