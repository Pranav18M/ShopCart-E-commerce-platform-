package com.ecommerce.controller;

import com.ecommerce.dto.response.AdminStatsResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.dto.response.SubscriptionResponse;
import com.ecommerce.dto.response.UserResponse;
import com.ecommerce.service.AdminService;
import com.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;

    public AdminController(AdminService adminService, ProductService productService) {
        this.adminService = adminService;
        this.productService = productService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions() {
        return ResponseEntity.ok(adminService.getAllSubscriptions());
    }

    @GetMapping("/subscriptions/pending")
    public ResponseEntity<List<SubscriptionResponse>> getPendingSubscriptions() {
        return ResponseEntity.ok(adminService.getPendingSubscriptions());
    }

    @PostMapping("/subscriptions/{id}/approve")
    public ResponseEntity<SubscriptionResponse> approveSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveSubscription(id));
    }

    @PostMapping("/subscriptions/{id}/reject")
    public ResponseEntity<SubscriptionResponse> rejectSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectSubscription(id));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @PostMapping("/products/{id}/approve")
    public ResponseEntity<ProductResponse> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.approveProduct(id));
    }

    @PostMapping("/products/{id}/reject")
    public ResponseEntity<ProductResponse> rejectProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.rejectProduct(id));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}