import { apiRequest } from './apiClient.js';

export const fetchDashboardSummary = () => apiRequest('/api/dashboard/summary');
