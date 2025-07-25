// API Configuration
const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const API_CONFIG = {
  BASE_URL: VITE_API_URL || 'http://localhost:5000',
  SOCKET_URL: VITE_SOCKET_URL || 'http://localhost:5000'
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Console log for debugging (remove in production)
console.log('API Config:', {
  BASE_URL: API_CONFIG.BASE_URL,
  SOCKET_URL: API_CONFIG.SOCKET_URL,
  ENV_VITE_API_URL: VITE_API_URL,
  ENV_VITE_SOCKET_URL: VITE_SOCKET_URL
});
