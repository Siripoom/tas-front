import apiClient from "./apiClient";

export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email: String(email),
      password: String(password),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
