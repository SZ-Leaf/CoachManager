import { apiRequest } from './apiClient.js';

export const fetchClubs = () => apiRequest('/api/clubs');
export const fetchClub = (id) => apiRequest(`/api/clubs/${id}`);
export const createClub = (body) => apiRequest('/api/clubs', { method: 'POST', body });
export const updateClub = (id, body) =>
  apiRequest(`/api/clubs/${id}`, { method: 'PATCH', body });
export const deleteClub = (id) => apiRequest(`/api/clubs/${id}`, { method: 'DELETE' });
