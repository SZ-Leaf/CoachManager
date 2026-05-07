import { apiRequest } from './apiClient.js';

export const fetchTeams = () => apiRequest('/api/teams');
export const fetchTeam = (id) => apiRequest(`/api/teams/${id}`);
export const createTeam = (body) => apiRequest('/api/teams', { method: 'POST', body });
export const updateTeam = (id, body) =>
  apiRequest(`/api/teams/${id}`, { method: 'PATCH', body });
export const deleteTeam = (id) => apiRequest(`/api/teams/${id}`, { method: 'DELETE' });
