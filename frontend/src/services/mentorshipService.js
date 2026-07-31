import api from "./api";

export const getMentorshipResources = async () => {
  const response = await api.get("/mentorship");
  return response.data;
};

export const createMentorshipResource = async (data) => {
  const response = await api.post("/mentorship", data);
  return response.data;
};

export const updateMentorshipResource = async (id, data) => {
  const response = await api.put(`/mentorship/${id}`, data);
  return response.data;
};

export const deleteMentorshipResource = async (id) => {
  const response = await api.delete(`/mentorship/${id}`);
  return response.data;
};
