import axiosClient from "./axiosClient";

export const activityApi = {
  list: (projectId, params = {}) =>
    axiosClient.get(`/projects/${projectId}/activity`, { params }).then((res) => res.data),
};
