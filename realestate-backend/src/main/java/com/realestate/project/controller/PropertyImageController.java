package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.realestate.project.service.PropertyImageService;
import com.realestate.project.dto.PropertyImageRequest;
import com.realestate.project.dto.PropertyImageResponse;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyImageController {

    private final PropertyImageService propertyImageService;

    public PropertyImageController(PropertyImageService propertyImageService) {
        this.propertyImageService = propertyImageService;
    }

    @GetMapping("/{propertyId}/images")
    public ResponseEntity<List<PropertyImageResponse>> getPropertyImages(@PathVariable Long propertyId) {
        List<PropertyImageResponse> images = propertyImageService.getPropertyImages(propertyId);
        return ResponseEntity.ok(images);
    }

    @PostMapping("/{propertyId}/images")
    public ResponseEntity<PropertyImageResponse> addImage(
            @PathVariable Long propertyId,
            @RequestBody PropertyImageRequest request,
            Authentication authentication) {
        
        String email = authentication.getName();
        PropertyImageResponse response = propertyImageService.addImage(propertyId, request, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{propertyId}/images/bulk")
    public ResponseEntity<List<PropertyImageResponse>> addMultipleImages(
            @PathVariable Long propertyId,
            @RequestBody List<PropertyImageRequest> requests,
            Authentication authentication) {
        
        String email = authentication.getName();
        List<PropertyImageResponse> responses = propertyImageService.addMultipleImages(propertyId, requests, email);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long imageId,
            Authentication authentication) {
        
        String email = authentication.getName();
        propertyImageService.deleteImage(imageId, email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/images/{imageId}/primary")
    public ResponseEntity<PropertyImageResponse> setPrimaryImage(
            @PathVariable Long imageId,
            Authentication authentication) {
        
        String email = authentication.getName();
        PropertyImageResponse response = propertyImageService.setPrimaryImage(imageId, email);
        return ResponseEntity.ok(response);
    }
}