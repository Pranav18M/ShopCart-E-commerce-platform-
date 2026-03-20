package com.ecommerce.model.entity;

import com.ecommerce.model.enums.ApprovalStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "seller_subscriptions")
public class SellerSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "transaction_id", nullable = false)
    private String transactionId;

    @Column(name = "screenshot_url")
    private String screenshotUrl;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal amount = BigDecimal.valueOf(399);

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    @Column(name = "admin_note")
    private String adminNote;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public SellerSubscription() {}
    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String v) { this.transactionId = v; }
    public String getScreenshotUrl() { return screenshotUrl; }
    public void setScreenshotUrl(String v) { this.screenshotUrl = v; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal v) { this.amount = v; }
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus v) { this.status = v; }
    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String v) { this.adminNote = v; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String v) { this.approvedBy = v; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime v) { this.approvedAt = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private SellerSubscription s = new SellerSubscription();
        public Builder user(User v) { s.user = v; return this; }
        public Builder transactionId(String v) { s.transactionId = v; return this; }
        public Builder screenshotUrl(String v) { s.screenshotUrl = v; return this; }
        public Builder amount(BigDecimal v) { s.amount = v; return this; }
        public Builder status(ApprovalStatus v) { s.status = v; return this; }
        public SellerSubscription build() { return s; }
    }
}