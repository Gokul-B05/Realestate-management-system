package com.realestate.project.dto;

import java.time.LocalDateTime;

public class SaleRequest {
    private Long propertyId;
    private Long buyerId;
    private Double salePrice;
    private String paymentMethod;
    private LocalDateTime saleDate;

    // Constructors
    public SaleRequest() {}

    public SaleRequest(Long propertyId, Long buyerId, Double salePrice, String paymentMethod, LocalDateTime saleDate) {
        this.propertyId = propertyId;
        this.buyerId = buyerId;
        this.salePrice = salePrice;
        this.paymentMethod = paymentMethod;
        this.saleDate = saleDate;
    }

    // Getters and Setters
    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public Double getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(Double salePrice) {
        this.salePrice = salePrice;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }
}