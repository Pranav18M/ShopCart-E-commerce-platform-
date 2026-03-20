package com.ecommerce.dto.response;

import java.math.BigDecimal;

public class SellerStatsResponse {
    private long totalProducts;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;

    public SellerStatsResponse() {}
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long v) { this.totalProducts = v; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long v) { this.totalOrders = v; }
    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long v) { this.pendingOrders = v; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal v) { this.totalRevenue = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private SellerStatsResponse r = new SellerStatsResponse();
        public Builder totalProducts(long v) { r.totalProducts = v; return this; }
        public Builder totalOrders(long v) { r.totalOrders = v; return this; }
        public Builder pendingOrders(long v) { r.pendingOrders = v; return this; }
        public Builder totalRevenue(BigDecimal v) { r.totalRevenue = v; return this; }
        public SellerStatsResponse build() { return r; }
    }
}