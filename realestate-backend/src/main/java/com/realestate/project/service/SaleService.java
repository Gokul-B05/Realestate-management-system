package com.realestate.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.realestate.project.entity.*;
import com.realestate.project.repository.*;
import com.realestate.project.dto.SaleRequest;
import com.realestate.project.dto.SaleResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleService {

    private static final Logger logger = LoggerFactory.getLogger(SaleService.class);
    
    private final SaleRepository saleRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public SaleService(SaleRepository saleRepository,
                      PropertyRepository propertyRepository,
                      UserRepository userRepository) {
        this.saleRepository = saleRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SaleResponse completeSale(SaleRequest request, String adminEmail) {
        logger.info("========== COMPLETING SALE ==========");
        logger.info("Property ID: {}", request.getPropertyId());
        logger.info("Buyer ID: {}", request.getBuyerId());
        logger.info("Sale Price: {}", request.getSalePrice());
        logger.info("Payment Method: {}", request.getPaymentMethod());
        logger.info("Admin Email: {}", adminEmail);
        
        try {
            // Validate request
            if (request.getPropertyId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property ID is required");
            }
            
            if (request.getBuyerId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Buyer ID is required");
            }
            
            // Check if property exists
            Property property = propertyRepository.findById(request.getPropertyId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found with ID: " + request.getPropertyId()));
            
            logger.info("Property found: {} (Owner: {})", property.getTitle(), property.getUser().getEmail());
            
            // Check if property is already sold
            if (saleRepository.existsByPropertyId(request.getPropertyId())) {
                logger.warn("Property ID {} is already sold", request.getPropertyId());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property is already sold");
            }
            
            // Get seller (current property owner)
            User seller = property.getUser();
            if (seller == null) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Property has no owner");
            }
            logger.info("Seller: {} ({})", seller.getName(), seller.getEmail());
            
            // Get buyer
            User buyer = userRepository.findById(request.getBuyerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found with ID: " + request.getBuyerId()));
            logger.info("Buyer: {} ({})", buyer.getName(), buyer.getEmail());
            
            // Get admin (person processing the sale)
            User admin = userRepository.findByEmail(adminEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found with email: " + adminEmail));
            
            // Verify admin role
            if (admin.getRole() == null || !admin.getRole().getName().equals("ROLE_ADMIN")) {
                logger.warn("User {} is not an admin", adminEmail);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can complete sales");
            }
            logger.info("Admin verified: {}", admin.getEmail());
            
            // Create sale record
            Sale sale = new Sale();
            sale.setProperty(property);
            sale.setSeller(seller);
            sale.setBuyer(buyer);
            sale.setSalePrice(request.getSalePrice() != null ? request.getSalePrice() : property.getPrice());
            sale.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "BANK_TRANSFER");
            sale.setSaleDate(request.getSaleDate() != null ? request.getSaleDate() : LocalDateTime.now());
            sale.setStatus(SaleStatus.COMPLETED);
            
            logger.info("Sale record created");
            
            // Update property status
            property.setStatus(PropertyStatus.SOLD);
            propertyRepository.save(property);
            logger.info("Property status updated to SOLD");
            
            // Save sale
            Sale savedSale = saleRepository.save(sale);
            logger.info("Sale completed successfully with ID: {}", savedSale.getId());
            logger.info("========== SALE COMPLETED ==========");
            
            return mapToResponse(savedSale);
            
        } catch (ResponseStatusException e) {
            logger.error("Sale completion failed: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during sale completion: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error completing sale: " + e.getMessage());
        }
    }

    public List<SaleResponse> getMyPurchases(String email) {
        logger.info("Fetching purchases for user: {}", email);
        
        try {
            User buyer = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with email: " + email));
            
            List<Sale> purchases = saleRepository.findByBuyerId(buyer.getId());
            logger.info("Found {} purchases for user {}", purchases.size(), email);
            
            return purchases.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
                    
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching purchases: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching purchases");
        }
    }

    public List<SaleResponse> getMySales(String email) {
        logger.info("Fetching sales for user: {}", email);
        
        try {
            User seller = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with email: " + email));
            
            List<Sale> sales = saleRepository.findBySellerId(seller.getId());
            logger.info("Found {} sales for user {}", sales.size(), email);
            
            return sales.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
                    
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching sales: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching sales");
        }
    }

    public SaleResponse getSaleByProperty(Long propertyId) {
        logger.info("Fetching sale for property ID: {}", propertyId);
        
        try {
            return saleRepository.findByPropertyId(propertyId)
                    .map(this::mapToResponse)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No sale found for property ID: " + propertyId));
                    
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching sale by property: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching sale");
        }
    }

    public List<SaleResponse> getAllSales() {
        logger.info("Fetching all sales");
        
        try {
            List<Sale> sales = saleRepository.findAll();
            logger.info("Found {} total sales", sales.size());
            
            return sales.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("Error fetching all sales: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching sales");
        }
    }

    private SaleResponse mapToResponse(Sale sale) {
        if (sale == null) {
            return null;
        }
        
        SaleResponse response = new SaleResponse();
        
        try {
            response.setId(sale.getId());
            
            if (sale.getProperty() != null) {
                response.setPropertyId(sale.getProperty().getId());
                response.setPropertyTitle(sale.getProperty().getTitle());
            }
            
            if (sale.getSeller() != null) {
                response.setSellerId(sale.getSeller().getId());
                response.setSellerEmail(sale.getSeller().getEmail());
                response.setSellerName(sale.getSeller().getName());
            }
            
            if (sale.getBuyer() != null) {
                response.setBuyerId(sale.getBuyer().getId());
                response.setBuyerEmail(sale.getBuyer().getEmail());
                response.setBuyerName(sale.getBuyer().getName());
            }
            
            response.setSalePrice(sale.getSalePrice());
            response.setPaymentMethod(sale.getPaymentMethod());
            response.setSaleDate(sale.getSaleDate());
            
            if (sale.getStatus() != null) {
                response.setStatus(sale.getStatus().toString());
            }
            
        } catch (Exception e) {
            logger.error("Error mapping sale to response: ", e);
        }
        
        return response;
    }
}