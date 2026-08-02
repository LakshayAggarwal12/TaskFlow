import axiosClient from "./axiosClient";

export const projectsApi = {
  listForWorkspace: (workspaceId) =>
    axiosClient.get(`/workspaces/${workspaceId}/projects`).then((res) => res.data),
  create: (workspaceId, data) =>
    axiosClient.post(`/workspaces/${workspaceId}/projects`, data).then((res) => res.data),
};
