import axiosClient from "./axiosClient";

export const usersApi = {
  getNotificationPreferences: () =>
    axiosClient.get("/users/me/notification-preferences").then((res) => res.data),
  updateNotificationPreferences: (body) =>
    axiosClient.patch("/users/me/notification-preferences", body).then((res) => res.data),
  sendTestEmail: () =>
    axiosClient.post("/users/me/notification-preferences/test-email").then((res) => res.data),
};