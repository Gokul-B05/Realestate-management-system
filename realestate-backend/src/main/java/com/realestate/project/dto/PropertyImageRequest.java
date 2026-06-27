package com.realestate.project.dto;

public class PropertyImageRequest {
    private String imageUrl;
    private Boolean isPrimary;
    
    // Constructors
    public PropertyImageRequest() {}
    
    public PropertyImageRequest(String imageUrl, Boolean isPrimary) {
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
    }
    
    // Getters and Setters
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Boolean getIsPrimary() {
        return isPrimary;
    }
    
    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }
}