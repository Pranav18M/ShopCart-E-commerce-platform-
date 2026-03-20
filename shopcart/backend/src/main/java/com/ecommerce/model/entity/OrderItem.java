package com.ecommerce.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "seller_name")
    private String sellerName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    public OrderItem() {}
    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public String getProductName() { return productName; }
    public void setProductName(String v) { this.productName = v; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String v) { this.sellerName = v; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String v) { this.imageUrl = v; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer v) { this.quantity = v; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal v) { this.price = v; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal v) { this.originalPrice = v; }

    public static OrderItemBuilder builder() { return new OrderItemBuilder(); }
    public static class OrderItemBuilder {
        private OrderItem oi = new OrderItem();
        public OrderItemBuilder order(Order v) { oi.order = v; return this; }
        public OrderItemBuilder product(Product v) { oi.product = v; return this; }
        public OrderItemBuilder productName(String v) { oi.productName = v; return this; }
        public OrderItemBuilder sellerName(String v) { oi.sellerName = v; return this; }
        public OrderItemBuilder imageUrl(String v) { oi.imageUrl = v; return this; }
        public OrderItemBuilder quantity(Integer v) { oi.quantity = v; return this; }
        public OrderItemBuilder price(BigDecimal v) { oi.price = v; return this; }
        public OrderItemBuilder originalPrice(BigDecimal v) { oi.originalPrice = v; return this; }
        public OrderItem build() { return oi; }
    }
}