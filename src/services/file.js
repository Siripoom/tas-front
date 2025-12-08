import apiClient from "./apiClient";

// Get all files
export const getAllFiles = async (params = {}) => {
  const response = await apiClient.get("/files", { params });
  return response.data;
};

// Get file by ID
export const getFileById = async (id) => {
  const response = await apiClient.get(`/files/${id}`);
  return response.data;
};

// Upload single file
export const uploadFile = async (file, activityId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("activityId", activityId);

  const response = await apiClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Upload multiple files
export const uploadMultipleFiles = async (files, activityId) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("activityId", activityId);

  const response = await apiClient.post("/files/upload-multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Upload students CSV
export const uploadStudentsCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/files/upload-students-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete file
export const deleteFile = async (id) => {
  const response = await apiClient.delete(`/files/${id}`);
  return response.data;
};

// Download file
export const downloadFile = async (id) => {
  const response = await apiClient.get(`/files/${id}/download`, {
    responseType: "blob",
  });
  return response.data;
};

// Get files by activity
export const getFilesByActivity = async (activityId) => {
  const response = await apiClient.get(`/files/activity/${activityId}`);
  return response.data;
};
