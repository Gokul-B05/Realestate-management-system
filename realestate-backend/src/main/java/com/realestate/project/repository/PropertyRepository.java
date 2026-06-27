package com.realestate.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.realestate.project.entity.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}
