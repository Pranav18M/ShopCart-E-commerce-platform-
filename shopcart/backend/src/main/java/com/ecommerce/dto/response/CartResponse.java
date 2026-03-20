package com.ecommerce.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;
    private int totalItems;

    public CartResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public int getTotalItems() { return totalItems; }
    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private CartResponse r = new CartResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder items(List<CartItemResponse> v) { r.items = v; return this; }
        public Builder totalAmount(BigDecimal v) { r.totalAmount = v; return this; }
        public Builder totalItems(int v) { r.totalItems = v; return this; }
        public CartResponse build() { return r; }
    }
}