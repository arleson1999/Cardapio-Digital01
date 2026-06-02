import { useState } from "react";
import {
  PlusCircle,
  Filter,
  RefreshCw,
  X,
  Search,
  FileText,
  Printer,
  Save,
  Lock,
  RefreshCcw,
} from "lucide-react";

export default function Caixa() {
  // Navegação por abas superiores
  const [abaAtiva, setAbaAtiva] = useState("listagem");

  // Controle dos Modais
  const [modalAbrirAberto, setModalAbrirAberto] = useState(false);
  const [modalConferenciaAberto, setModalConferenciaAberto] = useState(false);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState(false);

  // Estados do formulário de Abertura de Caixa
  const [saldoInicial, setSaldoInicial] = useState("0,00");
  const [caixaSelecionado, setCaixaSelecionado] = useState("Caixa 1 - Caixa 1");
  const [vendaPresencial, setVendaPresencial] = useState(true);
  const [vendaDelivery, setVendaDelivery] = useState(true);
  const [observacao, setObservacao] = useState("");
  const [erroValidacao, setErroValidacao] = useState(false);

  // Estados de movimentação interna (Dentro do histórico do caixa selecionado)
  const [tipoMovimentacao, setTipoMovimentacao] = useState(""); // 'SANGRIA' ou 'ACRESCIMO'
  const [valorMovimentacao, setValorMovimentacao] = useState("0,00");
  const [descricaoMovimentacao, setDescricaoMovimentacao] = useState("");

  // Estado para a conferência de fechamento (1ª conferência)
  const [conferenciaInformada, setConferenciaInformada] = useState("0,00");

  // Identificador do Caixa que está sendo inspecionado/editado nos modais
  const [caixaSelecionadoId, setCaixaSelecionadoId] = useState(null);

  // Lista de caixas começa vazia
  const [listaCaixas, setListaCaixas] = useState([]);

  // Encontra o caixa ativo nos modais abertos
  const caixaAtualModal = listaCaixas.find((c) => c.id === caixaSelecionadoId);

  // FUNÇÃO AUXILIAR: Máscara de Moeda Dinâmica (Ex: 1000 -> 10,00)
  const formatarMoeda = (valorRaw) => {
    // Remove tudo o que não for dígito numérico
    const apenasNumeros = valorRaw.replace(/\D/g, "");

    // Se estiver vazio, retorna o padrão limpo
    if (!apenasNumeros) return "0,00";

    // Converte para float movendo a virgula duas casas para a esquerda
    const valorFloat = parseFloat(apenasNumeros) / 100;

    // Retorna formatado no padrão brasileiro (ex: 1.500,00)
    return valorFloat.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Converte a string mascarada de volta para número utilizável em cálculos
  const converterParaNumero = (valorString) => {
    if (!valorString) return 0;
    // Remove pontos de milhar e troca a vírgula decimal por ponto
    const limpo = valorString.replace(/\./g, "").replace(",", ".");
    return parseFloat(limpo) || 0;
  };

  // 1. AÇÃO: ABRIR NOVO CAIXA
  const handleAbrirCaixa = () => {
    const valorNum = converterParaNumero(saldoInicial);

    setErroValidacao(false);

    const agora = new Date();
    const dataHoraStr =
      agora.toLocaleDateString("pt-BR") +
      " " +
      agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const novoCaixa = {
      id: Math.floor(Math.random() * 10000),
      nome: caixaSelecionado,
      abertura: dataHoraStr,
      fechamento: "-",
      usuarioAbertura: "Warleson Marques (wsousamarques2018@gmail.com)",
      usuarioFechamento: "-",
      saldoFinal: valorNum,
      confSaldoFinal: 0,
      quebra: 0,
      status: "ABERTO",
      presencial: vendaPresencial,
      delivery: vendaDelivery,
      observacao: observacao,
      movimentacoes: [
        {
          dataHora: dataHoraStr,
          descricao: "SALDO INICIAL DE ABERTURA",
          valor: valorNum,
          tipo: "ACRESCIMO",
        },
      ],
    };

    setListaCaixas([novoCaixa, ...listaCaixas]);
    setModalAbrirAberto(false);
    setSaldoInicial("0,00");
    setObservacao("");
  };

  // 2. AÇÃO: ADICIONAR MOVIMENTAÇÃO (SANGRIA OU ACRÉSCIMO)
  const handleAdicionarMovimentacao = () => {
    const valorNum = converterParaNumero(valorMovimentacao);
    if (valorNum <= 0) return;

    const agora = new Date();
    const dataHoraStr =
      agora.toLocaleDateString("pt-BR") +
      " " +
      agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    setListaCaixas(
      listaCaixas.map((cx) => {
        if (cx.id === caixaSelecionadoId) {
          const novaMov = {
            dataHora: dataHoraStr,
            descricao: `${tipoMovimentacao} - ${descricaoMovimentacao || "Sem descrição"}`,
            valor: tipoMovimentacao === "SANGRIA" ? -valorNum : valorNum,
            tipo: tipoMovimentacao,
          };
          const novoSaldo =
            cx.saldoFinal +
            (tipoMovimentacao === "SANGRIA" ? -valorNum : valorNum);
          return {
            ...cx,
            saldoFinal: novoSaldo,
            movimentacoes: [...cx.movimentacoes, novaMov],
          };
        }
        return cx;
      }),
    );

    setValorMovimentacao("0,00");
    setDescricaoMovimentacao("");
    setTipoMovimentacao("");
  };

  // 3. AÇÃO: SALVAR CONFERÊNCIA PARCIAL
  const handleSalvarConferencia = () => {
    const valorConferido = converterParaNumero(conferenciaInformada);
    setListaCaixas(
      listaCaixas.map((cx) => {
        if (cx.id === caixaSelecionadoId) {
          return {
            ...cx,
            confSaldoFinal: valorConferido,
            quebra: valorConferido - cx.saldoFinal,
          };
        }
        return cx;
      }),
    );
    setModalConferenciaAberto(false);
    setConferenciaInformada("0,00");
  };

  // 4. AÇÃO: FECHAR/ENCERRAR CAIXA DEFINITIVAMENTE
  const handleFecharCaixaDefinitivo = () => {
    const valorConferido = converterParaNumero(conferenciaInformada);
    const agora = new Date();
    const dataHoraStr =
      agora.toLocaleDateString("pt-BR") +
      " " +
      agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    setListaCaixas(
      listaCaixas.map((cx) => {
        if (cx.id === caixaSelecionadoId) {
          return {
            ...cx,
            status: "FECHADO",
            fechamento: dataHoraStr,
            usuarioFechamento: "Warleson Marques (wsousamarques2018@gmail.com)",
            confSaldoFinal: valorConferido,
            quebra: valorConferido - cx.saldoFinal,
          };
        }
        return cx;
      }),
    );
    setModalConferenciaAberto(false);
    setConferenciaInformada("0,00");
  };

  // Abre os Modais apontando para o ID do Caixa correto
  const dispararModal = (id, tipo) => {
    setCaixaSelecionadoId(id);
    if (tipo === "historico") setModalHistoricoAberto(true);
    if (tipo === "conferencia") {
      const cx = listaCaixas.find((c) => c.id === id);
      setConferenciaInformada(
        cx ? cx.confSaldoFinal.toFixed(2).replace(".", ",") : "0,00",
      );
      setModalConferenciaAberto(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* ABAS SUPERIORES */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "10px 20px 0 20px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <button
          onClick={() => setAbaAtiva("listagem")}
          style={{
            padding: "12px 5px",
            border: "none",
            backgroundColor: "transparent",
            color: abaAtiva === "listagem" ? "#dc2626" : "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            borderBottom:
              abaAtiva === "listagem"
                ? "2px solid #dc2626"
                : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>☰</span> Listagem de Caixa
        </button>
        <button
          onClick={() => setAbaAtiva("cancelamentos")}
          style={{
            padding: "12px 5px",
            border: "none",
            backgroundColor: "transparent",
            color: abaAtiva === "cancelamentos" ? "#dc2626" : "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            borderBottom:
              abaAtiva === "cancelamentos"
                ? "2px solid #dc2626"
                : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>🚫</span> Cancelamentos
        </button>
      </div>

      {abaAtiva === "listagem" && (
        <div style={{ padding: "20px" }}>
          {/* BARRA DE FERRAMENTAS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => {
                  setErroValidacao(false);
                  setSaldoInicial("0,00");
                  setModalAbrirAberto(true);
                }}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                }}
              >
                <PlusCircle size={16} /> Abrir Caixa
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: "#fff",
                  border: "1px solid #cbd5e1",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  color: "#475569",
                }}
              >
                <Filter size={14} color="#64748b" /> Filtros:
                <select
                  style={{
                    border: "none",
                    color: "#1e293b",
                    fontWeight: "500",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option>Todos os usuários</option>
                </select>
              </div>
            </div>

            <button
              style={{
                backgroundColor: "#fff",
                border: "1px solid #cbd5e1",
                color: "#475569",
                padding: "8px 16px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              <RefreshCw size={14} /> Atualizar
            </button>
          </div>

          {/* TABELA PRINCIPAL */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "0.85rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  <th style={{ padding: "12px 15px", width: "140px" }}>
                    Ações
                  </th>
                  <th style={{ padding: "12px 15px" }}>Caixa</th>
                  <th style={{ padding: "12px 15px" }}>Data/Hora Abertura</th>
                  <th style={{ padding: "12px 15px" }}>Data/Hora Fechamento</th>
                  <th style={{ padding: "12px 15px" }}>Usuário Abertura</th>
                  <th style={{ padding: "12px 15px" }}>Usuário Fechamento</th>
                  <th style={{ padding: "12px 15px", textAlign: "right" }}>
                    Saldo Sistema
                  </th>
                  <th style={{ padding: "12px 15px", textAlign: "right" }}>
                    Saldo Informado
                  </th>
                  <th style={{ padding: "12px 15px" }}>Diferença / Quebra</th>
                  <th style={{ padding: "12px 15px", textAlign: "center" }}>
                    Operações
                  </th>
                </tr>
              </thead>
              <tbody>
                {listaCaixas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontStyle: "italic",
                      }}
                    >
                      Nenhum registro de caixa encontrado. Clique em "Abrir
                      Caixa" para iniciar.
                    </td>
                  </tr>
                ) : (
                  listaCaixas.map((cx) => (
                    <tr
                      key={cx.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        color: "#334155",
                        verticalAlign: "middle",
                      }}
                    >
                      <td style={{ padding: "12px 15px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              backgroundColor:
                                cx.status === "ABERTO" ? "#3b82f6" : "#94a3b8",
                              marginRight: "4px",
                            }}
                            title={cx.status}
                          ></span>

                          <button
                            onClick={() => dispararModal(cx.id, "historico")}
                            style={{
                              border: "none",
                              backgroundColor: "#3b82f6",
                              color: "white",
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Search size={13} />
                          </button>

                          <button
                            onClick={() => dispararModal(cx.id, "conferencia")}
                            style={{
                              border: "none",
                              backgroundColor: "#ea580c",
                              color: "white",
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <RefreshCcw size={13} />
                          </button>

                          <button
                            onClick={() => dispararModal(cx.id, "historico")}
                            style={{
                              border: "none",
                              backgroundColor: "#10b981",
                              color: "white",
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <FileText size={13} />
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: "12px 15px" }}>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {cx.nome}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            marginTop: "3px",
                          }}
                        >
                          {cx.presencial && <span title="Presencial">🏠</span>}
                          {cx.delivery && <span title="Delivery">🏍️</span>}
                        </div>
                      </td>

                      <td style={{ padding: "12px 15px", color: "#475569" }}>
                        📅 {cx.abertura.split(" ")[0]} <br /> 🕒{" "}
                        {cx.abertura.split(" ")[1]}
                      </td>
                      <td style={{ padding: "12px 15px", color: "#475569" }}>
                        {cx.fechamento !== "-" ? (
                          <>
                            📅 {cx.fechamento.split(" ")[0]} <br /> 🕒{" "}
                            {cx.fechamento.split(" ")[1]}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          color: "#64748b",
                          fontSize: "0.8rem",
                        }}
                      >
                        {cx.usuarioAbertura.split(" ")[0]}{" "}
                        {cx.usuarioAbertura.split(" ")[1]}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          color: "#64748b",
                          fontSize: "0.8rem",
                        }}
                      >
                        {cx.usuarioFechamento.split(" ")[0]}{" "}
                        {cx.usuarioFechamento.split(" ")[1]}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "right",
                          color: "#10b981",
                          fontWeight: "600",
                        }}
                      >
                        R${" "}
                        {cx.saldoFinal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "right",
                          color: "#2563eb",
                          fontWeight: "600",
                        }}
                      >
                        R${" "}
                        {cx.confSaldoFinal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      <td
                        style={{
                          padding: "12px 15px",
                          color:
                            cx.quebra < 0
                              ? "#ef4444"
                              : cx.quebra > 0
                                ? "#10b981"
                                : "#64748b",
                          fontWeight: "500",
                        }}
                      >
                        {cx.quebra === 0
                          ? "✅ Correto"
                          : `R$ ${cx.quebra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                      </td>

                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        {cx.movimentacoes.length}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ABRIR CAIXA */}
      {modalAbrirAberto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "500px",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "600",
                }}
              >
                <span>🗄️</span> Abrir Caixa
              </div>
              <X
                size={18}
                color="#94a3b8"
                cursor="pointer"
                onClick={() => setModalAbrirAberto(false)}
              />
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    marginBottom: "6px",
                  }}
                >
                  Saldo Inicial em Dinheiro *
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* INPUT FINANCEIRO COM FORMATAÇÃO EM TEMPO REAL */}
                  <input
                    type="text"
                    value={saldoInicial}
                    onChange={(e) =>
                      setSaldoInicial(formatarMoeda(e.target.value))
                    }
                    onFocus={(e) => e.target.select()}
                    style={{
                      width: "100%",
                      padding: "11px 15px",
                      borderRadius: "25px",
                      border: erroValidacao
                        ? "1px solid #ef4444"
                        : "1px solid #10b981",
                      backgroundColor: "#f0fdf4",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#16a34a",
                      outline: "none",
                      textAlign: "right",
                    }}
                  />
                  <button
                    onClick={() => setSaldoInicial("0,00")}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #cbd5e1",
                      padding: "0 16px",
                      borderRadius: "25px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Sem saldo
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    marginBottom: "6px",
                  }}
                >
                  Caixa *
                </label>
                <select
                  value={caixaSelecionado}
                  onChange={(e) => setCaixaSelecionado(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "25px",
                    border: "1px solid #10b981",
                    backgroundColor: "#f0fdf4",
                    outline: "none",
                  }}
                >
                  <option>Caixa 1 - Caixa 1</option>
                  <option>Cova 1 - Cova 1</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    marginBottom: "6px",
                  }}
                >
                  Tipos de Vendas Habilitadas
                </label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <label
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #bfdbfe",
                      backgroundColor: "#eff6ff",
                      cursor: "pointer",
                    }}
                  >
                    <span>🔵 Presencial</span>
                    <input
                      type="checkbox"
                      checked={vendaPresencial}
                      onChange={(e) => setVendaPresencial(e.target.checked)}
                    />
                  </label>
                  <label
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #f5d0fe",
                      backgroundColor: "#fdf4ff",
                      cursor: "pointer",
                    }}
                  >
                    <span>🟣 Delivery</span>
                    <input
                      type="checkbox"
                      checked={vendaDelivery}
                      onChange={(e) => setVendaDelivery(e.target.checked)}
                    />
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    marginBottom: "6px",
                  }}
                >
                  Observação
                </label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Opcional..."
                  style={{
                    width: "100%",
                    height: "60px",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    resize: "none",
                    outline: "none",
                  }}
                ></textarea>
              </div>

              {erroValidacao && (
                <div
                  style={{
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "25px",
                    padding: "8px",
                    color: "#b45309",
                    fontSize: "0.8rem",
                    textAlign: "center",
                    marginBottom: "15px",
                  }}
                >
                  ⚠️ Informe um valor inicial válido para prosseguir.
                </div>
              )}

              <button
                onClick={handleAbrirCaixa}
                style={{
                  width: "100%",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                📥 ABRIR CAIXA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFERÊNCIA DE VALORES */}
      {modalConferenciaAberto && caixaAtualModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "750px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                <Lock
                  size={14}
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />{" "}
                Conferência de Valores — {caixaAtualModal.nome}
              </span>
              <X
                size={18}
                color="#94a3b8"
                cursor="pointer"
                onClick={() => setModalConferenciaAberto(false)}
              />
            </div>

            <div style={{ padding: "20px" }}>
              <div
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#f8fafc",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    marginBottom: "8px",
                  }}
                >
                  Digite o Valor Físico Contado na Gaveta (1ª Conferência):
                </label>
                {/* MÁSCARA FINANCEIRA TAMBÉM NA CONFERÊNCIA */}
                <input
                  type="text"
                  value={conferenciaInformada}
                  onChange={(e) =>
                    setConferenciaInformada(formatarMoeda(e.target.value))
                  }
                  onFocus={(e) => e.target.select()}
                  style={{
                    width: "250px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "#2563eb",
                    textAlign: "right",
                  }}
                />
              </div>

              <table
                style={{
                  width: "100%",
                  fontSize: "0.85rem",
                  borderCollapse: "collapse",
                  marginBottom: "25px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      color: "#64748b",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <th style={{ paddingBottom: "8px", textAlign: "left" }}>
                      Métricas do Sistema
                    </th>
                    <th style={{ paddingBottom: "8px", textAlign: "right" }}>
                      Valor Registrado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 0" }}>
                      Saldo Calculado em Sistema
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "600",
                        color: "#10b981",
                      }}
                    >
                      R${" "}
                      {caixaAtualModal.saldoFinal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 0" }}>
                      Último Saldo Concluído/Informado
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "600",
                        color: "#2563eb",
                      }}
                    >
                      R$ {conferenciaInformada}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: "15px",
                }}
              >
                <button
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #cbd5e1",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  <Printer size={14} /> Imprimir
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setModalConferenciaAberto(false)}
                    style={{
                      backgroundColor: "#f1f5f9",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSalvarConferencia}
                    style={{
                      backgroundColor: "#64748b",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    <Save size={14} /> Salvar Parcial
                  </button>

                  {caixaAtualModal.status === "ABERTO" && (
                    <button
                      onClick={handleFecharCaixaDefinitivo}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      <Lock size={14} /> ENCERRAR CAIXA
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: HISTÓRICO / SUPRIMENTOS / SANGRIA */}
      {modalHistoricoAberto && caixaAtualModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "920px",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#334155",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FileText size={15} /> <strong>{caixaAtualModal.nome}</strong>
                <span
                  style={{
                    fontSize: "10px",
                    backgroundColor: "#e2e8f0",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "700",
                  }}
                >
                  {caixaAtualModal.status}
                </span>
                <span>| Abertura: {caixaAtualModal.abertura}</span>
              </div>
              <X
                size={18}
                color="#94a3b8"
                cursor="pointer"
                onClick={() => setModalHistoricoAberto(false)}
              />
            </div>

            <div
              style={{
                padding: "20px",
                display: "flex",
                gap: "20px",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{
                  flex: 1.4,
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {caixaAtualModal.status === "ABERTO" ? (
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "15px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#475569",
                        marginBottom: "8px",
                      }}
                    >
                      RÁPIDO: Lançar Ajuste na Gaveta
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <select
                        value={tipoMovimentacao}
                        onChange={(e) => setTipoMovimentacao(e.target.value)}
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.8rem",
                        }}
                      >
                        <option value="">-- Selecione o Tipo --</option>
                        <option value="ACRESCIMO">
                          ➕ ACRÉSCIMO / SUPRIMENTO
                        </option>
                        <option value="SANGRIA">➖ SANGRIA / RETIRADA</option>
                      </select>
                      {/* MÁSCARA FINANCEIRA TAMBÉM NO LANÇAMENTO DE SANGRIA/SUPRIMENTO */}
                      <input
                        type="text"
                        value={valorMovimentacao}
                        onChange={(e) =>
                          setValorMovimentacao(formatarMoeda(e.target.value))
                        }
                        onFocus={(e) => e.target.select()}
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.8rem",
                          width: "100px",
                          textAlign: "right",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Motivo/Descrição"
                        value={descricaoMovimentacao}
                        onChange={(e) =>
                          setDescricaoMovimentacao(e.target.value)
                        }
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.8rem",
                          flex: 1,
                        }}
                      />
                      <button
                        onClick={handleAdicionarMovimentacao}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Lançar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#f1f5f9",
                      color: "#64748b",
                      padding: "10px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      textAlign: "center",
                      marginBottom: "15px",
                    }}
                  >
                    🔒 Caixa Fechado. Não são permitidos novos lançamentos de
                    Sangria ou Suprimento.
                  </div>
                )}

                <table
                  style={{
                    width: "100%",
                    fontSize: "0.8rem",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        color: "#64748b",
                        borderBottom: "1px solid #cbd5e1",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "6px 0" }}>Data/Hora</th>
                      <th style={{ padding: "6px 0" }}>Descrição</th>
                      <th style={{ padding: "6px 0", textAlign: "right" }}>
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {caixaAtualModal.movimentacoes.map((m, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                      >
                        <td style={{ padding: "10px 0", color: "#64748b" }}>
                          {m.dataHora}
                        </td>
                        <td>
                          <strong>{m.descricao}</strong>
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            fontWeight: "600",
                            color: m.valor < 0 ? "#ef4444" : "#10b981",
                          }}
                        >
                          R${" "}
                          {m.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  flex: 0.8,
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  height: "fit-content",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontWeight: "600", fontSize: "0.8rem" }}>
                    Resumo Geral Financeiro
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    marginBottom: "6px",
                  }}
                >
                  <span>Saldo Físico Atual:</span>
                  <span style={{ fontWeight: "700", color: "#10b981" }}>
                    R${" "}
                    {caixaAtualModal.saldoFinal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    marginBottom: "6px",
                  }}
                >
                  <span>Tipo de Caixa:</span>
                  <span style={{ fontWeight: "500", color: "#6b21a8" }}>
                    {caixaAtualModal.nome}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
