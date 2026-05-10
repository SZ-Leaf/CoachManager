import { apiRequest } from './apiClient.js';

function normalizeNumericTeamId(teamId) {
  const id = teamId != null ? String(teamId).trim() : '';
  if (!/^\d+$/.test(id)) {
    throw new Error("Identifiant d'équipe invalide.");
  }
  return id;
}

export const fetchAttendances = () => apiRequest('/api/attendances');
export const fetchAttendance = (id) => apiRequest(`/api/attendances/${id}`);
export const createAttendance = (body) =>
  apiRequest('/api/attendances', { method: 'POST', body });
export const updateAttendance = (id, body) =>
  apiRequest(`/api/attendances/${id}`, { method: 'PATCH', body });
export const deleteAttendance = (id) =>
  apiRequest(`/api/attendances/${id}`, { method: 'DELETE' });

export const fetchTeamRollCall = (teamId, sessionAtIso) => {
  const id = normalizeNumericTeamId(teamId);
  return apiRequest(
    `/api/teams/roll-call/${id}?sessionAt=${encodeURIComponent(sessionAtIso)}`,
  );
};

export const saveTeamRollCall = (teamId, body) => {
  const id = normalizeNumericTeamId(teamId);
  return apiRequest(`/api/teams/roll-call/${id}`, { method: 'POST', body });
};
