package com.realestate.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.realestate.project.entity.*;
import com.realestate.project.repository.*;
import com.realestate.project.dto.PropertyRequest;
import com.realestate.project.dto.PropertyResponse;
import com.realestate.project.dto.PropertyImageResponse;

@Service
public class PropertyService {

    private static final Logger logger = LoggerFactory.getLogger(PropertyService.class);
    
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepository propertyRepository,
                           UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    // ================= CREATE =================
    @Transactional
    public PropertyResponse createProperty(PropertyRequest request, String email) {
        logger.info("Creating property for user: {}", email);
        logger.info("Property request data: title={}, price={}, location={}, fullAddress={}, contactNumber={}", 
                   request.getTitle(), request.getPrice(), request.getLocation(), 
                   request.getFullAddress(), request.getContactNumber());
        
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> 
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

            Property property = new Property();
            property.setTitle(request.getTitle());
            property.setDescription(request.getDescription());
            property.setPrice(request.getPrice());
            property.setLocation(request.getLocation());
            property.setFullAddress(request.getFullAddress());
            property.setContactNumber(request.getContactNumber());
            property.setPropertyType(request.getPropertyType());
            property.setCreatedAt(LocalDateTime.now());
            property.setUser(user);

            Property saved = propertyRepository.save(property);
            logger.info("Property created successfully with ID: {}", saved.getId());
            
            return mapToResponse(saved);
            
        } catch (Exception e) {
            logger.error("Error creating property: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating property: " + e.getMessage());
        }
    }

    // ================= GET ALL =================
    public List<PropertyResponse> getAllProperties() {
        logger.info("Fetching all properties");
        try {
            List<Property> properties = propertyRepository.findAll();
            logger.info("Found {} properties", properties.size());
            
            return properties.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("Error fetching properties: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching properties: " + e.getMessage());
        }
    }

    // ================= GET BY ID =================
    public PropertyResponse getPropertyById(Long id) {
        logger.info("Fetching property with ID: {}", id);
        
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> 
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Property not found"
                    ));
        return mapToResponse(property);
    }

    // ================= UPDATE =================
    @Transactional
    public PropertyResponse updateProperty(Long id,
                                           PropertyRequest request,
                                           String email) {
        logger.info("Updating property ID: {} for user: {}", id, email);
        logger.info("Update data: title={}, price={}, location={}, fullAddress={}, contactNumber={}", 
                   request.getTitle(), request.getPrice(), request.getLocation(), 
                   request.getFullAddress(), request.getContactNumber());
        
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> 
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Property not found"
                            ));

            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> 
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "User not found"
                            ));

            boolean isAdmin = currentUser.getRole().getName().equals("ROLE_ADMIN");
            boolean isOwner = property.getUser().getEmail().equals(email);

            if (!isAdmin && !isOwner) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You are not allowed to update this property"
                );
            }

            // Update all fields
            property.setTitle(request.getTitle());
            property.setDescription(request.getDescription());
            property.setPrice(request.getPrice());
            property.setLocation(request.getLocation());
            property.setFullAddress(request.getFullAddress());
            property.setContactNumber(request.getContactNumber());
            property.setPropertyType(request.getPropertyType());

            Property updated = propertyRepository.save(property);
            logger.info("Property updated successfully with ID: {}", updated.getId());
            
            return mapToResponse(updated);
            
        } catch (Exception e) {
            logger.error("Error updating property: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating property: " + e.getMessage());
        }
    }

    // ================= DELETE =================
    @Transactional
    public void deleteProperty(Long id, String email) {
        logger.info("Deleting property ID: {} for user: {}", id, email);
        
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> 
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Property not found"
                            ));

            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> 
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "User not found"
                            ));

            boolean isAdmin = currentUser.getRole().getName().equals("ROLE_ADMIN");
            boolean isOwner = property.getUser().getEmail().equals(email);

            if (!isAdmin && !isOwner) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You are not allowed to delete this property"
                );
            }

            propertyRepository.delete(property);
            logger.info("Property deleted successfully with ID: {}", id);
            
        } catch (Exception e) {
            logger.error("Error deleting property: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting property: " + e.getMessage());
        }
    }

    // ================= MAPPER =================
    private PropertyResponse mapToResponse(Property property) {
        PropertyResponse response = new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getPrice(),
                property.getLocation(),
                property.getFullAddress(),
                property.getContactNumber(),
                property.getPropertyType() != null ? property.getPropertyType().name() : null,
                property.getUser() != null ? property.getUser().getId() : null,
                property.getUser() != null ? property.getUser().getEmail() : null
        );

        // Map images if they exist
        if (property.getImages() != null && !property.getImages().isEmpty()) {
            List<PropertyImageResponse> imageResponses = property.getImages().stream()
                    .map(image -> new PropertyImageResponse(
                            image.getId(),
                            image.getImageUrl(),
                            image.getIsPrimary(),
                            image.getUploadDate() != null ? image.getUploadDate().toString() : null
                    ))
                    .collect(Collectors.toList());
            response.setImages(imageResponses);
        }

        return response;
    }
}