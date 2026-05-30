package com.example.cardapiodigital.repository;

import com.example.cardapiodigital.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Busca os pedidos filtrando pelo status (Perfeito para a tela da Cozinha/KDS)
    List<Order> findByStatus(String status);

    // Consulta para o Dashboard: Soma todo o faturamento de vendas finalizadas
    @Query(value = "SELECT COALESCE(SUM(valor_total), 0.0) FROM pedidos WHERE status = 'FINALIZADO'", nativeQuery = true)
    Double getFaturamentoTotal();

    // Consulta para o Dashboard: Calcula o Ticket Médio das vendas finalizadas
    @Query(value = "SELECT COALESCE(AVG(valor_total), 0.0) FROM pedidos WHERE status = 'FINALIZADO'", nativeQuery = true)
    Double getTicketMedio();
}