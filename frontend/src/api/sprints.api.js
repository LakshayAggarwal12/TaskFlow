import axiosClient from "./axiosClient";

export const sprintsApi = {
  listForProject: (projectId) => axiosClient.get(`/projects/${projectId}/sprints`).then((res) => res.data),
  create: (projectId, data) => axiosClient.post(`/projects/${projectId}/sprints`, data).then((res) => res.data),
  getOne: (id) => axiosClient.get(`/sprints/${id}`).then((res) => res.data),
  update: (id, data) => axiosClient.patch(`/sprints/${id}`, data).then((res) => res.data),
  addTask: (id, data) => axiosClient.post(`/sprints/${id}/tasks`, data).then((res) => res.data),
  removeTask: (id, taskId) => axiosClient.delete(`/sprints/${id}/tasks/${taskId}`).then((res) => res.data),
  close: (id) => axiosClient.post(`/sprints/${id}/close`).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/sprints/${id}`).then((res) => res.data),
};
