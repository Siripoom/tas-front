import apiClient from "./apiClient";

// Get all attendances
export const getAllAttendances = async () => {
  const response = await apiClient.get("/attendances");
  return response.data;
};

// Get attendance by ID
export const getAttendanceById = async (id) => {
  const response = await apiClient.get(`/attendances/${id}`);
  return response.data;
};

// Create new attendance
export const createAttendance = async (data) => {
  const response = await apiClient.post("/attendances", data);
  return response.data;
};

// Update attendance
export const updateAttendance = async (id, data) => {
  const response = await apiClient.put(`/attendances/${id}`, data);
  return response.data;
};

// Delete attendance
export const deleteAttendance = async (id) => {
  const response = await apiClient.delete(`/attendances/${id}`);
  return response.data;
};

// Get attendances by user
export const getAttendancesByUser = async (userId) => {
  const response = await apiClient.get(`/attendances/user/${userId}`);
  return response.data;
};

// Get attendances by activity
export const getAttendancesByActivity = async (activityId) => {
  const response = await apiClient.get(`/attendances/activity/${activityId}`);
  return response.data;
};
