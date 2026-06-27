package com.realestate.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.realestate.project.entity.*;
import com.realestate.project.repository.*;
import com.realestate.project.dto.TransactionRequest;
import com.realestate.project.dto.TransactionResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              PropertyRepository propertyRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, String adminEmail) {
        // Find property
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

        // Check if property is already sold - FIXED: using Optional now
        Optional<Transaction> existingTransaction = transactionRepository.findByPropertyId(request.getPropertyId());
        if (existingTransaction.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property already sold");
        }

        // Get seller (current property owner)
        User seller = property.getUser();
        
        // Get admin (person creating the transaction)
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        // Verify that the user is actually an admin
        if (!admin.getRole().getName().equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can create transactions");
        }

        // Create new transaction
        Transaction transaction = new Transaction();
        transaction.setProperty(property);
        transaction.setBuyer(admin); // Admin is facilitating the sale
        transaction.setSeller(seller);
        transaction.setPrice(request.getPrice() != null ? request.getPrice() : property.getPrice());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setPaymentStatus(PaymentStatus.COMPLETED);
        transaction.setTransactionDate(LocalDateTime.now());

        // Save transaction
        Transaction saved = transactionRepository.save(transaction);
        
        // Optional: Mark property as sold (you'll need to add a status field to Property entity)
        // property.setStatus(PropertyStatus.SOLD);
        // propertyRepository.save(property);
        
        return mapToResponse(saved);
    }

    public List<TransactionResponse> getBuyerTransactions(String email) {
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return transactionRepository.findByBuyerId(buyer.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getSellerTransactions(String email) {
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return transactionRepository.findBySellerId(seller.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TransactionResponse getTransactionByProperty(Long propertyId) {
        return transactionRepository.findByPropertyId(propertyId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "No transaction found for this property"));
    }

    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        
        return mapToResponse(transaction);
    }

    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse updatePaymentStatus(Long transactionId, PaymentStatus status, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        if (!admin.getRole().getName().equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can update payment status");
        }

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        transaction.setPaymentStatus(status);
        Transaction updated = transactionRepository.save(transaction);
        
        return mapToResponse(updated);
    }

    public boolean isParticipant(Long transactionId, String email) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        
        return transaction.getBuyer().getEmail().equals(email) || 
               transaction.getSeller().getEmail().equals(email);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setPropertyId(transaction.getProperty().getId());
        response.setPropertyTitle(transaction.getProperty().getTitle());
        response.setBuyerId(transaction.getBuyer().getId());
        response.setBuyerEmail(transaction.getBuyer().getEmail());
        response.setBuyerName(transaction.getBuyer().getName());
        response.setSellerId(transaction.getSeller().getId());
        response.setSellerEmail(transaction.getSeller().getEmail());
        response.setSellerName(transaction.getSeller().getName());
        response.setPrice(transaction.getPrice());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setPaymentStatus(transaction.getPaymentStatus().toString());
        response.setPaymentMethod(transaction.getPaymentMethod());
        return response;
    }
}