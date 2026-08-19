import { BrowserRouter, Routes, Route } from "react-router-dom";
import EsqueciSenha from "./components/esquecisenha/EsqueciSenha";
import RedefinirSenha from "./components/esquecisenha/RedefinirSenha";
import Login from "./components/login/Login";
import Cadastro from "./components/cadastro/Cadastro";
import DashboardAluno from "./components/DashboardAluno/DashboardAluno";
import DashboardAdmin from "./components/dashboardAdmin/DashboardAdmin";
import NovoRequerimento from "./components/novorequerimento/NovoRequerimento";
import Solicitacoes from "./components/solicitacoes/Solicitacoes";
import AnaliseRequerimento from "./components/analiseRequerimento/AnaliseRequerimento";
import GerenciarUsuarios from "./components/gerenciar-usuarios/GerenciarUsuarios";
import NovoUsuario from "./components/novoUsuario/novoUsuario";
import ProtectedRoute from "./components/ProtectedRoute";
import GerenciarEmails from "./components/GerenciarEmails/GerenciarEmails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route
          path="/redefinir-senha/:token"
          element={<RedefinirSenha />}
        />
        <Route
          path="/dashboardAluno"
          element={
            <ProtectedRoute tiposPermitidos={["ALUNO"]}>
              <DashboardAluno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/novorequerimento"
          element={
            <ProtectedRoute tiposPermitidos={["ALUNO"]}>
              <NovoRequerimento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitacoes"
          element={
            <ProtectedRoute tiposPermitidos={["ADMIN", "ALUNO"]}>
              <Solicitacoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analiserequerimento/:id"
          element={
            <ProtectedRoute tiposPermitidos={["ALUNO", "ADMIN"]}>
              <AnaliseRequerimento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardAdmin"
          element={
            <ProtectedRoute tiposPermitidos={["ADMIN"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciarUsuarios"
          element={
            <ProtectedRoute tiposPermitidos={["ADMIN"]}>
              <GerenciarUsuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/novoUsuario"
          element={
            <ProtectedRoute tiposPermitidos={["ADMIN"]}>
              <NovoUsuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<h1>404 - Página Não Encontrada</h1>}
        />
        
        {/*<Route
          path="/gerenciaremails"
          element={
            <ProtectedRoute tiposPermitidos={["ADMIN"]}>
            <GerenciarEmails />
          </ProtectedRoute>
          }
        />*/}
      </Routes>
    </BrowserRouter>
  );
}