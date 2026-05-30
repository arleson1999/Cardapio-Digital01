package com.example.cardapiodigital.service;

import com.example.cardapiodigital.dto.ProductDto;
import com.example.cardapiodigital.entity.Category;
import com.example.cardapiodigital.entity.Product;
import com.example.cardapiodigital.repository.CategoryRepository;
import com.example.cardapiodigital.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductDto> findAll() {
        return productRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<ProductDto> findById(Long id) {
        return productRepository.findById(id).map(this::toDto);
    }

    public ProductDto create(ProductDto dto) {
        ensureCategoryExists(dto.getCategory());
        Product product = new Product(dto.getName(), dto.getDescription(), dto.getPrice(), dto.getCategory(), dto.getImageUrl(), dto.getAvailable());
        return toDto(productRepository.save(product));
    }

    public Optional<ProductDto> update(Long id, ProductDto dto) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setDescription(dto.getDescription());
            existing.setPrice(dto.getPrice());
            existing.setCategory(dto.getCategory());
            existing.setImageUrl(dto.getImageUrl());
            existing.setAvailable(dto.getAvailable());
            ensureCategoryExists(dto.getCategory());
            return toDto(productRepository.save(existing));
        });
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    private void ensureCategoryExists(String categoryName) {
        String normalizedName = (categoryName == null || categoryName.isBlank()) ? "Outros" : categoryName.trim();
        categoryRepository.findByName(normalizedName).orElseGet(() -> categoryRepository.save(new Category(normalizedName)));
    }

    private ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setAvailable(product.getAvailable());
        return dto;
    }
}
