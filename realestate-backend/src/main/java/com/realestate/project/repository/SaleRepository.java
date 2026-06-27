package com.realestate.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.realestate.project.entity.Sale;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findByPropertyId(Long propertyId);
    List<Sale> findBySellerId(Long sellerId);
    List<Sale> findByBuyerId(Long buyerId);
    boolean existsByPropertyId(Long propertyId);
}