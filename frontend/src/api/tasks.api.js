import axiosClient from "./axiosClient";

export const tasksApi = {
  create: (listId, data) => axiosClient.post(`/lists/${listId}/tasks`, data).then((res) => res.data),
  getOne: (id) => axiosClient.get(`/tasks/${id}`).then((res) => res.data),
  update: (id, data) => axiosClient.patch(`/tasks/${id}`, data).then((res) => res.data),
  move: (id, data) => axiosClient.patch(`/tasks/${id}/move`, data).then((res) => res.data),
  addSubtask: (id, data) => axiosClient.post(`/tasks/${id}/subtasks`, data).then((res) => res.data),
  toggleSubtask: (id, subtaskId, data) =>
    axiosClient.patch(`/tasks/${id}/subtasks/${subtaskId}`, data).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/tasks/${id}`).then((res) => res.data),
};
