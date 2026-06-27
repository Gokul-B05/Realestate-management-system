package com.realestate.project.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "your-super-secret-key-your-super-secret-key-your-super-secret-key";
    private final long EXPIRATION = 1000 * 60 * 60; // 1 hour

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(Long userId, String email, String role) {
        System.out.println("Generating token for user: " + email + " with role: " + role);
        
        String token = Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        
        System.out.println("Token generated successfully");
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
            System.out.println("Token expired: " + e.getMessage());
            throw e;
        } catch (JwtException e) {
            System.out.println("Invalid token: " + e.getMessage());
            throw e;
        }
    }
}