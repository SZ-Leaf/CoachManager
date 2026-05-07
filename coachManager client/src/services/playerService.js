import { apiRequest } from './apiClient.js';

export const fetchPlayers = () => apiRequest('/api/players');
export const fetchPlayer = (id) => apiRequest(`/api/players/${id}`);
export const createPlayer = (body) => apiRequest('/api/players', { method: 'POST', body });
export const updatePlayer = (id, body) =>
  apiRequest(`/api/players/${id}`, { method: 'PATCH', body });
export const deletePlayer = (id) => apiRequest(`/api/players/${id}`, { method: 'DELETE' });
