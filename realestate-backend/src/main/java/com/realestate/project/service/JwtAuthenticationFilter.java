package com.realestate.project.service;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Skip filter for login and register endpoints
        return path.startsWith("/api/auth/") || path.startsWith("/api/test/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Log the request
        System.out.println("JwtAuthenticationFilter processing: " + request.getMethod() + " " + request.getRequestURI());

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("No Bearer token found - continuing filter chain");
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        System.out.println("Token found: " + token.substring(0, Math.min(20, token.length())) + "...");

        try {
            Claims claims = jwtService.extractAllClaims(token);

            String email = claims.getSubject();
            String role = claims.get("role", String.class);

            System.out.println("Token validated for user: " + email + " with role: " + role);

            if (email == null || role == null) {
                System.out.println("Email or role is null in token");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(
                                        new SimpleGrantedAuthority(role)
                                )
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
                System.out.println("Authentication set in security context");
            }

        } catch (Exception ex) {
            System.out.println("Token validation failed: " + ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}