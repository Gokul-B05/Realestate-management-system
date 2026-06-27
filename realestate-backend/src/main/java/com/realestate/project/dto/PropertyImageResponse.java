package com.realestate.project.dto;

public class PropertyImageResponse {
    private Long id;
    private String imageUrl;
    private Boolean isPrimary;
    private String uploadDate;
    
    public PropertyImageResponse() {}
    
    public PropertyImageResponse(Long id, String imageUrl, Boolean isPrimary, String uploadDate) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.uploadDate = uploadDate;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(String uploadDate) {
        this.uploadDate = uploadDate;
    }
}