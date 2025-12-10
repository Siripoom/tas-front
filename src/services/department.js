import apiClient from "./apiClient";

// Get all departments
export const getAllDepartments = async (params = {}) => {
  const response = await apiClient.get("/departments", { params });
  return response.data;
};

// Get department by ID
export const getDepartmentById = async (id) => {
  const response = await apiClient.get(`/departments/${id}`);
  return response.data;
};

// Create new department
export const createDepartment = async (data) => {
  const response = await apiClient.post("/departments", data);
  return response.data;
};

// Update department
export const updateDepartment = async (id, data) => {
  const response = await apiClient.put(`/departments/${id}`, data);
  return response.data;
};

// Delete department
export const deleteDepartment = async (id) => {
  const response = await apiClient.delete(`/departments/${id}`);
  return response.data;
};
