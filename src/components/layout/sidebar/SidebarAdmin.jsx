import { Link, useNavigate } from "react-router-dom";
import "./SidebarAdmin.css";

export default function SidebarAdmin({
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
          to="/dashboardAdmin"
          className={`nav-item ${
            itemAtivo === "visao-geral"
              ? "active"
              : ""
          }`}
        >
          Dashboard Admin
        </Link>

        <Link
          to="/gerenciarUsuarios"
          className={`nav-item ${
            itemAtivo === "gerenciar-usuarios"
              ? "active"
              : ""
          }`}
        >
          Gerenciar Usuários
        </Link>

        <Link
          to="/gerenciaremails"
          className={`nav-item ${
            itemAtivo === "gerenciar-emails"
              ? "active"
              : ""
          }`}
        >
          Gerenciar E-mails
        </Link>

        <Link
          to="/solicitacoes"
          className={`nav-item ${
            itemAtivo === "solicitacoes"
              ? "active"
              : ""
          }`}
        >
          Solicitações
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