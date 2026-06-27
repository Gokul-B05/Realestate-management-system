package com.realestate.project.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_images")
public class PropertyImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnore
    private Property property;
    
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    
    @Column(name = "is_primary")
    private Boolean isPrimary = false;
    
    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
    
    // Constructors
    public PropertyImage() {
        this.uploadDate = LocalDateTime.now();
    }
    
    public PropertyImage(String imageUrl, Boolean isPrimary) {
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.uploadDate = LocalDateTime.now();
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
    
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}