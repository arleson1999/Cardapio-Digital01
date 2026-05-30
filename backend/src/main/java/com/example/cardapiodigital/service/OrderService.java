package com.example.cardapiodigital.service;

import com.example.cardapiodigital.entity.Order;
import com.example.cardapiodigital.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Lista todos os pedidos cadastrados
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    // Filtra pedidos por status (ex: buscar apenas os "RECEBIDO" para a cozinha)
    public List<Order> findByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // Salva o pedido calculando os vínculos corretos com os itens
    @Transactional
    public Order create(Order order) {
        order.setDataPedido(LocalDateTime.now());
        order.setStatus("RECEBIDO");
        
        // Garante que cada item conheça o pedido ao qual pertence antes de salvar
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        order.recalculateValorTotal();
        
        return orderRepository.save(order);
    }

    // Atualiza o status do pedido (Cozinha avançando as etapas)
    @Transactional
    public Optional<Order> updateStatus(Long id, String newStatus) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(newStatus.toUpperCase());
            return orderRepository.save(order);
        });
    }

    // Métodos que extraem os dados numéricos do Dashboard
    public Double getFaturamentoTotal() {
        return orderRepository.getFaturamentoTotal();
    }

    public Double getTicketMedio() {
        return orderRepository.getTicketMedio();
    }
}
