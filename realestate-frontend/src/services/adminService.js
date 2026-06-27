import api from './api';

const adminService = {
  // User Management
  getAllUsers: async () => {
    try {
      console.log('Fetching all users...');
      const response = await api.get('/api/users/all');
      console.log('Users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return []; // Return empty array on error
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  updateUserStatus: async (id, isActive) => {
    try {
      const response = await api.put(`/api/users/${id}/status?isActive=${isActive}`);
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Property Management
  getAllProperties: async () => {
    try {
      console.log('Fetching all properties...');
      const response = await api.get('/api/properties');
      console.log('Properties response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  updatePropertyStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/properties/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating property status:', error);
      throw error;
    }
  },

  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/api/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  // Appointment Management
  getAllAppointments: async () => {
    try {
      console.log('Fetching all appointments...');
      const response = await api.get('/api/appointments/all');
      console.log('Appointments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/appointments/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Transaction Management (Temporarily Disabled)
  getAllTransactions: async () => {
    try {
      console.log('Fetching all transactions...');
      // This endpoint is currently returning 400 - will be fixed later
      // For now, return empty array to prevent errors
      // const response = await api.get('/api/transactions/all');
      // return response.data;
      
      console.warn('Transactions API temporarily disabled - returning empty array');
      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  // Sales Management
  getAllSales: async () => {
    try {
      console.log('Fetching all sales...');
      const response = await api.get('/api/sales/all');
      console.log('Sales response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      
      // Fetch all data in parallel with error handling for each
      const [users, properties, appointments, sales] = await Promise.all([
        adminService.getAllUsers().catch(() => []),
        adminService.getAllProperties().catch(() => []),
        adminService.getAllAppointments().catch(() => []),
        adminService.getAllSales().catch(() => [])
        // Transactions temporarily excluded
      ]);
      
      // Calculate total revenue from sales
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
      
      return {
        totalUsers: users.length,
        totalProperties: properties.length,
        totalAppointments: appointments.length,
        totalTransactions: 0, // Temporarily set to 0
        totalSales: sales.length,
        totalRevenue: totalRevenue,
        recentUsers: users.slice(0, 5),
        recentProperties: properties.slice(0, 5),
        recentSales: sales.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values instead of throwing
      return {
        totalUsers: 0,
        totalProperties: 0,
        totalAppointments: 0,
        totalTransactions: 0,
        totalSales: 0,
        totalRevenue: 0,
        recentUsers: [],
        recentProperties: [],
        recentSales: []
      };
    }
  }
};

export default adminService;