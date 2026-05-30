package com.example.cardapiodigital.controller;

import com.example.cardapiodigital.dto.CreateOrderRequest;
import com.example.cardapiodigital.entity.Order;
import com.example.cardapiodigital.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> listOrders() {
        return orderService.findAll();
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.create(request));
    }
}
