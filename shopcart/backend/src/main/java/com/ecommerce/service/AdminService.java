package com.ecommerce.service;

import com.ecommerce.dto.response.AdminStatsResponse;
import com.ecommerce.dto.response.SubscriptionResponse;
import com.ecommerce.dto.response.UserResponse;

import java.util.List;

public interface AdminService {
    AdminStatsResponse getStats();
    List<UserResponse> getAllUsers();
    List<SubscriptionResponse> getPendingSubscriptions();
    List<SubscriptionResponse> getAllSubscriptions();
    SubscriptionResponse approveSubscription(Long id);
    SubscriptionResponse rejectSubscription(Long id);
}
