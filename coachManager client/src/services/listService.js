import { apiRequest } from './apiClient.js';

export const fetchLists = () => apiRequest('/api/lists');
export const fetchList = (id) => apiRequest(`/api/lists/${id}`);
export const createList = (body) => apiRequest('/api/lists', { method: 'POST', body });
export const updateList = (id, body) =>
  apiRequest(`/api/lists/${id}`, { method: 'PATCH', body });
export const deleteList = (id) => apiRequest(`/api/lists/${id}`, { method: 'DELETE' });
