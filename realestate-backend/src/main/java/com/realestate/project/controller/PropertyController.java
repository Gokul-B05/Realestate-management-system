package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;

import java.util.List;

import com.realestate.project.service.PropertyService;
import com.realestate.project.dto.PropertyRequest;
import com.realestate.project.dto.PropertyResponse;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(
            @RequestBody PropertyRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        PropertyResponse response =
                propertyService.createProperty(request, email);

        return ResponseEntity.ok(response);
    }

    // ================= GET ALL =================
    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAll() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        PropertyResponse response =
                propertyService.updateProperty(id, request, email);

        return ResponseEntity.ok(response);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        propertyService.deleteProperty(id, email);

        return ResponseEntity.noContent().build();
    }
}
