import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      console.log('📤 Sending login request with:', credentials);
      console.log('📤 Email type:', typeof credentials.email);
      console.log('📤 Password type:', typeof credentials.password);
      console.log('📤 Full credentials object:', JSON.stringify(credentials));
      
      const response = await api.post('/api/auth/login', credentials);
      console.log('📥 Login response:', response);
      
      if (response.data.token) {
        // Store token
        localStorage.setItem('token', response.data.token);
        console.log('✅ Token stored successfully');
        
        // Decode JWT to get user info
        try {
          const tokenParts = response.data.token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('📦 Decoded token payload:', payload);
            
            const user = {
              email: payload.sub || payload.email,
              userId: payload.userId,
              role: payload.role || payload.authorities
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            console.log('✅ User stored:', user);
            
            return { 
              success: true, 
              user,
              token: response.data.token
            };
          }
        } catch (decodeError) {
          console.error('❌ Error decoding token:', decodeError);
        }
      }
      
      return { success: false, error: 'No token received' };
      
    } catch (error) {
      console.error('❌ Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          error: 'Cannot connect to server. Is backend running?' 
        };
      }
      
      if (error.response) {
        // The request was made and the server responded with a status code
        return { 
          success: false, 
          error: error.response.data?.message || error.response.data || 'Invalid credentials',
          status: error.response.status
        };
      }
      
      return { success: false, error: error.message };
    }
  },

  // ... rest of the service

  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      return { 
        success: true, 
        message: response.data || 'Registration successful' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed. Please try again.' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ROLE_ADMIN';
  }
};

export default authService;