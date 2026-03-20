package com.ecommerce.service;

import com.ecommerce.dto.response.SellerStatsResponse;
import com.ecommerce.dto.response.SubscriptionResponse;
import org.springframework.web.multipart.MultipartFile;

public interface SellerService {
    SubscriptionResponse requestSubscription(String transactionId, MultipartFile screenshot);
    SubscriptionResponse getSubscriptionStatus();
    SellerStatsResponse getSellerStats();
}
