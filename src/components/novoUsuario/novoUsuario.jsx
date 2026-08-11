import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import SidebarAdmin from "../layout/sidebar/SidebarAdmin";

import "./novoUsuario.css";

export default function NovoUsuario() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("ALUNO");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/usuarios", {
        nome,
        email,
        matricula,
        senha,
        tipo,
      });

      alert("Usuário cadastrado com sucesso!");

      navigate("/gerenciarusuarios");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.erro ||
          "Erro ao cadastrar usuário"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-container">

      <SidebarAdmin itemAtivo="gerenciar-usuarios" />

      <main className="admin-content">

        <div className="novo-usuario-card">

          <div className="novo-usuario-header">

            <h2>
              Cadastrar Usuário
            </h2>

            <p>
              Preencha os dados para criar um novo usuário no sistema.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Nome
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Matrícula
              </label>

              <input
                type="text"
                value={matricula}
                onChange={(e) =>
                  setMatricula(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                Tipo de Usuário
              </label>

              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value)
                }
              >
                <option value="ALUNO">
                  Aluno
                </option>

                <option value="ADMIN">
                  Administrador
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                required
              />

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="btn-cancelar"
                onClick={() =>
                  navigate(
                    "/gerenciarusuarios"
                  )
                }
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-salvar"
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : "Cadastrar Usuário"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}