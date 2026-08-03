import axiosClient from "./axiosClient";

export const listsApi = {
  create: (boardId, data) => axiosClient.post(`/boards/${boardId}/lists`, data).then((res) => res.data),
  update: (id, data) => axiosClient.patch(`/lists/${id}`, data).then((res) => res.data),
  reorder: (id, data) => axiosClient.patch(`/lists/${id}/reorder`, data).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/lists/${id}`).then((res) => res.data),
};
