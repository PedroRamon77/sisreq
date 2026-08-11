import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Solicitacoes.css";
import SidebarAdmin from "../layout/sidebar/SidebarAdmin";
import SidebarServidor from "../layout/sidebar/SidebarServidor";
import SidebarAluno from "../layout/sidebar/SidebarAluno";

export default function Solicitacoes() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  async function carregarSolicitacoes() {
    try {
      setCarregando(true);
      const endpoint =
        usuario?.tipo === "ALUNO"
          ? "/requerimentos/meus"
          : "/requerimentos";
      const response = await api.get(endpoint);
      setSolicitacoes(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Erro ao carregar solicitações:",
        error
      );
      setSolicitacoes([]);
    } finally {
      setCarregando(false);
    }
  }

  function voltarDashboard() {
    if (usuario?.tipo === "ADMIN") {
      navigate("/dashboardadmin");
      return;
    }
    if (usuario?.tipo === "SERVIDOR") {
      navigate("/dashboardservidor");
      return;
    }
    navigate("/dashboardaluno");
  }

  function renderSidebar() {
    if (usuario?.tipo === "ADMIN") {
      return (
        <SidebarAdmin
          itemAtivo="solicitacoes"
        />
      );
    }
    if (usuario?.tipo === "SERVIDOR") {
      return (
        <SidebarServidor
          itemAtivo="solicitacoes"
        />
      );
    }
    return (
      <SidebarAluno
        itemAtivo="solicitacoes"
      />
    );
  }

  function normalizarTexto(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function obterStatus(req) {
    return normalizarTexto(req?.status) === "encaminhado"
      ? "Encaminhado"
      : "Não encaminhado";
  }

  const solicitacoesFiltradas = solicitacoes.filter(
    (req) => {
      const textoBusca = normalizarTexto(busca);
      const protocolo = normalizarTexto(req.protocolo);
      const tipo = normalizarTexto(req.tipo);
      const nomeAluno = normalizarTexto(
        req.usuario?.nome
      );
      const correspondeBusca =
        protocolo.includes(textoBusca) ||
        tipo.includes(textoBusca) ||
        nomeAluno.includes(textoBusca);
      const statusSolicitacao = normalizarTexto(
        obterStatus(req)
      );
      const statusFiltro = normalizarTexto(
        filtroStatus
      );
      const correspondeStatus =
        filtroStatus === "" ||
        statusSolicitacao === statusFiltro;
      return (
        correspondeBusca &&
        correspondeStatus
      );
    }
  );

  function formatarData(data) {
    if (!data) {
      return "-";
    }
    const dataFormatada = new Date(data);
    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {
      return "-";
    }
    return dataFormatada.toLocaleDateString(
      "pt-BR"
    );
  }

  function classeStatus(status) {
    return normalizarTexto(status)
      .replace(/\s+/g, "-");
  }

  function abrirRequerimento(id) {
    navigate(
      `/analiserequerimento/${id}`,
      {
        state: {
          origem: "solicitacoes"
        }
      }
    );
  }

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      <main className="admin-content solicitacoes-content">
        <header className="solicitacoes-header">
          <button
            type="button"
            className="btn-voltar"
            onClick={voltarDashboard}
          >
            ← Voltar
          </button>
          <div className="solicitacoes-title-group">
            <h2>
              {usuario?.tipo === "ALUNO"
                ? "Minhas "
                : "Todas "}
              <span>Solicitações</span>
            </h2>
            <p>
              Acompanhe os requerimentos acadêmicos.
            </p>
          </div>
        </header>
        <section className="users-toolbar">
          <input
            type="text"
            className="search-box"
            placeholder={
              usuario?.tipo === "ALUNO"
                ? "Buscar protocolo ou tipo..."
                : "Buscar protocolo, tipo ou aluno..."
            }
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
          />
          <select
            className="filter-select"
            value={filtroStatus}
            onChange={(event) =>
              setFiltroStatus(
                event.target.value
              )
            }
          >
            <option value="">
              Todos os Status
            </option>
            <option value="Não encaminhado">
              Não encaminhado
            </option>
            <option value="Encaminhado">
              Encaminhado
            </option>
          </select>
        </section>
        <section className="admin-table-section">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Protocolo</th>
                  {usuario?.tipo !== "ALUNO" && (
                    <th>Aluno</th>
                  )}
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td
                      colSpan={
                        usuario?.tipo === "ALUNO"
                          ? 5
                          : 6
                      }
                      className="empty-table"
                    >
                      Carregando solicitações...
                    </td>
                  </tr>
                ) : solicitacoesFiltradas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        usuario?.tipo === "ALUNO"
                          ? 5
                          : 6
                      }
                      className="empty-table"
                    >
                      Nenhuma solicitação encontrada.
                    </td>
                  </tr>
                ) : (
                  solicitacoesFiltradas.map(
                    (req) => {
                      const status =
                        obterStatus(req);
                      const podeEncaminhar =
                        usuario?.tipo === "ADMIN" &&
                        status === "Não encaminhado";
                      return (
                        <tr key={req.id}>
                          <td>
                            <strong>
                              {req.protocolo || "-"}
                            </strong>
                          </td>
                          {usuario?.tipo !== "ALUNO" && (
                            <td>
                              <strong>
                                {req.usuario?.nome ||
                                  "-"}
                              </strong>
                            </td>
                          )}
                          <td>
                            {req.tipo || "-"}
                          </td>
                          <td>
                            {formatarData(
                              req.criadoEm
                            )}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${classeStatus(
                                status
                              )}`}
                            >
                              <span className="status-dot"></span>
                              {status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={
                                podeEncaminhar
                                  ? "btn-ver-detalhes btn-encaminhar-lista"
                                  : "btn-ver-detalhes"
                              }
                              onClick={() =>
                                abrirRequerimento(
                                  req.id
                                )
                              }
                            >
                              {podeEncaminhar
                                ? "Encaminhar"
                                : "Ver"}
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}