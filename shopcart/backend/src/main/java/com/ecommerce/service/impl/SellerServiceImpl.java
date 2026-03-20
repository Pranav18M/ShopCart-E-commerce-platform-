package com.ecommerce.service.impl;

import com.ecommerce.dto.response.SellerStatsResponse;
import com.ecommerce.dto.response.SubscriptionResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.model.entity.SellerSubscription;
import com.ecommerce.model.entity.User;
import com.ecommerce.model.enums.ApprovalStatus;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.SellerSubscriptionRepository;
import com.ecommerce.service.SellerService;
import com.ecommerce.utils.FileStorageUtil;
import com.ecommerce.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Service
@Transactional
public class SellerServiceImpl implements SellerService {

    private final SellerSubscriptionRepository subscriptionRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final FileStorageUtil fileStorageUtil;
    private final SecurityUtils securityUtils;

    public SellerServiceImpl(SellerSubscriptionRepository subscriptionRepository,
                              ProductRepository productRepository,
                              OrderRepository orderRepository,
                              FileStorageUtil fileStorageUtil,
                              SecurityUtils securityUtils) {
        this.subscriptionRepository = subscriptionRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.fileStorageUtil = fileStorageUtil;
        this.securityUtils = securityUtils;
    }

    @Override
    public SubscriptionResponse requestSubscription(String transactionId, MultipartFile screenshot) {
        User user = securityUtils.getCurrentUser();
        if (subscriptionRepository.existsByUserAndStatus(user, ApprovalStatus.PENDING)) {
            throw new BadRequestException("You already have a pending subscription request");
        }
        String screenshotUrl = null;
        if (screenshot != null && !screenshot.isEmpty()) {
            screenshotUrl = fileStorageUtil.saveFile(screenshot, "payments");
        }
        SellerSubscription subscription = new SellerSubscription();
        subscription.setUser(user);
        subscription.setTransactionId(transactionId);
        subscription.setScreenshotUrl(screenshotUrl);
        subscription.setAmount(BigDecimal.valueOf(399));
        subscription.setStatus(ApprovalStatus.PENDING);
        return mapToResponse(subscriptionRepository.save(subscription));
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionStatus() {
        User user = securityUtils.getCurrentUser();
        return subscriptionRepository.findTopByUserOrderByCreatedAtDesc(user)
                .map(this::mapToResponse).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public SellerStatsResponse getSellerStats() {
        User seller = securityUtils.getCurrentUser();
        long totalProducts = productRepository.findBySeller(seller).size();
        var sellerOrders = orderRepository.findOrdersBySellerId(seller.getId());
        long pendingOrders = sellerOrders.stream()
                .filter(o -> o.getStatus().name().contains("PENDING")).count();
        BigDecimal revenue = orderRepository.getRevenueForSeller(seller.getId());
        return SellerStatsResponse.builder()
                .totalProducts(totalProducts)
                .totalOrders(sellerOrders.size())
                .pendingOrders(pendingOrders)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .build();
    }

    private SubscriptionResponse mapToResponse(SellerSubscription s) {
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