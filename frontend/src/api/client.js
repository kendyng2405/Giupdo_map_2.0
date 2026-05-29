import { getAuth } from 'firebase/auth';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

const request = async (endpoint, options = {}) => {
  const token = await getToken();
  
  const headers = {
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: 'Lỗi parse JSON' };
  }

  if (!response.ok) {
    throw new Error(data.error || 'Lỗi kết nối máy chủ');
  }

  return data;
};

export const apiGet = (endpoint) => request(endpoint, { method: 'GET' });
export const apiPost = (endpoint, body) => request(endpoint, { method: 'POST', body });
export const apiPut = (endpoint, body) => request(endpoint, { method: 'PUT', body });
export const apiPatch = (endpoint, body) => request(endpoint, { method: 'PATCH', body });
export const apiDelete = (endpoint) => request(endpoint, { method: 'DELETE' });

// FormData helpers — send multipart/form-data without JSON.stringify
export const apiPostForm = async (endpoint, formData) => {
  const token = await getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Do NOT set Content-Type — let the browser set multipart boundary automatically

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: 'Lỗi parse JSON' };
  }
  if (!response.ok) throw new Error(data.error || 'Lỗi kết nối máy chủ');
  return data;
};

export const apiPutForm = async (endpoint, formData) => {
  const token = await getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: formData,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: 'Lỗi parse JSON' };
  }
  if (!response.ok) throw new Error(data.error || 'Lỗi kết nối máy chủ');
  return data;
};
