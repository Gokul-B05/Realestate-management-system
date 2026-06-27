package com.realestate.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.realestate.project.entity.*;
import com.realestate.project.repository.*;
import com.realestate.project.dto.PropertyImageRequest;
import com.realestate.project.dto.PropertyImageResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyImageService {

    private final PropertyImageRepository propertyImageRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyImageService(PropertyImageRepository propertyImageRepository,
                                PropertyRepository propertyRepository,
                                UserRepository userRepository) {
        this.propertyImageRepository = propertyImageRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PropertyImageResponse addImage(Long propertyId, PropertyImageRequest request, String email) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Check if user is owner or admin
        if (!property.getUser().getId().equals(user.getId()) && 
            !user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to add images to this property");
        }

        // If this image is primary, remove primary status from others
        if (request.getIsPrimary()) {
            property.getImages().forEach(img -> img.setIsPrimary(false));
        }

        PropertyImage image = new PropertyImage();
        image.setImageUrl(request.getImageUrl());
        image.setIsPrimary(request.getIsPrimary());
        image.setProperty(property);

        PropertyImage saved = propertyImageRepository.save(image);
        return mapToResponse(saved);
    }

    @Transactional
    public List<PropertyImageResponse> addMultipleImages(Long propertyId, List<PropertyImageRequest> requests, String email) {
        return requests.stream()
                .map(request -> addImage(propertyId, request, email))
                .collect(Collectors.toList());
    }

    public List<PropertyImageResponse> getPropertyImages(Long propertyId) {
        return propertyImageRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteImage(Long imageId, String email) {
        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Check if user is owner or admin
        if (!image.getProperty().getUser().getId().equals(user.getId()) && 
            !user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this image");
        }

        propertyImageRepository.delete(image);
    }

    @Transactional
    public PropertyImageResponse setPrimaryImage(Long imageId, String email) {
        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Check if user is owner or admin
        if (!image.getProperty().getUser().getId().equals(user.getId()) && 
            !user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to modify this image");
        }

        // Remove primary status from all images of this property
        image.getProperty().getImages().forEach(img -> img.setIsPrimary(false));
        
        // Set this image as primary
        image.setIsPrimary(true);
        
        PropertyImage updated = propertyImageRepository.save(image);
        return mapToResponse(updated);
    }

    private PropertyImageResponse mapToResponse(PropertyImage image) {
        return new PropertyImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getIsPrimary(),
                image.getUploadDate().toString()
        );
    }
}