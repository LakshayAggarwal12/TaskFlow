import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../api/analytics.api";

export function useAnalytics(projectId) {
  return useQuery({
    queryKey: ["analytics", projectId],
    queryFn: () => analyticsApi.getOverview(projectId),
    select: (data) => data.overview,
    enabled: !!projectId,
  });
}
