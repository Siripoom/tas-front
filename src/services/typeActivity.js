import apiClient from "./apiClient";

// Get all type activities
export const getAllTypeActivities = async () => {
  const response = await apiClient.get("/type-activities");
  return response.data;
};

// Get type activity by ID
export const getTypeActivityById = async (id) => {
  const response = await apiClient.get(`/type-activities/${id}`);
  return response.data;
};

// Create new type activity
export const createTypeActivity = async (data) => {
  const response = await apiClient.post("/type-activities", data);
  return response.data;
};

// Update type activity
export const updateTypeActivity = async (id, data) => {
  const response = await apiClient.put(`/type-activities/${id}`, data);
  return response.data;
};

// Delete type activity
export const deleteTypeActivity = async (id) => {
  const response = await apiClient.delete(`/type-activities/${id}`);
  return response.data;
};
