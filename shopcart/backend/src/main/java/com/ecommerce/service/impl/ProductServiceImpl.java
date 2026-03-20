package com.ecommerce.service.impl;

import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.model.entity.Category;
import com.ecommerce.model.entity.Product;
import com.ecommerce.model.entity.User;
import com.ecommerce.model.enums.ApprovalStatus;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductService;
import com.ecommerce.utils.FileStorageUtil;
import com.ecommerce.utils.SecurityUtils;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageUtil fileStorageUtil;
    private final SecurityUtils securityUtils;

    public ProductServiceImpl(ProductRepository productRepository,
                               CategoryRepository categoryRepository,
                               FileStorageUtil fileStorageUtil,
                               SecurityUtils securityUtils) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageUtil = fileStorageUtil;
        this.securityUtils = securityUtils;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(String search, String category,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              int page, int size, String sortParam) {
        Sort sort = parseSort(sortParam);
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchParam = (search != null && !search.isBlank()) ? search : null;
        String categoryParam = (category != null && !category.isBlank()) ? category : null;

        try {
            Page<Product> products = productRepository.searchProducts(
                    searchParam, categoryParam, minPrice, maxPrice, pageable);
            return products.map(this::mapToResponse);
        } catch (Exception e) {
            // Fallback: return all approved products
            Page<Product> products = productRepository
                    .findByApprovalStatusAndActiveTrue(ApprovalStatus.APPROVED, pageable);
            return products.map(this::mapToResponse);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return mapToResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        try {
            List<Product> featured = productRepository
                    .findByFeaturedTrueAndApprovalStatusAndActiveTrue(ApprovalStatus.APPROVED);
            if (featured.isEmpty()) {
                // fallback: return first 20 approved products
                Pageable pageable = PageRequest.of(0, 20,
                        Sort.by(Sort.Direction.DESC, "createdAt"));
                return productRepository
                        .findByApprovalStatusAndActiveTrue(ApprovalStatus.APPROVED, pageable)
                        .getContent().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
            }
            return featured.stream().map(this::mapToResponse).collect(Collectors.toList());
        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getSellerProducts() {
        User seller = securityUtils.getCurrentUser();
        return productRepository.findBySeller(seller)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ProductResponse createProduct(String name, Long categoryId, String description,
                                          BigDecimal price, BigDecimal originalPrice,
                                          Integer stock, List<MultipartFile> images) {
        User seller = securityUtils.getCurrentUser();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));

        List<String> imageUrls = new ArrayList<>();
        if (images != null) {
            for (MultipartFile img : images) {
                if (img != null && !img.isEmpty()) {
                    imageUrls.add(fileStorageUtil.saveFile(img, "products"));
                }
            }
        }

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setOriginalPrice(originalPrice != null ? originalPrice : price);
        product.setStock(stock);
        product.setCategory(category);
        product.setSeller(seller);
        product.setImages(imageUrls);
        product.setApprovalStatus(ApprovalStatus.PENDING);
        product.setActive(true);
        product.setFeatured(false);

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse updateProduct(Long id, String name, Long categoryId, String description,
                                          BigDecimal price, BigDecimal originalPrice,
                                          Integer stock, List<MultipartFile> images) {
        User seller = securityUtils.getCurrentUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new UnauthorizedException("You can only edit your own products");
        }

        if (name != null) product.setName(name);
        if (description != null) product.setDescription(description);
        if (price != null) product.setPrice(price);
        if (originalPrice != null) product.setOriginalPrice(originalPrice);
        if (stock != null) product.setStock(stock);
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
            product.setCategory(category);
        }
        if (images != null && !images.isEmpty()) {
            List<String> newUrls = new ArrayList<>();
            for (MultipartFile img : images) {
                if (img != null && !img.isEmpty()) {
                    newUrls.add(fileStorageUtil.saveFile(img, "products"));
                }
            }
            if (!newUrls.isEmpty()) product.setImages(newUrls);
        }
        product.setApprovalStatus(ApprovalStatus.PENDING);
        return mapToResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        User seller = securityUtils.getCurrentUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new UnauthorizedException("You can only delete your own products");
        }
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public ProductResponse approveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setApprovalStatus(ApprovalStatus.APPROVED);
        product.setFeatured(true);
        return mapToResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse rejectProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setApprovalStatus(ApprovalStatus.REJECTED);
        return mapToResponse(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private Sort parseSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank())
            return Sort.by(Sort.Direction.DESC, "createdAt");
        String[] parts = sortParam.split(",");
        String field = parts[0];
        Sort.Direction dir = (parts.length > 1 && "asc".equalsIgnoreCase(parts[1]))
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(dir, field);
    }

    public ProductResponse mapToResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .stock(p.getStock())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .images(p.getImages())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .sellerId(p.getSeller() != null ? p.getSeller().getId() : null)
                .sellerName(p.getSeller() != null ? p.getSeller().getName() : null)
                .approvalStatus(p.getApprovalStatus())
                .featured(p.isFeatured())
                .createdAt(p.getCreatedAt())
                .build();
    }
}