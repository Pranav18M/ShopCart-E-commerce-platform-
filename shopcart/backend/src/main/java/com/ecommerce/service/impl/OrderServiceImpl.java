package com.ecommerce.service.impl;

import com.ecommerce.dto.request.OrderStatusRequest;
import com.ecommerce.dto.response.OrderItemResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.model.entity.*;
import com.ecommerce.model.enums.OrderStatus;
import com.ecommerce.model.enums.PaymentMethod;
import com.ecommerce.model.enums.PaymentStatus;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.OrderService;
import com.ecommerce.utils.FileStorageUtil;
import com.ecommerce.utils.SecurityUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final FileStorageUtil fileStorageUtil;
    private final SecurityUtils securityUtils;
    private final ObjectMapper objectMapper;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartRepository cartRepository,
                            ProductRepository productRepository,
                            FileStorageUtil fileStorageUtil,
                            SecurityUtils securityUtils,
                            ObjectMapper objectMapper) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.fileStorageUtil = fileStorageUtil;
        this.securityUtils = securityUtils;
        this.objectMapper = objectMapper;
    }

    @Override
    public OrderResponse placeOrder(String addressJson, PaymentMethod paymentMethod,
                                    String transactionId, MultipartFile screenshot) {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with empty cart");
        }
        if (paymentMethod == PaymentMethod.UPI && (transactionId == null || transactionId.isBlank())) {
            throw new BadRequestException("Transaction ID is required for UPI payment");
        }

        DeliveryAddress deliveryAddress;
        try {
            deliveryAddress = objectMapper.readValue(addressJson, DeliveryAddress.class);
        } catch (Exception e) {
            throw new BadRequestException("Invalid address format");
        }

        String screenshotUrl = null;
        if (screenshot != null && !screenshot.isEmpty()) {
            screenshotUrl = fileStorageUtil.saveFile(screenshot, "payments");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            String imageUrl = (product.getImages() != null && !product.getImages().isEmpty())
                    ? product.getImages().get(0) : null;

            OrderItem item = new OrderItem();
            item.setProductName(product.getName());
            item.setSellerName(product.getSeller() != null ? product.getSeller().getName() : null);
            item.setImageUrl(imageUrl);
            item.setProduct(product);
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(cartItem.getPrice());
            item.setOriginalPrice(product.getOriginalPrice());
            orderItems.add(item);

            subTotal = subTotal.add(cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        BigDecimal deliveryCharge = subTotal.compareTo(BigDecimal.valueOf(499)) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(49);
        BigDecimal totalAmount = subTotal.add(deliveryCharge);

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PAYMENT_PENDING);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setTransactionId(transactionId);
        order.setPaymentScreenshotUrl(screenshotUrl);
        order.setTotalAmount(totalAmount);
        order.setDeliveryCharge(deliveryCharge);
        order.setDeliveryAddress(deliveryAddress);

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User user = securityUtils.getCurrentUser();
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        User user = securityUtils.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        if (!order.getUser().getId().equals(user.getId()) &&
                !user.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("Access denied");
        }
        return mapToResponse(order);
    }

    @Override
    public OrderResponse approvePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setPaymentStatus(PaymentStatus.VERIFIED);
        order.setStatus(OrderStatus.CONFIRMED);
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse rejectPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setPaymentStatus(PaymentStatus.REJECTED);
        order.setStatus(OrderStatus.CANCELLED);
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                item.getProduct().setStock(item.getProduct().getStock() + item.getQuantity());
                productRepository.save(item.getProduct());
            }
        }
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setStatus(request.getStatus());
        if (request.getNote() != null) order.setAdminNote(request.getNote());
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getPendingPaymentOrders() {
        return orderRepository.findByPaymentStatus(PaymentStatus.PENDING)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public void cancelOrder(Long id) {
        User user = securityUtils.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }
        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a shipped or delivered order");
        }
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private OrderResponse mapToResponse(Order o) {
        List<OrderItemResponse> items = o.getItems().stream().map(item ->
                OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName())
                        .sellerName(item.getSellerName())
                        .imageUrl(item.getImageUrl())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .originalPrice(item.getOriginalPrice())
                        .build()
        ).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(o.getId())
                .userId(o.getUser().getId())
                .userEmail(o.getUser().getEmail())
                .userName(o.getUser().getName())
                .items(items)
                .status(o.getStatus())
                .paymentMethod(o.getPaymentMethod())
                .paymentStatus(o.getPaymentStatus())
                .transactionId(o.getTransactionId())
                .paymentScreenshotUrl(o.getPaymentScreenshotUrl())
                .totalAmount(o.getTotalAmount())
                .deliveryCharge(o.getDeliveryCharge())
                .deliveryAddress(o.getDeliveryAddress())
                .adminNote(o.getAdminNote())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}