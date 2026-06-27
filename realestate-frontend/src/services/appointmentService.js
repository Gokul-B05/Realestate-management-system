import api from './api';

const appointmentService = {
  // Create a new appointment request
  createAppointment: async (appointmentData) => {
    try {
      console.log('Creating appointment:', appointmentData);
      const response = await api.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Get all appointments for the logged-in user
  getMyAppointments: async () => {
    try {
      console.log('Fetching my appointments...');
      const response = await api.get('/api/appointments/my-appointments');
      console.log('My appointments:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching my appointments:', error);
      return [];
    }
  },

  // Get appointments for properties owned by the user
  getOwnerAppointments: async () => {
    try {
      console.log('Fetching owner appointments...');
      const response = await api.get('/api/appointments/owner');
      console.log('Owner appointments:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching owner appointments:', error);
      return [];
    }
  },

  // Get appointments for a specific property
  getPropertyAppointments: async (propertyId) => {
    try {
      const response = await api.get(`/api/appointments/property/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching property appointments:', error);
      return [];
    }
  },

  // Get all appointments (admin only)
  getAllAppointments: async () => {
    try {
      console.log('Fetching all appointments (admin)...');
      const response = await api.get('/api/appointments/all');
      console.log('All appointments:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      return [];
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      console.log(`Updating appointment ${appointmentId} to status: ${status}`);
      const response = await api.put(`/api/appointments/${appointmentId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    try {
      console.log(`Cancelling appointment: ${appointmentId}`);
      const response = await api.delete(`/api/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
};

export default appointmentService;