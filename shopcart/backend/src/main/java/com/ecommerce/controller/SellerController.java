package com.ecommerce.controller;

import com.ecommerce.dto.response.SellerStatsResponse;
import com.ecommerce.dto.response.SubscriptionResponse;
import com.ecommerce.service.SellerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionResponse> requestSubscription(
            @RequestParam String transactionId,
            @RequestParam(required = false) MultipartFile screenshot) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sellerService.requestSubscription(transactionId, screenshot));
    }

    @GetMapping("/subscription-status")
    public ResponseEntity<SubscriptionResponse> getSubscriptionStatus() {
        SubscriptionResponse response = sellerService.getSubscriptionStatus();
        if (response == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<SellerStatsResponse> getStats() {
        return ResponseEntity.ok(sellerService.getSellerStats());
    }
}