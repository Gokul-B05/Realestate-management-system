package com.realestate.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.realestate.project.entity.PropertyImage;
import java.util.List;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    List<PropertyImage> findByPropertyId(Long propertyId);
    void deleteByPropertyId(Long propertyId);
}