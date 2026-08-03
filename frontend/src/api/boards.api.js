import axiosClient from "./axiosClient";

export const boardsApi = {
  listForProject: (projectId) => axiosClient.get(`/projects/${projectId}/boards`).then((res) => res.data),
  create: (projectId, data) => axiosClient.post(`/projects/${projectId}/boards`, data).then((res) => res.data),
  getOne: (id) => axiosClient.get(`/boards/${id}`).then((res) => res.data),
  update: (id, data) => axiosClient.patch(`/boards/${id}`, data).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/boards/${id}`).then((res) => res.data),
};
