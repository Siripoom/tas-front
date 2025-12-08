import apiClient from "./apiClient";

// Get all activities
export const getAllActivities = async (params = {}) => {
  const response = await apiClient.get("/activities", { params });
  return response.data;
};

// Get activities report
export const getActivitiesReport = async (params = {}) => {
  const response = await apiClient.get("/activities/report", { params });
  return response.data;
};

// Get activity by ID
export const getActivityById = async (id) => {
  const response = await apiClient.get(`/activities/${id}`);
  return response.data;
};

// Create new activity
export const createActivity = async (data) => {
  const response = await apiClient.post("/activities", data);
  return response.data;
};

// Update activity
export const updateActivity = async (id, data) => {
  const response = await apiClient.put(`/activities/${id}`, data);
  return response.data;
};

// Delete activity
export const deleteActivity = async (id) => {
  const response = await apiClient.delete(`/activities/${id}`);
  return response.data;
};

// Get activities by responsible user
export const getActivitiesByResponsible = async (userId) => {
  const response = await apiClient.get(`/activities/responsible/${userId}`);
  return response.data;
};
