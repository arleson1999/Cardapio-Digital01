package com.example.cardapiodigital.service;

import com.example.cardapiodigital.dto.CreateOrderRequest;
import com.example.cardapiodigital.dto.OrderItemRequest;
import com.example.cardapiodigital.entity.Order;
import com.example.cardapiodigital.entity.OrderItem;
import com.example.cardapiodigital.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Order create(CreateOrderRequest request) {
        List<OrderItem> items = request.getItems().stream()
                .map(this::toEntity)
                .collect(Collectors.toList());

        Order order = new Order(request.getCustomerName(), items, LocalDateTime.now());
        return orderRepository.save(order);
    }

    private OrderItem toEntity(OrderItemRequest request) {
        OrderItem orderItem = new OrderItem();
        orderItem.setProductId(request.getProductId());
        orderItem.setName(request.getName());
        orderItem.setCategory(request.getCategory());
        orderItem.setImageUrl(request.getImageUrl());
        orderItem.setQuantity(request.getQuantity());
        orderItem.setUnitPrice(request.getUnitPrice());
        return orderItem;
    }
}
