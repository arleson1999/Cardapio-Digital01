package com.example.cardapiodigital.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private String status;

    @Column(name = "data_pedido")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataPedido;

    @Column(name = "valor_total")
    private Double valorTotal;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public Order() {
    }

    public Order(String customerName, List<OrderItem> items, LocalDateTime dataPedido) {
        this.customerName = customerName;
        this.status = "RECEBIDO";
        this.dataPedido = dataPedido;
        this.items = items;
        this.items.forEach(item -> item.setOrder(this));
        recalculateValorTotal();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
        this.items.forEach(item -> item.setOrder(this));
        recalculateValorTotal();
    }

    public void recalculateValorTotal() {
        this.valorTotal = items.stream()
                .mapToDouble(OrderItem::getTotalPrice)
                .sum();
    }
}
