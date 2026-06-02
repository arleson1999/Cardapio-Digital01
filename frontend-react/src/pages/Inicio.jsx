import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, ShoppingBag } from "lucide-react";

export default function Inicio() {
  const [metrics, setMetrics] = useState({
    faturamentoTotal: 0,
    ticketMedio: 0,
  });

  // Busca as informações reais consolidadas no PostgreSQL
  useEffect(() => {
    fetch("http://localhost:8080/api/orders/dashboard/metrics")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
      })
      .catch((err) => {
        console.error("Aguardando inicialização do backend comercial...", err);
      });
  }, []);

  return (
    <div
      style={{ padding: "30px", backgroundColor: "#f8fafc", minHeight: "100%" }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 4px 0",
          }}
        >
          Painel de Desempenho Comercial
        </h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
          Acompanhamento de vendas e indicators operacionais em tempo real.
        </p>
      </div>

      {/* GRID DE CARDS GERENCIAIS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          marginBottom: "35px",
        }}
      >
        {/* CARD 1: FATURAMENTO */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Valor Total de Vendas
            </span>
            <div
              style={{
                backgroundColor: "#fef2f2",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <DollarSign size={20} color="#ef4444" />
            </div>
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "6px",
            }}
          >
            R$ {metrics.faturamentoTotal.toFixed(2)}
          </div>
          <div
            style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: "500" }}
          >
            ▲ 12.5%{" "}
            <span style={{ color: "#94a3b8", fontWeight: "400" }}>
              vs. mês anterior
            </span>
          </div>
        </div>

        {/* CARD 2: TICKET MÉDIO */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Ticket Médio
            </span>
            <div
              style={{
                backgroundColor: "#eff6ff",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <TrendingUp size={20} color="#3b82f6" />
            </div>
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "6px",
            }}
          >
            R$ {metrics.ticketMedio.toFixed(2)}
          </div>
          <div
            style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: "500" }}
          >
            ▲ 4.2%{" "}
            <span style={{ color: "#94a3b8", fontWeight: "400" }}>
              vs. mês anterior
            </span>
          </div>
        </div>
      </div>

      {/* ÁREA DE OPERAÇÕES DA COZINHA OU GRÁFICOS */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px 0" }}>
          <ShoppingBag
            size={40}
            color="#94a3b8"
            style={{ marginBottom: "12px" }}
          />
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: "650",
              color: "#334155",
              margin: "0 0 6px 0",
            }}
          >
            Fluxograma de vendas diárias
          </h3>
          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "0.9rem",
              lineHeight: "1.4",
            }}
          >
            Nenhum dado consolidado para exibição gráfica neste período. Os
            gráficos serão montados dinamicamente.
          </p>
        </div>
      </div>
    </div>
  );
}
