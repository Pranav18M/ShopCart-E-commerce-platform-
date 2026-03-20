package com.ecommerce.service;

import com.ecommerce.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart();
    CartResponse addToCart(Long productId, int quantity);
    CartResponse updateCartItem(Long cartItemId, int quantity);
    CartResponse removeCartItem(Long cartItemId);
    void clearCart();
}
