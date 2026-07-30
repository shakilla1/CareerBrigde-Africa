export const setAuthData = (data, remember) => {
  const storage = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;

  storage.setItem("access_token", data.access_token);
  storage.setItem("refresh_token", data.refresh_token);
  storage.setItem("user", JSON.stringify(data.user));

  other.removeItem("access_token");
  other.removeItem("refresh_token");
  other.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
};

export const getUser = () => {
  const fromLocal = localStorage.getItem("user");
  const fromSession = sessionStorage.getItem("user");
  const raw = fromLocal || fromSession;
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("user");
};