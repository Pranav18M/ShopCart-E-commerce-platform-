package com.ecommerce.service.impl;

import com.ecommerce.dto.response.CartItemResponse;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.entity.*;
import com.ecommerce.model.enums.ApprovalStatus;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final SecurityUtils securityUtils;

    public CartServiceImpl(CartRepository cartRepository, ProductRepository productRepository, SecurityUtils securityUtils) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.securityUtils = securityUtils;
    }

    @Override @Transactional(readOnly = true)
    public CartResponse getCart() {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElse(new Cart());
        cart.setUser(user);
        return mapToResponse(cart);
    }

    @Override
    public CartResponse addToCart(Long productId, int quantity) {
        User user = securityUtils.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        if (product.getApprovalStatus() != ApprovalStatus.APPROVED || !product.isActive())
            throw new BadRequestException("Product not available");
        if (product.getStock() < quantity)
            throw new BadRequestException("Insufficient stock: " + product.getStock());

        Cart cart = cartRepository.findByUser(user).orElse(new Cart());
        cart.setUser(user);

        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId)).findFirst().orElse(null);
        if (existing != null) {
            int newQty = existing.getQuantity() + quantity;
            if (newQty > product.getStock()) throw new BadRequestException("Exceeds stock");
            existing.setQuantity(newQty);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart); item.setProduct(product);
            item.setQuantity(quantity); item.setPrice(product.getPrice());
            cart.getItems().add(item);
        }
        return mapToResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse updateCartItem(Long cartItemId, int quantity) {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        CartItem item = cart.getItems().stream().filter(i -> i.getId().equals(cartItemId))
                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (quantity <= 0) cart.getItems().remove(item);
        else { item.setQuantity(quantity); }
        return mapToResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse removeCartItem(Long cartItemId) {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
        return mapToResponse(cartRepository.save(cart));
    }

    @Override
    public void clearCart() {
        User user = securityUtils.getCurrentUser();
        cartRepository.findByUser(user).ifPresent(cart -> {
            cart.getItems().clear(); cartRepository.save(cart);
        });
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(item -> {
            Product p = item.getProduct();
            String img = (p.getImages() != null && !p.getImages().isEmpty()) ? p.getImages().get(0) : null;
            return CartItemResponse.builder()
                    .id(item.getId()).productId(p.getId()).productName(p.getName())
                    .sellerName(p.getSeller() != null ? p.getSeller().getName() : null)
                    .imageUrl(img).price(item.getPrice()).originalPrice(p.getOriginalPrice())
                    .quantity(item.getQuantity()).stock(p.getStock()).build();
        }).collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = items.stream().mapToInt(CartItemResponse::getQuantity).sum();
        return CartResponse.builder().id(cart.getId()).items(items).totalAmount(total).totalItems(totalItems).build();
    }
}