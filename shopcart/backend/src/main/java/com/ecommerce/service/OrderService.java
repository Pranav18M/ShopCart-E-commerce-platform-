package com.ecommerce.service;

import com.ecommerce.dto.request.OrderStatusRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.model.enums.PaymentMethod;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(String addressJson, PaymentMethod paymentMethod,
                             String transactionId, MultipartFile screenshot);
    List<OrderResponse> getMyOrders();
    OrderResponse getOrderById(Long id);
    OrderResponse approvePayment(Long orderId);
    OrderResponse rejectPayment(Long orderId);
    OrderResponse updateOrderStatus(Long orderId, OrderStatusRequest request);
    List<OrderResponse> getPendingPaymentOrders();
    List<OrderResponse> getAllOrders();
    void cancelOrder(Long id);
}
