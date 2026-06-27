package com.realestate.project.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.realestate.project.repository.UserRepository;
import com.realestate.project.entity.User;

@Component("userSecurity")
public class UserSecurity {
    
    private final UserRepository userRepository;

    public UserSecurity(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Checks if the authenticated user's ID matches the provided userId
     * Used in @PreAuthorize annotations like: @PreAuthorize("@userSecurity.isCurrentUser(#id)")
     */
    public boolean isCurrentUser(Long userId) {
        // Get the currently authenticated user from Spring Security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        String currentUserEmail = authentication.getName();
        
        // Find user by email using the email from authentication
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
        
        if (currentUser == null) {
            return false;
        }
        
        // Check if the user ID matches
        return currentUser.getId().equals(userId);
    }
    
    /**
     * Checks if the authenticated user's email matches the provided email
     */
    public boolean isCurrentUserByEmail(String email) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        String currentUserEmail = authentication.getName();
        return currentUserEmail.equals(email);
    }
    
    /**
     * Checks if the authenticated user is the owner of a property
     */
    public boolean isPropertyOwner(Long propertyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        String currentUserEmail = authentication.getName();
        
        // Find the current user
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
        
        if (currentUser == null) {
            return false;
        }
        
        // You would need to inject PropertyRepository and check ownership
        // This is a placeholder - implement based on your needs
        // Example: return propertyRepository.findById(propertyId)
        //              .map(property -> property.getUser().getId().equals(currentUser.getId()))
        //              .orElse(false);
        
        return true; // Placeholder - replace with actual implementation
    }
    
    /**
     * Gets the current authenticated user's ID
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        String currentUserEmail = authentication.getName();
        
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
        
        return currentUser != null ? currentUser.getId() : null;
    }
    
    /**
     * Gets the current authenticated user's email
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        return authentication.getName();
    }
}