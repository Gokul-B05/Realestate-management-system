package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.realestate.project.service.UserService;
import com.realestate.project.dto.UserResponse;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            logger.info("Fetching all users");
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching users: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            logger.info("Fetching user with ID: {}", id);
            UserResponse user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error fetching user: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or #email == authentication.name")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            logger.info("Fetching user with email: {}", email);
            UserResponse user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error fetching user: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam Boolean isActive) {
        try {
            logger.info("Updating user status for ID: {}", id);
            UserResponse user = userService.updateUserStatus(id, isActive);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error updating user status: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchUsers(@RequestParam String keyword) {
        try {
            logger.info("Searching users with keyword: {}", keyword);
            List<UserResponse> users = userService.searchUsers(keyword);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error searching users: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}