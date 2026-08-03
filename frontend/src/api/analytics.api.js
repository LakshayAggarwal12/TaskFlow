import axiosClient from "./axiosClient";

export const analyticsApi = {
  getOverview: (projectId) =>
    axiosClient.get(`/projects/${projectId}/analytics/overview`).then((res) => res.data),
};
