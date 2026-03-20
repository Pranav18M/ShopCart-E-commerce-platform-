package com.ecommerce.dto.response;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String sellerName;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer quantity;
    private Integer stock;

    public CartItemResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private CartItemResponse r = new CartItemResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder productId(Long v) { r.productId = v; return this; }
        public Builder productName(String v) { r.productName = v; return this; }
        public Builder sellerName(String v) { r.sellerName = v; return this; }
        public Builder imageUrl(String v) { r.imageUrl = v; return this; }
        public Builder price(BigDecimal v) { r.price = v; return this; }
        public Builder originalPrice(BigDecimal v) { r.originalPrice = v; return this; }
        public Builder quantity(Integer v) { r.quantity = v; return this; }
        public Builder stock(Integer v) { r.stock = v; return this; }
        public CartItemResponse build() { return r; }
    }
}