package com.realestate.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.realestate.project.repository.UserRepository;
import com.realestate.project.repository.RoleRepository;
import com.realestate.project.entity.User;
import com.realestate.project.entity.Role;
import com.realestate.project.dto.RegisterRequest;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection
    public AuthService(UserRepository userRepository, 
                      RoleRepository roleRepository, 
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public String register(RegisterRequest request) {
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Get default role (ROLE_USER)
        Role role = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found. Please initialize roles."));

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setIsActive(true);

        // Save user
        userRepository.save(user);

        return "User registered successfully";
    }
}