// api.js - Centralized API URL management
// This file helps manage the API URL across different environments

// Get the API base URL from environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Function to construct API URLs
export const apiUrl = (path) => {
  // Remove leading slash if it exists to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Ensure the base URL doesn't end with a slash
  const cleanBaseUrl = apiBaseUrl.endsWith('/')
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl;
  
  return `${cleanBaseUrl}/${cleanPath}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: apiUrl('users/login'),
  REGISTER: apiUrl('users/register'),
  VERIFY_OTP: apiUrl('users/verify'),
  
  // Medication endpoints
  MEDICATIONS: apiUrl('medications'),
  MEDICATION: (id) => apiUrl(`medications/${id}`),
  
  // Reminder endpoints
  REMINDERS: apiUrl('reminders'),
  REMINDER: (id) => apiUrl(`reminders/${id}`),
  MEDICATION_REMINDERS: (medicationId) => apiUrl(`medications/${medicationId}/reminders`),
  
  // User endpoints
  USER_PROFILE: apiUrl('users/profile'),
};

// API request helper with error handling
export const fetchWithAuth = async (url, options = {}) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    // Parse the response
    const data = isJson ? await response.json() : await response.text();
    
    // Handle non-2xx responses
    if (!response.ok) {
      throw {
        status: response.status,
        message: isJson ? data.message || 'Something went wrong' : 'Something went wrong',
        data,
      };
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (!error.status) {
      console.error('Network error:', error);
      throw {
        status: 0,
        message: 'Network error. Please check your internet connection.',
      };
    }
    
    // Handle auth errors (redirect to login)
    if (error.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    throw error;
  }
};

/*
USAGE EXAMPLES:

1. Login:
   const login = async (email, password) => {
     try {
       const data = await fetchWithAuth(API_ENDPOINTS.LOGIN, {
         method: 'POST',
         body: JSON.stringify({ email, password }),
       });
       localStorage.setItem('token', data.token);
       localStorage.setItem('user', JSON.stringify(data.user));
       return data;
     } catch (error) {
       console.error('Login error:', error);
       throw error;
     }
   };

2. Get medications:
   const getMedications = async () => {
     try {
       return await fetchWithAuth(API_ENDPOINTS.MEDICATIONS);
     } catch (error) {
       console.error('Failed to fetch medications:', error);
       throw error;
     }
   };

3. Add a new medication:
   const addMedication = async (medicationData) => {
     try {
       return await fetchWithAuth(API_ENDPOINTS.MEDICATIONS, {
         method: 'POST',
         body: JSON.stringify(medicationData),
       });
     } catch (error) {
       console.error('Failed to add medication:', error);
       throw error;
     }
   };

4. Get reminders for a medication:
   const getMedicationReminders = async (medicationId) => {
     try {
       return await fetchWithAuth(API_ENDPOINTS.MEDICATION_REMINDERS(medicationId));
     } catch (error) {
       console.error('Failed to fetch reminders:', error);
       throw error;
     }
   };
*/
