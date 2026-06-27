import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('🔍 Request Interceptor:');
    console.log('  URL:', config.url);
    console.log('  Method:', config.method);
    console.log('  Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('  Token attached (first 20 chars):', token.substring(0, 20) + '...');
    } else {
      console.warn('  ⚠️ No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ HTTP ${error.response.status}:`, error.response.config?.url);
      console.error('Response headers:', error.response.headers);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.error('🔐 Authentication failed - token may be expired or invalid');
        
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page if not already there
        if (!window.location.pathname.includes('/login')) {
          console.log('Redirecting to login...');
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;