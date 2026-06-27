package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.realestate.project.service.SaleService;
import com.realestate.project.dto.SaleRequest;
import com.realestate.project.dto.SaleResponse;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private static final Logger logger = LoggerFactory.getLogger(SaleController.class);
    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> completeSale(@RequestBody SaleRequest request, Authentication authentication) {
        try {
            logger.info("Processing sale completion request");
            String adminEmail = authentication.getName();
            SaleResponse response = saleService.completeSale(request, adminEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error completing sale: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-purchases")
    public ResponseEntity<?> getMyPurchases(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<SaleResponse> purchases = saleService.getMyPurchases(email);
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            logger.error("Error fetching purchases: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-sales")
    public ResponseEntity<?> getMySales(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<SaleResponse> sales = saleService.getMySales(email);
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            logger.error("Error fetching sales: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getSaleByProperty(@PathVariable Long propertyId) {
        try {
            SaleResponse sale = saleService.getSaleByProperty(propertyId);
            return ResponseEntity.ok(sale);
        } catch (Exception e) {
            logger.error("Error fetching sale: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllSales() {
        try {
            List<SaleResponse> sales = saleService.getAllSales();
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            logger.error("Error fetching all sales: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}