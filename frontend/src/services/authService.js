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

export const logoutUser = () => {
  clearAuthData();
};