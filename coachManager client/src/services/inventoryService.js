import { apiRequest } from './apiClient.js';

export const fetchInventories = () => apiRequest('/api/inventories');
export const fetchInventory = (id) => apiRequest(`/api/inventories/${id}`);
export const createInventory = (body) =>
  apiRequest('/api/inventories', { method: 'POST', body });
export const touchInventory = (id) =>
  apiRequest(`/api/inventories/${id}`, { method: 'PATCH' });
export const deleteInventory = (id) =>
  apiRequest(`/api/inventories/${id}`, { method: 'DELETE' });
