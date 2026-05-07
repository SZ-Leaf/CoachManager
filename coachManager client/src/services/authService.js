import { apiRequest } from './apiClient.js';

export function fetchMe() {
  return apiRequest('/api/auth/me');
}

export function login(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export function logout() {
  return apiRequest('/api/auth/logout', { method: 'POST' });
}

export function register(payload) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}
