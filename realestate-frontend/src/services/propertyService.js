import api from './api';

const propertyService = {
  // Get all properties
  getAllProperties: async () => {
    try {
      console.log('Fetching properties from API...');
      const response = await api.get('/api/properties');
      console.log('Properties response:', response.data);
      
      // Log first property to check fields
      if (response.data && response.data.length > 0) {
        console.log('Sample property fields:', {
          title: response.data[0].title,
          fullAddress: response.data[0].fullAddress,
          contactNumber: response.data[0].contactNumber
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    try {
      console.log('Creating property with data:', propertyData);
      const response = await api.post('/api/properties', propertyData);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      console.log('Updating property:', id, propertyData);
      const response = await api.put(`/api/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/api/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};

export default propertyService;