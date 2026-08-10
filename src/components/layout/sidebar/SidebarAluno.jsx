import { Link, useNavigate } from "react-router-dom";
import "./SidebarAluno.css";

export default function SidebarAluno({
  itemAtivo,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>
          Sis<span>Req.</span>
        </h1>
      </div>

      <nav className="sidebar-nav">

        <Link
          to="/dashboardaluno"
          className={`nav-item ${
            itemAtivo === "visao-geral"
              ? "active"
              : ""
          }`}
        >
          Visão Geral
        </Link>

        <Link
          to="/novorequerimento"
          className={`nav-item ${
            itemAtivo === "novo-requerimento"
              ? "active"
              : ""
          }`}
        >
          Novo Requerimento
        </Link>

        <Link
          to="/solicitacoes"
          className={`nav-item ${
            itemAtivo === "solicitacoes"
              ? "active"
              : ""
          }`}
        >
          Historico de Solicitações
        </Link>

        <button
          className="nav-item logout"
          onClick={handleLogout}
        >
          Sair do Sistema
        </button>

      </nav>
    </aside>
  );
}