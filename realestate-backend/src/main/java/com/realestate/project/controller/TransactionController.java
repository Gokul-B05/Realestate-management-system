package com.realestate.project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import com.realestate.project.service.TransactionService;
import com.realestate.project.dto.TransactionRequest;
import com.realestate.project.dto.TransactionResponse;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody TransactionRequest request,
            Authentication authentication) {
        
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.createTransaction(request, email));
    }

    @GetMapping("/my-purchases")
    public ResponseEntity<List<TransactionResponse>> getMyPurchases(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.getBuyerTransactions(email));
    }

    @GetMapping("/my-sales")
    public ResponseEntity<List<TransactionResponse>> getMySales(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.getSellerTransactions(email));
    }

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransactionResponse> getPropertyTransaction(@PathVariable Long propertyId) {
        return ResponseEntity.ok(transactionService.getTransactionByProperty(propertyId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @transactionService.isParticipant(#id, authentication.name)")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }
}