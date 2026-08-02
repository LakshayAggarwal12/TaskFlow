import axiosClient from "./axiosClient";

export const notificationsApi = {
  list: (params = {}) => axiosClient.get("/notifications", { params }).then((res) => res.data),
  markRead: (id) => axiosClient.patch(`/notifications/${id}/read`).then((res) => res.data),
  markAllRead: () => axiosClient.patch("/notifications/read-all").then((res) => res.data),
  remove: (id) => axiosClient.delete(`/notifications/${id}`).then((res) => res.data),
};
