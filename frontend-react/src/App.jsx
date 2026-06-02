import { useState } from "react";
import Caixa from "./pages/Caixa";
import {
  Home,
  Wallet,
  Truck,
  History,
  Landmark,
  MessageSquare,
  BarChart3,
  Utensils,
  Monitor,
  Layers,
  Users,
  DollarSign,
  FileText,
  FolderPlus,
  Settings,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Inicio from "./pages/Inicio";

export default function App() {
  // Estado para saber qual menu está selecionado ativo na tela
  const [activeMenu, setActiveMenu] = useState("Inicio");

  // Lista com as 15 telas ordenadas por seções comerciais
  const menuConfig = [
    {
      section: "Navegação",
      items: [
        { name: "Inicio", icon: Home },
        { name: "Caixa", icon: Wallet },
        { name: "Delivery", icon: Truck },
        { name: "Histórico de Vendas", icon: History },
      ],
    },
    {
      section: "Integrações",
      items: [
        { name: "Pix Online", icon: Landmark },
        { name: "WhatsApp", icon: MessageSquare },
      ],
    },
    {
      section: "Gestão Comercial",
      items: [
        { name: "Desempenho", icon: BarChart3 },
        { name: "Cardápio", icon: Utensils },
        { name: "Cardápio Digital", icon: Monitor },
        { name: "Estoque", icon: Layers },
        { name: "Clientes", icon: Users },
      ],
    },
    {
      section: "Administrativo",
      items: [
        { name: "Financeiro", icon: DollarSign },
        { name: "Fiscal", icon: FileText },
        { name: "Cadastros", icon: FolderPlus },
        { name: "Configuração", icon: Settings },
      ],
    },
  ];

  // Função auxiliar para renderizar o miolo de cada uma das 15 telas
  const renderContent = () => {
    switch (activeMenu) {
      case "Inicio":
        return <Inicio />;
      case "Caixa":
        return <Caixa />; // <-- Adicione esta linha aqui!
      default:
        return (
          <div style={{ padding: "30px" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                color: "#1e293b",
                marginBottom: "20px",
              }}
            >
              {activeMenu}
            </h2>
            <p style={{ color: "#64748b" }}>
              A tela do módulo de <strong>{activeMenu}</strong> está pronta para
              ser componentizada.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside
        style={{
          width: "280px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "24px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            color: "#ef4444",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            gap: "8px",
          }}
        >
          <span
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "1.1rem",
            }}
          >
            BEE
          </span>{" "}
          food
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "15px 12px" }}>
          {menuConfig.map((group, gIdx) => (
            <div key={gIdx} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  fontWeight: "750",
                  margin: "10px 0 6px 10px",
                  letterSpacing: "0.5px",
                }}
              >
                {group.section}
              </div>

              {group.items.map((item, iIdx) => {
                const IconComponent = item.icon;
                const isActive = activeMenu === item.name;

                return (
                  <button
                    key={iIdx}
                    onClick={() => setActiveMenu(item.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "11px 14px",
                      marginBottom: "4px",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      fontWeight: isActive ? "600" : "500",
                      color: isActive ? "#ef4444" : "#475569",
                      backgroundColor: isActive ? "#fef2f2" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <IconComponent
                        size={19}
                        color={isActive ? "#ef4444" : "#64748b"}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight size={16} color="#ef4444" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL DA DIREITA */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* TOPBAR */}
        <header
          style={{
            height: "65px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 35px",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <MapPin size={16} /> Unidade Principal
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              AM
            </div>
            <span
              style={{
                fontSize: "0.9rem",
                color: "#334155",
                fontWeight: "600",
              }}
            >
              Arleson Marques
            </span>
          </div>
        </header>

        {/* CONTAINER DO MIOLO DINÂMICO */}
        <div style={{ flex: 1, overflowY: "auto" }}>{renderContent()}</div>
      </main>
    </div>
  );
}
