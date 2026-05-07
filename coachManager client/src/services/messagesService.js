import { apiRequest } from './apiClient.js';

export const fetchMessages = () => apiRequest('/api/messages');
export const fetchMessage = (id) => apiRequest(`/api/messages/${id}`);
export const createMessage = (body) =>
  apiRequest('/api/messages', { method: 'POST', body });
export const updateMessage = (id, body) =>
  apiRequest(`/api/messages/${id}`, { method: 'PATCH', body });
export const deleteMessage = (id) =>
  apiRequest(`/api/messages/${id}`, { method: 'DELETE' });
