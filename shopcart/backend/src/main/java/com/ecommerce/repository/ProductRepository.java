package com.ecommerce.repository;

import com.ecommerce.model.entity.Product;
import com.ecommerce.model.entity.User;
import com.ecommerce.model.enums.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySeller(User seller);

    List<Product> findByFeaturedTrueAndApprovalStatusAndActiveTrue(ApprovalStatus status);

    Page<Product> findByApprovalStatusAndActiveTrue(ApprovalStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "p.approvalStatus = com.ecommerce.model.enums.ApprovalStatus.APPROVED " +
           "AND p.active = true " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:category IS NULL OR p.category.name = :category) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> searchProducts(
        @Param("search") String search,
        @Param("category") String category,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );

    long countByApprovalStatus(ApprovalStatus status);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.approvalStatus = com.ecommerce.model.enums.ApprovalStatus.APPROVED AND p.active = true")
    long countActiveApprovedProducts();
}