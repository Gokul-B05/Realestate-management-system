package com.realestate.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.realestate.project.entity.*;
import com.realestate.project.repository.*;
import com.realestate.project.dto.AppointmentRequest;
import com.realestate.project.dto.AppointmentResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PropertyRepository propertyRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

        // Check if user is trying to book their own property
        if (property.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "You cannot schedule a visit for your own property");
        }

        // Check if user already has a pending appointment for this property
        if (appointmentRepository.existsByPropertyIdAndUserIdAndStatus(
                property.getId(), user.getId(), AppointmentStatus.PENDING)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "You already have a pending appointment for this property");
        }

        // Check if scheduled time is in the future
        if (request.getScheduledTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Scheduled time must be in the future");
        }

        Appointment appointment = new Appointment();
        appointment.setProperty(property);
        appointment.setUser(user);
        appointment.setScheduledTime(request.getScheduledTime());
        appointment.setMessage(request.getMessage());
        appointment.setContactPhone(request.getContactPhone());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setRequestDate(LocalDateTime.now());

        Appointment saved = appointmentRepository.save(appointment);
        return mapToResponse(saved);
    }

    public List<AppointmentResponse> getUserAppointments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return appointmentRepository.findByUserIdOrderByScheduledTimeDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getPropertyAppointments(Long propertyId) {
        return appointmentRepository.findByPropertyIdOrderByScheduledTimeDesc(propertyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getOwnerAppointments(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return appointmentRepository.findByProperty_User_IdOrderByScheduledTimeDesc(owner.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAllByOrderByScheduledTimeDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        appointment.setStatus(status);
        Appointment updated = appointmentRepository.save(appointment);
        return mapToResponse(updated);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public boolean isPropertyOwner(Long appointmentId, String email) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
        
        return appointment.getProperty().getUser().getEmail().equals(email);
    }

    public boolean isPropertyOwnerByPropertyId(Long propertyId, String email) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
        
        return property.getUser().getEmail().equals(email);
    }

    public boolean isAppointmentOwner(Long appointmentId, String email) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
        
        return appointment.getUser().getEmail().equals(email);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setPropertyId(appointment.getProperty().getId());
        response.setPropertyTitle(appointment.getProperty().getTitle());
        response.setUserId(appointment.getUser().getId());
        response.setUserEmail(appointment.getUser().getEmail());
        response.setUserName(appointment.getUser().getName());
        response.setScheduledTime(appointment.getScheduledTime());
        response.setStatus(appointment.getStatus().toString());
        response.setRequestDate(appointment.getRequestDate());
        response.setMessage(appointment.getMessage());
        response.setContactPhone(appointment.getContactPhone());
        return response;
    }
}