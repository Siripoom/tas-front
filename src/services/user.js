import apiClient from "./apiClient";

// Get all users
export const getAllUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

// Get users by type (student, teacher, admin)
export const getUsersByType = async (userType) => {
  const response = await apiClient.get(`/users?userType=${userType}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

// Create new user
export const createUser = async (userData) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};

// Update user
export const updateUser = async (userId, userData) => {
  const response = await apiClient.put(`/users/${userId}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};
