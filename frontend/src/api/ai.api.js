import axiosClient from "./axiosClient";

export const aiApi = {
  draftTask: (projectId, data) =>
    axiosClient.post(`/projects/${projectId}/ai/draft-task`, data).then((res) => res.data),
  suggestLabel: (projectId, data) =>
    axiosClient.post(`/projects/${projectId}/ai/suggest-label`, data).then((res) => res.data),
  search: (projectId, data) =>
    axiosClient.post(`/projects/${projectId}/ai/search`, data).then((res) => res.data),
};
