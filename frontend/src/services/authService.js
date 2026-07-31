import api from "./api";
import { clearAuthData } from "../utils/authStorage";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};

export const logoutUser = () => {
  clearAuthData();
};