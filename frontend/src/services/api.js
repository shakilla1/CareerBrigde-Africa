import axios from "axios";
import { getToken, clearAuthData } from "../utils/authStorage";

/**
 * The deployed backend. This is used when VITE_API_URL is not set at build
 * time, which is exactly what happens on Vercel if the environment variable
 * was never added there (the local .env file is git-ignored and is never
 * uploaded with the code).
 */
const FALLBACK_API_URL = "https://careerbrigde-africa.onrender.com";

const configuredUrl = import.meta.env.VITE_API_URL || FALLBACK_API_URL;

// Tolerate a trailing slash, and a value that already ends in /api,
// so the final URL is never ".../api/api/..." or "...com//api/...".
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

    // An expired or invalid token should send the user back to the login
    // page instead of leaving every page stuck on "Loading...".
    // Login and register are excluded so a wrong password still shows
    // its message on the form.
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
