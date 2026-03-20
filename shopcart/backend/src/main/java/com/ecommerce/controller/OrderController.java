package com.ecommerce.controller;

import com.ecommerce.dto.request.OrderStatusRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.model.enums.PaymentMethod;
import com.ecommerce.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/api/orders")
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestParam String addressJson,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String transactionId,
            @RequestParam(required = false) MultipartFile paymentScreenshot) {
        PaymentMethod method = PaymentMethod.valueOf(paymentMethod.toUpperCase());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(addressJson, method, transactionId, paymentScreenshot));
    }

    @GetMapping("/api/orders/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping("/api/orders/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/api/admin/orders/pending-payment")
    public ResponseEntity<List<OrderResponse>> getPendingPaymentOrders() {
        return ResponseEntity.ok(orderService.getPendingPaymentOrders());
    }

    @PostMapping("/api/admin/orders/{id}/approve-payment")
    public ResponseEntity<OrderResponse> approvePayment(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.approvePayment(id));
    }

    @PostMapping("/api/admin/orders/{id}/reject-payment")
    public ResponseEntity<OrderResponse> rejectPayment(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.rejectPayment(id));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }
}