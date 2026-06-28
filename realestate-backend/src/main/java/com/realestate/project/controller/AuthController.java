package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.realestate.project.repository.UserRepository;
import com.realestate.project.entity.User;
import com.realestate.project.dto.LoginRequest;
import com.realestate.project.dto.LoginResponse;
import com.realestate.project.dto.RegisterRequest;
import com.realestate.project.service.JwtService;
import com.realestate.project.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthService authService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        
        // Log request details
        logger.info("========== LOGIN ATTEMPT ==========");
        logger.info("Email: {}", request.getEmail());
        logger.info("Password length: {}", request.getPassword() != null ? request.getPassword().length() : 0);
        logger.info("Content-Type: {}", httpRequest.getContentType());
        logger.info("Origin: {}", httpRequest.getHeader("Origin"));
        logger.info("User-Agent: {}", httpRequest.getHeader("User-Agent"));
        
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            logger.warn("Login failed: Email is empty");
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            logger.warn("Login failed: Password is empty");
            return ResponseEntity.badRequest().body("Password is required");
        }
        
        // Clean email (remove any whitespace)
        String cleanEmail = request.getEmail().trim();
        
        try {
            // Find user by email
            logger.info("Searching for user with email: {}", cleanEmail);
            User user = userRepository.findByEmail(cleanEmail).orElse(null);
            
            if (user == null) {
                logger.warn("User not found in database: {}", cleanEmail);
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            
            logger.info("User found in database:");
            logger.info(" - ID: {}", user.getId());
            logger.info(" - Email: {}", user.getEmail());
            logger.info(" - Name: {}", user.getName());
            logger.info(" - Role: {}", user.getRole() != null ? user.getRole().getName() : "null");
            logger.info(" - Is Active: {}", user.getIsActive());
            logger.info(" - Stored password hash: {}", user.getPassword());
            
            // Check if user is active
            if (user.getIsActive() == null || !user.getIsActive()) {
                logger.warn("User account is inactive: {}", cleanEmail);
                return ResponseEntity.status(401).body("Account is inactive");
            }
            
            // Check password
            logger.info("Verifying password...");
            boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            logger.info("Password matches: {}", matches);
            
            if (!matches) {
                logger.warn("Password verification failed for user: {}", cleanEmail);
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            
            // Generate JWT token
            logger.info("Password verified, generating JWT token...");
            String token = jwtService.generateToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().getName() : "ROLE_USER"
            );
            
            logger.info("Token generated successfully");
            logger.info("Token length: {}", token.length());
            logger.info("Login successful for: {}", cleanEmail);
            logger.info("==================================");
            
            return ResponseEntity.ok(new LoginResponse(token));
            
        } catch (Exception e) {
            logger.error("Unexpected error during login: ", e);
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        
        logger.info("========== REGISTRATION ATTEMPT ==========");
        logger.info("Name: {}", request.getName());
        logger.info("Email: {}", request.getEmail());
        logger.info("Password length: {}", request.getPassword() != null ? request.getPassword().length() : 0);
        logger.info("Content-Type: {}", httpRequest.getContentType());
        
        try {
            // Validate input
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }
            
            // Clean data
            String cleanEmail = request.getEmail().trim();
            String cleanName = request.getName().trim();
            
            // Update the request with cleaned data
            request.setEmail(cleanEmail);
            request.setName(cleanName);
            
            // Check if email already exists
            if (userRepository.existsByEmail(cleanEmail)) {
                logger.warn("Registration failed - Email already exists: {}", cleanEmail);
                return ResponseEntity.badRequest().body("Email already registered");
            }
            
            // Register user
            String result = authService.register(request);
            logger.info("Registration successful for: {}", cleanEmail);
            logger.info("==================================");
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("Registration error: ", e);
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("Auth controller is working");
    }
}