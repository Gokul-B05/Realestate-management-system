import api from './api';

const propertyImageService = {
  // Get all images for a property
  getPropertyImages: async (propertyId) => {
    try {
      console.log(`Fetching images for property ID: ${propertyId}`);
      const response = await api.get(`/api/properties/${propertyId}/images`);
      console.log('Images response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching property images:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  // Add single image
  addImage: async (propertyId, imageData) => {
    try {
      console.log('Adding image:', imageData);
      const response = await api.post(`/api/properties/${propertyId}/images`, imageData);
      return response.data;
    } catch (error) {
      console.error('Error adding image:', error);
      throw error;
    }
  },

  // Add multiple images
  addMultipleImages: async (propertyId, images) => {
    try {
      const response = await api.post(`/api/properties/${propertyId}/images/bulk`, images);
      return response.data;
    } catch (error) {
      console.error('Error adding multiple images:', error);
      throw error;
    }
  },

  // Delete image
  deleteImage: async (imageId) => {
    try {
      const response = await api.delete(`/api/properties/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Set primary image
  setPrimaryImage: async (imageId) => {
    try {
      const response = await api.put(`/api/properties/images/${imageId}/primary`);
      return response.data;
    } catch (error) {
      console.error('Error setting primary image:', error);
      throw error;
    }
  }
};

export default propertyImageService;