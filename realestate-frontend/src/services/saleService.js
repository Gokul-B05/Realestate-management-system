import api from './api';

const saleService = {
  // Complete a sale (admin only)
  completeSale: async (saleData) => {
    try {
      console.log('Completing sale with data:', saleData);
      const response = await api.post('/api/sales/complete', saleData);
      return response.data;
    } catch (error) {
      console.error('Error completing sale:', error);
      throw error;
    }
  },

  // Get user's purchases
  getMyPurchases: async () => {
    try {
      console.log('Fetching my purchases...');
      const response = await api.get('/api/sales/my-purchases');
      return response.data;
    } catch (error) {
      console.error('Error fetching purchases:', error);
      return [];
    }
  },

  // Get user's sales
  getMySales: async () => {
    try {
      console.log('Fetching my sales...');
      const response = await api.get('/api/sales/my-sales');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  },

  // Get sale by property ID
  getSaleByProperty: async (propertyId) => {
    try {
      const response = await api.get(`/api/sales/property/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sale:', error);
      return null;
    }
  },

  // Get all sales (admin only)
  getAllSales: async () => {
    try {
      const response = await api.get('/api/sales/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all sales:', error);
      return [];
    }
  }
};

export default saleService;