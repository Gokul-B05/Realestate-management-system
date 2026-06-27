import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        console.log('Loading user from storage:');
        console.log('  Token exists:', !!token);
        console.log('  User data exists:', !!userStr);
        
        if (token && userStr) {
          // Verify token is valid (not expired)
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const exp = payload.exp * 1000; // Convert to milliseconds
              
              if (Date.now() >= exp) {
                console.log('Token expired, clearing storage');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
              } else {
                setUser(JSON.parse(userStr));
                console.log('User loaded successfully');
              }
            }
          } catch (e) {
            console.error('Error parsing token:', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      console.log('AuthContext: Attempting login...');
      
      const result = await authService.login(credentials);
      console.log('AuthContext: Login result:', result);
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (err) {
      console.error('AuthContext login error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    console.log('AuthContext: User logged out');
  };

  const isAdmin = () => {
    return user?.role === 'ROLE_ADMIN';
  };

  const value = {
    user,
    login,
    logout,
    error,
    loading,
    isAuthenticated: !!user,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};