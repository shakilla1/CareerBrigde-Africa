import axios from "axios";
import { getToken, clearAuthData } from "../utils/authStorage";


const FALLBACK_API_URL = "https://careerbrigde-africa.onrender.com";

const configuredUrl = import.meta.env.VITE_API_URL || FALLBACK_API_URL;

export const API_ROOT = configuredUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthAttempt =
      requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

    if ((status === 401 || status === 422) && !isAuthAttempt) {
      clearAuthData();

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;