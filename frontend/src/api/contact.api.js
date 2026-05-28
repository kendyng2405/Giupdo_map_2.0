import { apiPost } from './client.js';

export const sendContact = async (contactData) => {
  return await apiPost('/contact', contactData);
};
