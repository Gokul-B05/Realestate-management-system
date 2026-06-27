package com.realestate.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.realestate.project.entity.Appointment;
import com.realestate.project.entity.AppointmentStatus;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Find appointments by user
    List<Appointment> findByUserId(Long userId);
    List<Appointment> findByUserIdOrderByScheduledTimeDesc(Long userId);
    
    // Find appointments by property
    List<Appointment> findByPropertyId(Long propertyId);
    List<Appointment> findByPropertyIdOrderByScheduledTimeDesc(Long propertyId);
    
    // Find appointments by property owner
    List<Appointment> findByProperty_User_Id(Long ownerId);
    List<Appointment> findByProperty_User_IdOrderByScheduledTimeDesc(Long ownerId);
    
    // Find appointments by status
    List<Appointment> findByStatus(AppointmentStatus status);
    
    // Find all appointments ordered by time
    List<Appointment> findAllByOrderByScheduledTimeDesc();
    
    // Check if appointment exists
    boolean existsByPropertyIdAndUserIdAndStatus(Long propertyId, Long userId, AppointmentStatus status);
}