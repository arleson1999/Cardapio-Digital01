package com.example.cardapiodigital.bootstrap;

import com.example.cardapiodigital.entity.Category;
import com.example.cardapiodigital.entity.Product;
import com.example.cardapiodigital.repository.CategoryRepository;
import com.example.cardapiodigital.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataLoader(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            categoryRepository.saveAll(List.of(
                    new Category("Bebidas"),
                    new Category("Lanches"),
                    new Category("Sobremesas"),
                    new Category("Saladas")
            ));

            productRepository.saveAll(List.of(
                    new Product("Café expresso", "Café forte servido fresco", BigDecimal.valueOf(5.50), "Bebidas", "https://via.placeholder.com/320x200?text=Caf%C3%A9+Expresso", true),
                    new Product("Suco natural", "Suco de laranja espremido na hora", BigDecimal.valueOf(8.00), "Bebidas", "https://via.placeholder.com/320x200?text=Suco+Natural", true),
                    new Product("Sanduíche de frango", "Pão artesanal com frango, alface e molho especial", BigDecimal.valueOf(15.75), "Lanches", "https://via.placeholder.com/320x200?text=Sandu%C3%ADche+de+Frango", true),
                    new Product("Brownie de chocolate", "Brownie quente com calda de brigadeiro", BigDecimal.valueOf(10.50), "Sobremesas", "https://via.placeholder.com/320x200?text=Brownie+de+Chocolate", true),
                    new Product("Salada Caesar", "Alface, croutons e molho especial", BigDecimal.valueOf(18.90), "Saladas", "https://via.placeholder.com/320x200?text=Salada+Caesar", true)
            ));
        }
    }
}
