import api from "./api";

export const getEmployerVerifications = async () => {
  const response = await api.get("/admin/employer-verifications");
  return response.data;
};

export const approveEmployer = async (id) => {
  const response = await api.put(`/admin/employer-verifications/${id}/approve`);
  return response.data;
};

export const rejectEmployer = async (id) => {
  const response = await api.put(`/admin/employer-verifications/${id}/reject`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.put(`/admin/users/${id}/status`, { status });
  return response.data;
};