// API utility for consistent endpoint management
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiUrl = (endpoint) => {
  // Remove leading slash if present
  const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_URL}/${path}`;
};

export default API_URL;
