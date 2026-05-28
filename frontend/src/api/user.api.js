import { apiGet, apiPost, apiPut, apiDelete } from './client.js';

export const getMe = async () => {
  return await apiGet('/users/me');
};

export const updateProfile = async (data) => {
  return await apiPut('/users/me', data);
};

export const uploadAvatar = async (formData) => {
  return await apiPost('/users/me/avatar', { body: formData });
};

export const updateEmail = async (email) => {
  return await apiPut('/users/me/email', { email });
};

export const getLeaderboard = async () => {
  return await apiGet('/users/leaderboard');
};

export const getAllUsers = async () => {
  return await apiGet('/users');
};

export const updateUser = async (id, data) => {
  return await apiPut(`/users/${id}`, data);
};

export const setRole = async (id, role) => {
  return await apiPut(`/users/${id}/role`, { role });
};

export const deleteUser = async (id) => {
  return await apiDelete(`/users/${id}`);
};
