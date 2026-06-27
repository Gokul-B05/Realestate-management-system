package com.realestate.project.dto;

public class TransactionRequest {
    private Long propertyId;
    private Double price;
    private String paymentMethod;
    
    // Constructors
    public TransactionRequest() {}
    
    // Getters and Setters
    public Long getPropertyId() {
        return propertyId;
    }
    
    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}