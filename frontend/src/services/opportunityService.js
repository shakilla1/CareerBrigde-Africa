import api from "./api";

export const getOpportunities = async (filters = {}) => {
  const params = {};

  if (filters.query) params.query = filters.query;
  if (filters.location) params.location = filters.location;
  if (filters.type) params.type = filters.type;
  if (filters.page) params.page = filters.page;
  if (filters.perPage) params.per_page = filters.perPage;

  const response = await api.get("/opportunities", { params });
  return response.data;
};

export const getOpportunityById = async (id) => {
  const response = await api.get(`/opportunities/${id}`);
  return response.data;
};

export const createOpportunity = async (data) => {
  const response = await api.post("/opportunities", data);
  return response.data;
};

export const updateOpportunity = async (id, data) => {
  const response = await api.put(`/opportunities/${id}`, data);
  return response.data;
};

export const deleteOpportunity = async (id) => {
  const response = await api.delete(`/opportunities/${id}`);
  return response.data;
};

export const saveOpportunity = async (id) => {
  const response = await api.post(`/opportunities/${id}/save`);
  return response.data;
};

export const unsaveOpportunity = async (id) => {
  const response = await api.delete(`/opportunities/${id}/save`);
  return response.data;
};

export const getSavedOpportunities = async () => {
  const response = await api.get("/opportunities/saved");
  return response.data;
};

export const getMyOpportunities = async () => {
  const response = await api.get("/opportunities/mine");
  return response.data;
};

export const getApplicantsForOpportunity = async (opportunityId) => {
  const response = await api.get(`/opportunities/${opportunityId}/applicants`);
  return response.data;
};
