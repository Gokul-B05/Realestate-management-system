package com.realestate.project.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    private Property property;
    
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;
    
    @Column(nullable = false)
    private Double salePrice;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "sale_date")
    private LocalDateTime saleDate;
    
    @Enumerated(EnumType.STRING)
    private SaleStatus status = SaleStatus.COMPLETED;

    // Constructors
    public Sale() {
        this.saleDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
        this.buyer = buyer;
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

    public SaleStatus getStatus() {
        return status;
    }

    public void setStatus(SaleStatus status) {
        this.status = status;
    }
}