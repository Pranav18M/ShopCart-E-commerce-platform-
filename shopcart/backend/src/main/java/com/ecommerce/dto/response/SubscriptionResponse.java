package com.ecommerce.dto.response;

import com.ecommerce.model.enums.ApprovalStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SubscriptionResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String transactionId;
    private String screenshotUrl;
    private BigDecimal amount;
    private ApprovalStatus status;
    private String adminNote;
    private LocalDateTime createdAt;

    public SubscriptionResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getScreenshotUrl() { return screenshotUrl; }
    public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }
    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private SubscriptionResponse r = new SubscriptionResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder userId(Long v) { r.userId = v; return this; }
        public Builder userName(String v) { r.userName = v; return this; }
        public Builder userEmail(String v) { r.userEmail = v; return this; }
        public Builder transactionId(String v) { r.transactionId = v; return this; }
        public Builder screenshotUrl(String v) { r.screenshotUrl = v; return this; }
        public Builder amount(BigDecimal v) { r.amount = v; return this; }
        public Builder status(ApprovalStatus v) { r.status = v; return this; }
        public Builder adminNote(String v) { r.adminNote = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public SubscriptionResponse build() { return r; }
    }
}