package com.ecommerce.repository;

import com.ecommerce.model.entity.SellerSubscription;
import com.ecommerce.model.entity.User;
import com.ecommerce.model.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerSubscriptionRepository extends JpaRepository<SellerSubscription, Long> {
    List<SellerSubscription> findByStatus(ApprovalStatus status);
    Optional<SellerSubscription> findTopByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndStatus(User user, ApprovalStatus status);
}
