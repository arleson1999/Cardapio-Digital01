package com.example.cardapiodigital.repository;

import com.example.cardapiodigital.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
