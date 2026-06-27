package com.realestate.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.realestate.project.entity.PaymentStatus;
import com.realestate.project.entity.Transaction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Find transactions by buyer
    List<Transaction> findByBuyerId(Long buyerId);
    
    // Find transactions by seller
    List<Transaction> findBySellerId(Long sellerId);
    
    // Find transaction by property (returns Optional because a property can only be sold once)
    Optional<Transaction> findByPropertyId(Long propertyId);
    
    // Find transactions within a date range
    List<Transaction> findByTransactionDateBetween(LocalDateTime start, LocalDateTime end);
    
    // Find transactions by payment status
    List<Transaction> findByPaymentStatus(PaymentStatus status);
}