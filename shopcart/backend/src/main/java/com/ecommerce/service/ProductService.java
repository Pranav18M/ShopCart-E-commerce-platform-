package com.ecommerce.service;

import com.ecommerce.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    Page<ProductResponse> getProducts(String search, String category,
                                      BigDecimal minPrice, BigDecimal maxPrice,
                                      int page, int size, String sort);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getFeaturedProducts();
    List<ProductResponse> getSellerProducts();
    ProductResponse createProduct(String name, Long categoryId, String description,
                                  BigDecimal price, BigDecimal originalPrice,
                                  Integer stock, List<MultipartFile> images);
    ProductResponse updateProduct(Long id, String name, Long categoryId, String description,
                                  BigDecimal price, BigDecimal originalPrice,
                                  Integer stock, List<MultipartFile> images);
    void deleteProduct(Long id);
    ProductResponse approveProduct(Long id);
    ProductResponse rejectProduct(Long id);
    List<ProductResponse> getAllProductsForAdmin();
}
