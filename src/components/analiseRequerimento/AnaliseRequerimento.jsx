import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../../services/api";

import SidebarServidor from "../layout/sidebar/SidebarServidor";
import SidebarAdmin from "../layout/sidebar/SidebarAdmin";
import SidebarAluno from "../layout/sidebar/SidebarAluno";

import "./AnaliseRequerimento.css";

export default function AnaliseRequerimento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const podeAnalisar =
    usuario?.tipo === "ADMIN" ||
    usuario?.tipo === "SERVIDOR";

  const [requerimento, setRequerimento] =
    useState(null);

  async function carregarRequerimento() {
    try {
      const response = await api.get(
        `/requerimentos/${id}`
      );

      setRequerimento(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.erro ||
          "Erro ao carregar requerimento"
      );
    }
  }

  async function atualizarStatus(status) {
    try {
      const response = await api.patch(
        `/requerimentos/${id}/status`,
        { status }
      );

      alert(response.data.mensagem);

      await carregarRequerimento();

      navigate("/solicitacoes");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.erro ||
          "Erro ao atualizar status"
      );
    }
  }

  useEffect(() => {
    carregarRequerimento();
  }, [id]);

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

  if (!requerimento) {
    return (
      <div className="dashboard-container">
        {renderSidebar()}

        <main className="admin-content">
          <h2>Carregando...</h2>
        </main>
      </div>
    );
  }

  const finalizado = [
    "Deferido",
    "Indeferido",
  ].includes(requerimento.status);

  return (
    <div className="dashboard-container">

      {renderSidebar()}

      <main className="admin-content">

        <header className="analise-header">

          <button
            className="btn-voltar"
            onClick={() =>
              navigate("/solicitacoes")
            }
          >
            ← Voltar
          </button>

          <div className="analise-title-group">

            <h2>
              {podeAnalisar
                ? "Analisar Requerimento"
                : "Detalhes do Requerimento"}

              <span>
                {" "}
                {requerimento.protocolo}
              </span>
            </h2>

            <p>
              Revise as informações do
              requerimento.
            </p>

          </div>

        </header>

        <div className="analise-grid">

          <div>

            <section className="info-section">

              <h3>Dados do Aluno</h3>

              <div className="info-grid">

                <div className="info-box">
                  <label>Nome</label>

                  <p>
                    {
                      requerimento.usuario
                        ?.nome
                    }
                  </p>
                </div>

                <div className="info-box">
                  <label>
                    Matrícula
                  </label>

                  <p>
                    {
                      requerimento.usuario
                        ?.matricula
                    }
                  </p>
                </div>

                <div className="info-box">
                  <label>Curso</label>

                  <p>
                    {
                      requerimento.cursoAtual
                    }
                  </p>
                </div>

              </div>

            </section>

            <section className="info-section">

              <h3>
                Detalhes do Requerimento
              </h3>

              <div className="info-grid">

                <div className="info-box">
                  <label>Tipo</label>

                  <p>
                    {requerimento.tipo}
                  </p>
                </div>

                <div className="info-box">
                  <label>Data</label>

                  <p>
                    {new Date(
                      requerimento.criadoEm
                    ).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>

                <div className="info-box">
                  <label>Status</label>

                  <p>
                    {requerimento.status}
                  </p>
                </div>

              </div>

              <div className="info-box">

                <label>
                  Justificativa
                </label>

                <div className="justificativa-box">
                  {
                    requerimento.descricao
                  }
                </div>

              </div>

            </section>

          </div>

          <aside>

            <section className="info-section">

              <h3>Documentos</h3>

              {requerimento.anexos
                ?.length === 0 && (
                <p>
                  Nenhum documento.
                </p>
              )}

              {requerimento.anexos?.map(
                (anexo) => (
                  <div
                    className="document-card"
                    key={anexo.id}
                  >

                    <span>
                      {
                        anexo.nomeArquivo
                      }
                    </span>

                    <a
                      href={`http://localhost:3000/uploads/${anexo.caminho}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Baixar
                    </a>

                  </div>
                )
              )}

            </section>

            {podeAnalisar && (

              <section className="info-section">

                <h3>Decisão</h3>

                <div className="action-buttons">

                  <button
                    disabled={
                      finalizado
                    }
                    className="btn-decisao btn-deferir"
                    onClick={() =>
                      atualizarStatus(
                        "Deferido"
                      )
                    }
                  >
                    Deferir
                  </button>

                  <button
                    disabled={
                      finalizado
                    }
                    className="btn-decisao btn-ajuste"
                    onClick={() =>
                      atualizarStatus(
                        "Aguardando Ajuste"
                      )
                    }
                  >
                    Solicitar Ajuste
                  </button>

                  <button
                    disabled={
                      finalizado
                    }
                    className="btn-decisao btn-indeferir"
                    onClick={() =>
                      atualizarStatus(
                        "Indeferido"
                      )
                    }
                  >
                    Indeferir
                  </button>

                </div>

              </section>

            )}

          </aside>

        </div>

      </main>

    </div>
  );
}