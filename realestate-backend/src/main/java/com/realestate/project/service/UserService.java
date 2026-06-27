package com.realestate.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.realestate.project.entity.User;
import com.realestate.project.repository.UserRepository;
import com.realestate.project.dto.UserResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users (admin only)
    public List<UserResponse> getAllUsers() {
        logger.info("Fetching all users");
        
        List<User> users = userRepository.findAll();
        
        return users.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get user by ID
    public UserResponse getUserById(Long id) {
        logger.info("Fetching user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return mapToResponse(user);
    }

    // Get user by email
    public UserResponse getUserByEmail(String email) {
        logger.info("Fetching user with email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return mapToResponse(user);
    }

    // Update user status (admin only)
    @Transactional
    public UserResponse updateUserStatus(Long id, Boolean isActive) {
        logger.info("Updating user status for ID: {} to active: {}", id, isActive);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        user.setIsActive(isActive);
        User updatedUser = userRepository.save(user);
        
        return mapToResponse(updatedUser);
    }

    // Search users by name or email (admin only)
    public List<UserResponse> searchUsers(String keyword) {
        logger.info("Searching users with keyword: {}", keyword);
        
        // This is a simple implementation - you might want to add a custom query in the repository
        List<User> users = userRepository.findAll();
        
        return users.stream()
                .filter(user -> 
                    user.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                    user.getEmail().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Map User entity to UserResponse DTO
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole() != null ? user.getRole().getName() : null,
            user.getIsActive()
        );
    }
}