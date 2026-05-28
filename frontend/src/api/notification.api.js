import { apiGet, apiPut } from './client.js';

export const getNotifications = async () => {
  return await apiGet('/notifications');
};

export const markAllRead = async () => {
  return await apiPut('/notifications/read-all', {});
};

export const markRead = async (id) => {
  return await apiPut(`/notifications/${id}/read`, {});
};
