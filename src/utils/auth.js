/**
 * Authentication and Authorization Utility Functions
 */

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not found
 */
export const getUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Get token from localStorage
 * @returns {string|null} Token or null if not found
 */
export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const user = getUser();
  const token = getToken();
  return !!(user && token);
};

/**
 * Check if user has required role
 * @param {string} requiredRole - Required role to access
 * @returns {boolean} True if user has the required role
 */
export const hasRole = (requiredRole) => {
  const user = getUser();
  if (!user) return false;
  return user.role === requiredRole;
};

/**
 * Check if user has one of the allowed roles
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean} True if user has one of the allowed roles
 */
export const hasAnyRole = (allowedRoles) => {
  const user = getUser();
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

/**
 * Get home path based on user role
 * @returns {string} Home path for the user's role
 */
export const getHomePath = () => {
  const user = getUser();
  if (!user) return "/login";

  switch (user.role) {
    case "student":
      return "/student/home";
    case "teacher":
      return "/teacher/home";
    case "admin":
      return "/admin/home";
    default:
      return "/login";
  }
};

/**
 * Check if user can access a specific path
 * @param {string} path - Path to check
 * @returns {boolean} True if user can access the path
 */
export const canAccessPath = (path) => {
  const user = getUser();
  if (!user) return false;

  // Extract role from path (e.g., /student/home -> student)
  const pathParts = path.split("/");
  const pathRole = pathParts[1]; // First part after /

  // Check if path role matches user role
  return user.role === pathRole;
};
