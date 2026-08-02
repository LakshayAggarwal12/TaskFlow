import axiosClient from "./axiosClient";

export const workspacesApi = {
  list: () => axiosClient.get("/workspaces").then((res) => res.data),
  create: (data) => axiosClient.post("/workspaces", data).then((res) => res.data),
  getOne: (id) => axiosClient.get(`/workspaces/${id}`).then((res) => res.data),
  update: (id, data) => axiosClient.patch(`/workspaces/${id}`, data).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/workspaces/${id}`).then((res) => res.data),
  addMember: (id, data) => axiosClient.post(`/workspaces/${id}/members`, data).then((res) => res.data),
  updateMemberRole: (id, memberId, data) =>
    axiosClient.patch(`/workspaces/${id}/members/${memberId}`, data).then((res) => res.data),
  removeMember: (id, memberId) =>
    axiosClient.delete(`/workspaces/${id}/members/${memberId}`).then((res) => res.data),
};
