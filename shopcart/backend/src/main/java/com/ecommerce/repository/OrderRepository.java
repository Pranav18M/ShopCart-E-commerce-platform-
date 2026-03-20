package com.ecommerce.repository;

import com.ecommerce.model.entity.Order;
import com.ecommerce.model.entity.User;
import com.ecommerce.model.enums.OrderStatus;
import com.ecommerce.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findByPaymentStatus(PaymentStatus paymentStatus);

    List<Order> findByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'VERIFIED'")
    BigDecimal getTotalRevenue();

    long countByPaymentStatus(PaymentStatus status);

    @Query("""
        SELECT o FROM Order o
        JOIN o.items i
        WHERE i.product.seller.id = :sellerId
    """)
    List<Order> findOrdersBySellerId(Long sellerId);

    @Query("""
        SELECT COALESCE(SUM(i.price * i.quantity), 0)
        FROM OrderItem i
        WHERE i.product.seller.id = :sellerId
        AND i.order.paymentStatus = 'VERIFIED'
    """)
    BigDecimal getRevenueForSeller(Long sellerId);
}
