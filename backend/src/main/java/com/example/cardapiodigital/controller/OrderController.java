package com.example.cardapiodigital.controller;

import com.example.cardapiodigital.entity.Order;
import com.example.cardapiodigital.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Cliente finaliza o pedido enviando o carrinho
    @PostMapping
    public ResponseEntity<Order> checkout(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.create(order));
    }

    // Painel administrativo puxa todos os pedidos existentes
    @GetMapping
    public List<Order> getAllOrders(@RequestParam(required = false) String status) {
        if (status != null) {
            return orderService.findByStatus(status);
        }
        return orderService.findAll();
    }

    // Painel administrativo avança o status (ex: RECEBIDO -> EM_PREPARO -> PRONTO -> FINALIZADO)
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return orderService.updateStatus(id, newStatus)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ENDPOINT DO DASHBOARD: Retorna faturamento e ticket médio estruturado em JSON
    @GetMapping("/dashboard/metrics")
    public ResponseEntity<Map<String, Double>> getDashboardMetrics() {
        Map<String, Double> metrics = new HashMap<>();
        metrics.put("faturamentoTotal", orderService.getFaturamentoTotal());
        metrics.put("ticketMedio", orderService.getTicketMedio());
        return ResponseEntity.ok(metrics);
    }
}
