package com.realestate.project.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "properties")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private Double price;

    private String location;

    @Column(name = "full_address", length = 500)
    private String fullAddress;

    @Column(name = "contact_number", length = 50)
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
//    added
    @Enumerated(EnumType.STRING)
    private PropertyStatus status = PropertyStatus.AVAILABLE;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PropertyImage> images = new ArrayList<>();

    // Constructors
    public Property() {
        this.createdAt = LocalDateTime.now();
    }

    public Property(String title, String description, Double price, String location, 
                   String fullAddress, String contactNumber, PropertyType propertyType) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.fullAddress = fullAddress;
        this.contactNumber = contactNumber;
        this.propertyType = propertyType;
        this.createdAt = LocalDateTime.now();
        this.images = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<PropertyImage> getImages() {
        return images;
    }

    public void setImages(List<PropertyImage> images) {
        this.images = images;
    }

    // Helper methods
    public void addImage(PropertyImage image) {
        images.add(image);
        image.setProperty(this);
    }

    public void removeImage(PropertyImage image) {
        images.remove(image);
        image.setProperty(null);
    }
    
//    added
    public PropertyStatus getStatus() {
        return status;
    }

    public void setStatus(PropertyStatus status) {
        this.status = status;
    }
}