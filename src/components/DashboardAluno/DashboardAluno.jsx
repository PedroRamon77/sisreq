import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import SidebarAluno from "../layout/sidebar/SidebarAluno";
import "./DashboardAluno.css";

export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const nome = usuario?.nome || "Usuário";
  const tipo = usuario?.tipo;

  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    aberto: false,
    titulo: "",
    mensagem: "",
    tipo: "",
  });

  const [dados, setDados] = useState({
    abertos: 0,
    emAnalise: 0,
    finalizados: 0,
    notificacoes: [],
  });

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    try {
      const response = await api.get("/dashboard");
      setDados(response.data);
    } catch (error) {
      console.error(error);
      setModal({
        aberto: true,
        titulo: "Falha ao carregar",
        mensagem:
          error.response?.data?.erro ||
          "Não foi possível carregar os dados do dashboard.",
        tipo: "erro",
      });
    } finally {
      setLoading(false);
    }
  }

  function fecharModal() {
    setModal({
      ...modal,
      aberto: false,
    });
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <SidebarAluno itemAtivo="visao-geral" />
        <main className="main-content">
          <h2>Carregando...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SidebarAluno itemAtivo="visao-geral" />
      <main className="main-content">
        <header className="welcome-row">
          <div>
            <h2 className="welcome-title">
              Bem-vindo ao <span>SisReq.</span>
            </h2>
            <p>
              Usuário logado: <strong>{nome}</strong>
            </p>
          </div>

          <Link to="/novorequerimento" className="btn-novo">
            + NOVO REQUERIMENTO
          </Link>
        </header>

        <section className="status-grid">
          <div className="status-card">
            <span className="status-label">Abertos</span>
            <span className="status-number">{dados.abertos}</span>
          </div>

          
        </section>

        <section className="notifications-section">
          <h3 className="notifications-header">
            Notificações Recentes
          </h3>

          <div className="notifications-container">
            {dados.notificacoes.length === 0 ? (
              <p>Nenhuma notificação encontrada.</p>
            ) : (
              <ul className="notifications-list">
                {dados.notificacoes.map((item) => (
                  <li
                    key={item.id}
                    className={`notification-item ${
                      item.status?.toLowerCase() || ""
                    }`}
                  >
                    <div className="notification-content">
                      <div className="notification-item-header">
                        <strong className="notification-title">
                          {item.titulo}
                        </strong>

                        <span className="notification-time">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <p className="notification-body">
                        {item.descricao}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {modal.aberto && (
          <div
            className="modal-overlay"
            onClick={fecharModal}
          >
            <div
              className="modal-login"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`modal-icon ${modal.tipo}`}>
                {modal.tipo === "erro" ? "✕" : "✓"}
              </div>

              <h3>{modal.titulo}</h3>

              <p>{modal.mensagem}</p>

              <button
                className="modal-button"
                onClick={fecharModal}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}