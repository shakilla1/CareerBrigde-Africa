import api from "./api";

export const applyToOpportunity = async (opportunityId, coverLetter) => {
  const response = await api.post(`/opportunities/${opportunityId}/apply`, {
    cover_letter: coverLetter,
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

export const withdrawApplication = async (applicationId) => {
  const response = await api.put(`/applications/${applicationId}/withdraw`);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.put(`/applications/${id}/status`, { status });
  return response.data;
};