import axiosClient from "./axiosClient";

export const attachmentsApi = {
  listForTask: (taskId) => axiosClient.get(`/tasks/${taskId}/attachments`).then((res) => res.data),
  upload: (taskId, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient
      .post(`/tasks/${taskId}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      })
      .then((res) => res.data);
  },
  remove: (id) => axiosClient.delete(`/attachments/${id}`).then((res) => res.data),
};