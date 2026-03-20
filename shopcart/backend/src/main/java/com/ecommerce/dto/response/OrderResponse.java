package com.ecommerce.dto.response;

import com.ecommerce.model.entity.DeliveryAddress;
import com.ecommerce.model.enums.OrderStatus;
import com.ecommerce.model.enums.PaymentMethod;
import com.ecommerce.model.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private List<OrderItemResponse> items;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private String paymentScreenshotUrl;
    private BigDecimal totalAmount;
    private BigDecimal deliveryCharge;
    private DeliveryAddress deliveryAddress;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getPaymentScreenshotUrl() { return paymentScreenshotUrl; }
    public void setPaymentScreenshotUrl(String v) { this.paymentScreenshotUrl = v; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }
    public DeliveryAddress getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(DeliveryAddress deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private OrderResponse r = new OrderResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder userId(Long v) { r.userId = v; return this; }
        public Builder userEmail(String v) { r.userEmail = v; return this; }
        public Builder userName(String v) { r.userName = v; return this; }
        public Builder items(List<OrderItemResponse> v) { r.items = v; return this; }
        public Builder status(OrderStatus v) { r.status = v; return this; }
        public Builder paymentMethod(PaymentMethod v) { r.paymentMethod = v; return this; }
        public Builder paymentStatus(PaymentStatus v) { r.paymentStatus = v; return this; }
        public Builder transactionId(String v) { r.transactionId = v; return this; }
        public Builder paymentScreenshotUrl(String v) { r.paymentScreenshotUrl = v; return this; }
        public Builder totalAmount(BigDecimal v) { r.totalAmount = v; return this; }
        public Builder deliveryCharge(BigDecimal v) { r.deliveryCharge = v; return this; }
        public Builder deliveryAddress(DeliveryAddress v) { r.deliveryAddress = v; return this; }
        public Builder adminNote(String v) { r.adminNote = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { r.updatedAt = v; return this; }
        public OrderResponse build() { return r; }
    }
}