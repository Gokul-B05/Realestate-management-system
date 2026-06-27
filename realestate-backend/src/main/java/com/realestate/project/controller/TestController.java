package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import com.realestate.project.repository.UserRepository;
import com.realestate.project.entity.User;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/verify-login")
    public ResponseEntity<?> verifyLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            response.put("error", "User not found");
            return ResponseEntity.ok(response);
        }
        
        boolean matches = passwordEncoder.matches(password, user.getPassword());
        
        response.put("email", email);
        response.put("userExists", true);
        response.put("passwordMatches", matches);
        response.put("storedHash", user.getPassword());
        response.put("inputPasswordLength", password.length());
        
        return ResponseEntity.ok(response);
    }
}