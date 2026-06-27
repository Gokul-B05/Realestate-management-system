import api from './api';

const transactionService = {
    // Create transaction (admin only)
    createTransaction: async (transactionData) => {
        const response = await api.post('/api/transactions', transactionData);
        return response.data;
    },

    // Get user's purchases
    getMyPurchases: async () => {
        const response = await api.get('/api/transactions/my-purchases');
        return response.data;
    },

    // Get user's sales
    getMySales: async () => {
        const response = await api.get('/api/transactions/my-sales');
        return response.data;
    },

    // Get transaction by property
    getTransactionByProperty: async (propertyId) => {
        const response = await api.get(`/api/transactions/property/${propertyId}`);
        return response.data;
    },

    // Get transaction by ID
    getTransactionById: async (id) => {
        const response = await api.get(`/api/transactions/${id}`);
        return response.data;
    },

    // Get all transactions (admin only)
    getAllTransactions: async () => {
        const response = await api.get('/api/transactions/all');
        return response.data;
    },

    // Update payment status (admin only)
    updatePaymentStatus: async (transactionId, status) => {
        const response = await api.put(`/api/transactions/${transactionId}/payment-status?status=${status}`);
        return response.data;
    }
};

export default transactionService;