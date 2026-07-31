import api from "./api";
import { clearAuthData } from "../utils/authStorage";

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

export const logoutUser = () => {
  clearAuthData();
};