package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/test")
    public String adminTest() {
        return "Admin access granted";
    }
}
