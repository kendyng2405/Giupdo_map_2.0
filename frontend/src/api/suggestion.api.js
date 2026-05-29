import { apiGet, apiPost, apiPostForm, apiDelete } from './client.js';

export const getSuggestions = async (status = '') => {
  const url = status ? `/suggestions?status=${status}` : '/suggestions';
  return await apiGet(url);
};

export const getMySuggestions = async () => {
  return await apiGet('/suggestions/my');
};

export const createSuggestion = async (formData) => {
  return await apiPostForm('/suggestions', formData);
};

export const approveSuggestion = async (id) => {
  return await apiPost(`/suggestions/${id}/approve`, {});
};

export const rejectSuggestion = async (id, reason) => {
  return await apiPost(`/suggestions/${id}/reject`, { reason });
};

export const deleteSuggestion = async (id) => {
  return await apiDelete(`/suggestions/${id}`);
};
