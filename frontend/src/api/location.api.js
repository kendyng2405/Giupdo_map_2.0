import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './client.js';

export const getLocations = async (all = false) => {
  const url = all ? '/locations?all=true' : '/locations';
  return await apiGet(url);
};

export const getLocation = async (id) => {
  return await apiGet(`/locations/${id}`);
};

export const createLocation = async (formData) => {
  return await apiPost('/locations', { body: formData });
};

export const updateLocation = async (id, formData) => {
  return await apiPut(`/locations/${id}`, { body: formData });
};

export const deleteLocation = async (id) => {
  return await apiDelete(`/locations/${id}`);
};

export const toggleLocation = async (id, isActive) => {
  return await apiPatch(`/locations/${id}/toggle`, { isActive });
};

export const supportLocation = async (id, lat, lng) => {
  return await apiPost(`/locations/${id}/support`, { lat, lng });
};
