import axiosClient from "./axiosClient";

export const projectsApi = {
  listForWorkspace: (workspaceId) =>
    axiosClient.get(`/workspaces/${workspaceId}/projects`).then((res) => res.data),
  create: (workspaceId, data) =>
    axiosClient.post(`/workspaces/${workspaceId}/projects`, data).then((res) => res.data),
  getOne: (id) => axiosClient.get(`/projects/${id}`).then((res) => res.data),
  update: (id, data) => axiosClient.patch(`/projects/${id}`, data).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/projects/${id}`).then((res) => res.data),
  setOverride: (id, data) => axiosClient.post(`/projects/${id}/overrides`, data).then((res) => res.data),
  removeOverride: (id, memberId) =>
    axiosClient.delete(`/projects/${id}/overrides/${memberId}`).then((res) => res.data),
};
