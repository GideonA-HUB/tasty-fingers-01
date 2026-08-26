import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

function resolveAuthToken(): string | null {
  const path = window.location.pathname;
  const onDashboard = path.startsWith('/dashboard');
  if (onDashboard) {
    return localStorage.getItem('access_token') || localStorage.getItem('admin_token');
  }
  return (
    localStorage.getItem('customer_token') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('admin_token')
  );
}

apiClient.interceptors.request.use((config) => {
  const token = resolveAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/dashboard')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh');
        if (!path.includes('/dashboard/login')) {
          window.location.href = '/dashboard/login';
        }
      } else if (
        path.startsWith('/account') ||
        path.startsWith('/login') ||
        path.startsWith('/register')
      ) {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_refresh');
        if (!path.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
