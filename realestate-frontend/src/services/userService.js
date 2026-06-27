import api from './api';

const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      console.log('Fetching all users...');
      const response = await api.get('/api/users/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      const response = await api.get(`/api/users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Search users (admin only)
  searchUsers: async (keyword) => {
    try {
      const response = await api.get(`/api/users/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
};

export default userService;