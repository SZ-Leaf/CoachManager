import { apiRequest } from './apiClient.js';

export const fetchProducts = () => apiRequest('/api/products');
export const fetchProduct = (id) => apiRequest(`/api/products/${id}`);
export const createProduct = (body) =>
  apiRequest('/api/products', { method: 'POST', body });
export const updateProduct = (id, body) =>
  apiRequest(`/api/products/${id}`, { method: 'PATCH', body });
export const deleteProduct = (id) =>
  apiRequest(`/api/products/${id}`, { method: 'DELETE' });
