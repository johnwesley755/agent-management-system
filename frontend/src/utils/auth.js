// ✅ auth.js

// Check if token exists
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Save token
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// Remove token & user
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Logs out the user by removing the token and user from localStorage
 * and redirects to the login page
 */
/*******  97016956-ef6f-4a15-8c38-7012d71029f4  *******/// ✅ Get user safely
export const getUser = () => {
  const user = localStorage.getItem("user");

  // If nothing stored OR string "undefined"
  if (!user || user === "undefined") return null;

  try {
    return JSON.parse(user); // Parse only if valid
  } catch (err) {
    console.error("Invalid user data in localStorage", err);
    return null;
  }
};

// ✅ Save user safely
export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user"); // prevent storing "undefined"
  }
};

// Logout function
export const logout = () => {
  removeToken();
  window.location.href = "/login"; // redirect to login
};
