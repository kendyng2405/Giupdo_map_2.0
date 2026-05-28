import { apiGet, apiPost } from './client.js';

export const registerUser = async (uid, data) => {
  return await apiPost('/auth/register', { uid, ...data });
};

export const getMe = async () => {
  return await apiGet('/auth/me');
};
