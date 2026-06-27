package com.realestate.project.dto;

import java.util.List;

public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String location;
    private String fullAddress;
    private String contactNumber;
    private String propertyType;
    private Long userId;
    private String ownerEmail;
    private List<PropertyImageResponse> images;

    // Default constructor
    public PropertyResponse() {}

    // Constructor without images
    public PropertyResponse(Long id, String title, String description, Double price, 
                           String location, String fullAddress, String contactNumber,
                           String propertyType, Long userId, String ownerEmail) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.fullAddress = fullAddress;
        this.contactNumber = contactNumber;
        this.propertyType = propertyType;
        this.userId = userId;
        this.ownerEmail = ownerEmail;
    }

    // Constructor with images
    public PropertyResponse(Long id, String title, String description, Double price, 
                           String location, String fullAddress, String contactNumber,
                           String propertyType, Long userId, String ownerEmail, 
                           List<PropertyImageResponse> images) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.fullAddress = fullAddress;
        this.contactNumber = contactNumber;
        this.propertyType = propertyType;
        this.userId = userId;
        this.ownerEmail = ownerEmail;
        this.images = images;
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

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public List<PropertyImageResponse> getImages() {
        return images;
    }

    public void setImages(List<PropertyImageResponse> images) {
        this.images = images;
    }
}