package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.realestate.project.service.AppointmentService;
import com.realestate.project.dto.AppointmentRequest;
import com.realestate.project.dto.AppointmentResponse;
import com.realestate.project.entity.AppointmentStatus;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<?> requestAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication) {
        
        try {
            logger.info("Creating appointment for property: {}", request.getPropertyId());
            String email = authentication.getName();
            AppointmentResponse response = appointmentService.createAppointment(request, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating appointment: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<?> getMyAppointments(Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Fetching appointments for user: {}", email);
            List<AppointmentResponse> appointments = appointmentService.getUserAppointments(email);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            logger.error("Error fetching user appointments: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("hasRole('ADMIN') or @appointmentService.isPropertyOwner(#propertyId, authentication.name)")
    public ResponseEntity<?> getPropertyAppointments(@PathVariable Long propertyId, Authentication authentication) {
        try {
            logger.info("Fetching appointments for property: {}", propertyId);
            List<AppointmentResponse> appointments = appointmentService.getPropertyAppointments(propertyId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            logger.error("Error fetching property appointments: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/owner")
    public ResponseEntity<?> getOwnerAppointments(Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Fetching owner appointments for: {}", email);
            List<AppointmentResponse> appointments = appointmentService.getOwnerAppointments(email);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            logger.error("Error fetching owner appointments: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or @appointmentService.isPropertyOwner(#id, authentication.name)")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            Authentication authentication) {
        
        try {
            logger.info("Updating appointment {} status to: {}", id, status);
            AppointmentResponse response = appointmentService.updateAppointmentStatus(id, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating appointment status: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @appointmentService.isAppointmentOwner(#id, authentication.name)")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Cancelling appointment: {}", id);
            appointmentService.cancelAppointment(id);
            return ResponseEntity.ok("Appointment cancelled successfully");
        } catch (Exception e) {
            logger.error("Error cancelling appointment: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllAppointments() {
        try {
            logger.info("Fetching all appointments (admin)");
            List<AppointmentResponse> appointments = appointmentService.getAllAppointments();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            logger.error("Error fetching all appointments: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}