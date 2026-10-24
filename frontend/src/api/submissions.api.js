import axiosClient from "./axiosClient";

export const submissionsApi = {
  listForTask: (taskId) => axiosClient.get(`/tasks/${taskId}/submissions`).then((res) => res.data),
  create: (taskId, { notes, files }) => {
    const formData = new FormData();
    formData.append("notes", notes);
    files.forEach((file) => formData.append("files", file));
    return axiosClient
      .post(`/tasks/${taskId}/submissions`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
  review: (id, { decision, reviewNote }) =>
    axiosClient.patch(`/submissions/${id}/review`, { decision, reviewNote }).then((res) => res.data),
};