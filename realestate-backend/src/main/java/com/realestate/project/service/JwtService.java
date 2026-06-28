package com.realestate.project.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    private final String SECRET;
    private final long EXPIRATION = 1000 * 60 * 60; // 1 hour

    public JwtService() {
        String envSecret = System.getenv("JWT_SECRET");
        if (envSecret != null && envSecret.trim().length() >= 32) {
            this.SECRET = envSecret;
        } else {
            logger.warn("JWT_SECRET environment variable is missing or too short! Falling back to developer-only signature key. DO NOT USE IN PRODUCTION.");
            this.SECRET = "your-super-secret-key-your-super-secret-key-your-super-secret-key";
        }
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(Long userId, String email, String role) {
        logger.info("Generating token for user: {} with role: {}", email, role);
        
        String token = Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        
        logger.info("Token generated successfully");
        return token;
    }
    
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.warn("Token expired: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            logger.warn("Invalid token: {}", e.getMessage());
            throw e;
        }
    }
}