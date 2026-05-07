import { apiRequest } from './apiClient.js';

export const fetchAttendances = () => apiRequest('/api/attendances');
export const fetchAttendance = (id) => apiRequest(`/api/attendances/${id}`);
export const createAttendance = (body) =>
  apiRequest('/api/attendances', { method: 'POST', body });
export const updateAttendance = (id, body) =>
  apiRequest(`/api/attendances/${id}`, { method: 'PATCH', body });
export const deleteAttendance = (id) =>
  apiRequest(`/api/attendances/${id}`, { method: 'DELETE' });
