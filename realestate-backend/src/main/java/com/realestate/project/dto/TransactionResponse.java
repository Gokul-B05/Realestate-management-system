package com.realestate.project.dto;

import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private Long buyerId;
    private String buyerEmail;
    private String buyerName;
    private Long sellerId;
    private String sellerEmail;
    private String sellerName;
    private Double price;
    private LocalDateTime transactionDate;
    private String paymentStatus;
    private String paymentMethod;
    
    // Default constructor
    public TransactionResponse() {}
    
    // Parameterized constructor
    public TransactionResponse(Long id, Long propertyId, String propertyTitle, 
                              Long buyerId, String buyerEmail, String buyerName,
                              Long sellerId, String sellerEmail, String sellerName,
                              Double price, LocalDateTime transactionDate, 
                              String paymentStatus, String paymentMethod) {
        this.id = id;
        this.propertyId = propertyId;
        this.propertyTitle = propertyTitle;
        this.buyerId = buyerId;
        this.buyerEmail = buyerEmail;
        this.buyerName = buyerName;
        this.sellerId = sellerId;
        this.sellerEmail = sellerEmail;
        this.sellerName = sellerName;
        this.price = price;
        this.transactionDate = transactionDate;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getPropertyId() {
        return propertyId;
    }
    
    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }
    
    public String getPropertyTitle() {
        return propertyTitle;
    }
    
    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }
    
    public Long getBuyerId() {
        return buyerId;
    }
    
    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }
    
    public String getBuyerEmail() {
        return buyerEmail;
    }
    
    public void setBuyerEmail(String buyerEmail) {
        this.buyerEmail = buyerEmail;
    }
    
    public String getBuyerName() {
        return buyerName;
    }
    
    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }
    
    public Long getSellerId() {
        return sellerId;
    }
    
    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }
    
    public String getSellerEmail() {
        return sellerEmail;
    }
    
    public void setSellerEmail(String sellerEmail) {
        this.sellerEmail = sellerEmail;
    }
    
    public String getSellerName() {
        return sellerName;
    }
    
    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public String getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}