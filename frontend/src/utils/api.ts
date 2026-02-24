import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial - enables sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (optional - for debugging)
api.interceptors.request.use(
  (config) => {
    // Only log non-auth check requests to reduce console noise
    const isAuthCheckEndpoint = config.url?.includes('/me') || 
                               config.url?.includes('/validate-reset-token') ||
                               config.url?.includes('/validate-new-password-token');

    if (isAuthCheckEndpoint) {
      console.log('Making request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't log 401 errors for auth check endpoints as these are expected
    const isAuthCheckEndpoint = error.config.url?.includes('/me') || 
                               error.config.url?.includes('/validate-reset-token') ||
                               error.config.url?.includes('/validate-new-password-token');
    

    
    // Only redirect to login if it's NOT an auth check call and user was previously authenticated
    if (error.response?.status === 401 && !isAuthCheckEndpoint) {
      // Token expired or invalid on a protected action
      const wasAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (wasAuthenticated) {
        toast.error('Session expired. Please login again.');
        // Clear any stored auth state
        localStorage.removeItem('isAuthenticated');
        // Redirect to login
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;
