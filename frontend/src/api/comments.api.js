import axiosClient from "./axiosClient";

export const commentsApi = {
  listForTask: (taskId) => axiosClient.get(`/tasks/${taskId}/comments`).then((res) => res.data),
  create: (taskId, data) => axiosClient.post(`/tasks/${taskId}/comments`, data).then((res) => res.data),
  update: (id, data) => axiosClient.patch(`/comments/${id}`, data).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/comments/${id}`).then((res) => res.data),
};
