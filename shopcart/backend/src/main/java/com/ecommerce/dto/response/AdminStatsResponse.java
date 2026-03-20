package com.ecommerce.dto.response;

import java.math.BigDecimal;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalSellers;
    private long totalProducts;
    private long totalOrders;
    private long pendingPayments;
    private long pendingSubscriptions;
    private BigDecimal totalRevenue;

    public AdminStatsResponse() {}
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long v) { this.totalUsers = v; }
    public long getTotalSellers() { return totalSellers; }
    public void setTotalSellers(long v) { this.totalSellers = v; }
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long v) { this.totalProducts = v; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long v) { this.totalOrders = v; }
    public long getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(long v) { this.pendingPayments = v; }
    public long getPendingSubscriptions() { return pendingSubscriptions; }
    public void setPendingSubscriptions(long v) { this.pendingSubscriptions = v; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal v) { this.totalRevenue = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private AdminStatsResponse r = new AdminStatsResponse();
        public Builder totalUsers(long v) { r.totalUsers = v; return this; }
        public Builder totalSellers(long v) { r.totalSellers = v; return this; }
        public Builder totalProducts(long v) { r.totalProducts = v; return this; }
        public Builder totalOrders(long v) { r.totalOrders = v; return this; }
        public Builder pendingPayments(long v) { r.pendingPayments = v; return this; }
        public Builder pendingSubscriptions(long v) { r.pendingSubscriptions = v; return this; }
        public Builder totalRevenue(BigDecimal v) { r.totalRevenue = v; return this; }
        public AdminStatsResponse build() { return r; }
    }
}