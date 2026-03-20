package com.ecommerce.service.impl;

import com.ecommerce.dto.response.AdminStatsResponse;
import com.ecommerce.dto.response.SubscriptionResponse;
import com.ecommerce.dto.response.UserResponse;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.entity.SellerSubscription;
import com.ecommerce.model.entity.User;
import com.ecommerce.model.enums.ApprovalStatus;
import com.ecommerce.model.enums.PaymentStatus;
import com.ecommerce.model.enums.Role;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.SellerSubscriptionRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.AdminService;
import com.ecommerce.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SellerSubscriptionRepository subscriptionRepository;
    private final SecurityUtils securityUtils;

    public AdminServiceImpl(UserRepository userRepository,
                             ProductRepository productRepository,
                             OrderRepository orderRepository,
                             SellerSubscriptionRepository subscriptionRepository,
                             SecurityUtils securityUtils) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.securityUtils = securityUtils;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalUsers      = userRepository.countByRole(Role.USER);
        long totalSellers    = userRepository.countByRole(Role.SELLER);
        long totalProducts   = productRepository.countActiveApprovedProducts();
        long totalOrders     = orderRepository.count();
        long pendingPayments = orderRepository.countByPaymentStatus(PaymentStatus.PENDING);
        long pendingSubs     = subscriptionRepository.findByStatus(ApprovalStatus.PENDING).size();
        BigDecimal revenue   = orderRepository.getTotalRevenue();
        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalSellers(totalSellers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .pendingPayments(pendingPayments)
                .pendingSubscriptions(pendingSubs)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapUser).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getPendingSubscriptions() {
        return subscriptionRepository.findByStatus(ApprovalStatus.PENDING)
                .stream().map(this::mapSubscription).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAll()
                .stream().map(this::mapSubscription).collect(Collectors.toList());
    }

    @Override
    public SubscriptionResponse approveSubscription(Long id) {
        SellerSubscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", id));
        sub.setStatus(ApprovalStatus.APPROVED);
        sub.setApprovedAt(LocalDateTime.now());
        sub.setApprovedBy(securityUtils.getCurrentUserEmail());
        User user = sub.getUser();
        user.setRole(Role.SELLER);
        userRepository.save(user);
        return mapSubscription(subscriptionRepository.save(sub));
    }

    @Override
    public SubscriptionResponse rejectSubscription(Long id) {
        SellerSubscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", id));
        sub.setStatus(ApprovalStatus.REJECTED);
        return mapSubscription(subscriptionRepository.save(sub));
    }

    private UserResponse mapUser(User u) {
        return UserResponse.builder()
                .id(u.getId()).name(u.getName()).email(u.getEmail())
                .phone(u.getPhone()).role(u.getRole()).active(u.isActive())
                .createdAt(u.getCreatedAt()).build();
    }

    private SubscriptionResponse mapSubscription(SellerSubscription s) {
        return SubscriptionResponse.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .userName(s.getUser().getName())
                .userEmail(s.getUser().getEmail())
                .transactionId(s.getTransactionId())
                .screenshotUrl(s.getScreenshotUrl())
                .amount(s.getAmount())
                .status(s.getStatus())
                .adminNote(s.getAdminNote())
                .createdAt(s.getCreatedAt())
                .build();
    }
}