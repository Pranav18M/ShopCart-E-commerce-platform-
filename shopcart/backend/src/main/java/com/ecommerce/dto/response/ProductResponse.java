package com.ecommerce.dto.response;

import com.ecommerce.model.enums.ApprovalStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stock;
    private Double rating;
    private Integer reviewCount;
    private List<String> images;
    private Long categoryId;
    private String categoryName;
    private Long sellerId;
    private String sellerName;
    private ApprovalStatus approvalStatus;
    private boolean featured;
    private LocalDateTime createdAt;

    public ProductResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal v) { this.originalPrice = v; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus v) { this.approvalStatus = v; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private ProductResponse r = new ProductResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder name(String v) { r.name = v; return this; }
        public Builder description(String v) { r.description = v; return this; }
        public Builder price(BigDecimal v) { r.price = v; return this; }
        public Builder originalPrice(BigDecimal v) { r.originalPrice = v; return this; }
        public Builder stock(Integer v) { r.stock = v; return this; }
        public Builder rating(Double v) { r.rating = v; return this; }
        public Builder reviewCount(Integer v) { r.reviewCount = v; return this; }
        public Builder images(List<String> v) { r.images = v; return this; }
        public Builder categoryId(Long v) { r.categoryId = v; return this; }
        public Builder categoryName(String v) { r.categoryName = v; return this; }
        public Builder sellerId(Long v) { r.sellerId = v; return this; }
        public Builder sellerName(String v) { r.sellerName = v; return this; }
        public Builder approvalStatus(ApprovalStatus v) { r.approvalStatus = v; return this; }
        public Builder featured(boolean v) { r.featured = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public ProductResponse build() { return r; }
    }
}