package com.realestate.project.dto;

import com.realestate.project.entity.PropertyType;

public class PropertyRequest {

    private String title;
    private String description;
    private Double price;
    private String location;
    private String fullAddress;
    private String contactNumber;
    private PropertyType propertyType;

    // Default constructor
    public PropertyRequest() {}

    // Parameterized constructor
    public PropertyRequest(String title, String description, Double price, String location, 
                          String fullAddress, String contactNumber, PropertyType propertyType) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.fullAddress = fullAddress;
        this.contactNumber = contactNumber;
        this.propertyType = propertyType;
    }

    // Getters and Setters
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
}