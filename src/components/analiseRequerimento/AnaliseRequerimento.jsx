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

  const podeEncaminhar =
    usuario?.tipo === "ADMIN";

  const [requerimento, setRequerimento] =
    useState(null);

  const [encaminhando, setEncaminhando] =
    useState(false);

  const [mensagem, setMensagem] =
    useState("");

  const [tipoMensagem, setTipoMensagem] =
    useState("");

  const [modalMensagem, setModalMensagem] =
    useState(false);

  // =========================
  // CARREGAR REQUERIMENTO
  // =========================

  useEffect(() => {
    carregarRequerimento();
  }, [id]);

  async function carregarRequerimento() {
    try {
      const response = await api.get(
        `/requerimentos/${id}`
      );

      setRequerimento(response.data);
    } catch (error) {
      console.error(
        "Erro ao carregar requerimento:",
        error
      );

      mostrarMensagem(
        error.response?.data?.erro ||
          "Erro ao carregar requerimento.",
        "erro"
      );
    }
  }

  // =========================
  // ENCAMINHAR REQUERIMENTO
  // =========================

  async function encaminharRequerimento() {
    try {
      setEncaminhando(true);

      const response = await api.patch(
        `/requerimentos/${id}/status`,
        {
          status: "ENCAMINHADO",
        }
      );

      setRequerimento(response.data);

      mostrarMensagem(
        "Requerimento encaminhado com sucesso.",
        "sucesso"
      );
    } catch (error) {
      console.error(
        "Erro ao encaminhar requerimento:",
        error
      );

      mostrarMensagem(
        error.response?.data?.erro ||
          "Erro ao encaminhar requerimento.",
        "erro"
      );
    } finally {
      setEncaminhando(false);
    }
  }

  // =========================
  // MENSAGEM
  // =========================

  function mostrarMensagem(
    texto,
    tipo
  ) {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setModalMensagem(true);
  }

  function fecharMensagem() {
    setModalMensagem(false);
    setMensagem("");
    setTipoMensagem("");
  }

  // =========================
  // SIDEBAR
  // =========================

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

  // =========================
  // FORMATAR DATA
  // =========================

  function formatarData(data) {
    if (!data) {
      return "-";
    }

    const dataFormatada =
      new Date(data);

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

  // =========================
  // STATUS
  // =========================

  const encaminhado =
    requerimento?.status ===
    "ENCAMINHADO";

  // =========================
  // CARREGANDO
  // =========================

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

  // =========================
  // TELA
  // =========================

  return (
    <div className="dashboard-container">
      {renderSidebar()}

      <main className="admin-content">

        {/* =========================
            CABEÇALHO
        ========================= */}

        <header className="analise-header">

          <button
            type="button"
            className="btn-voltar"
            onClick={() =>
              navigate("/solicitacoes")
            }
          >
            ← Voltar
          </button>

          <div className="analise-title-group">

            <h2>
              {podeEncaminhar
                ? "Encaminhar Requerimento"
                : "Detalhes do Requerimento"}

              <span>
                {" "}
                {requerimento.protocolo}
              </span>
            </h2>

            <p>
              Revise as informações do requerimento
              antes do encaminhamento.
            </p>

          </div>
        </header>

        {/* =========================
            GRID PRINCIPAL
        ========================= */}

        <div className="analise-grid">

          {/* =========================
              COLUNA ESQUERDA
          ========================= */}

          <div>

            {/* DADOS DO ALUNO */}

            <section className="info-section">

              <h3>Dados do Aluno</h3>

              <div className="info-grid">

                <div className="info-box">
                  <label>Nome</label>

                  <p>
                    {requerimento.usuario?.nome ||
                      "-"}
                  </p>
                </div>

                <div className="info-box">
                  <label>Matrícula</label>

                  <p>
                    {requerimento.usuario
                      ?.matricula || "-"}
                  </p>
                </div>

                <div className="info-box">
                  <label>Curso</label>

                  <p>
                    {requerimento.cursoAtual ||
                      "-"}
                  </p>
                </div>

              </div>

            </section>

            {/* DETALHES DO REQUERIMENTO */}

            <section className="info-section">

              <h3>
                Detalhes do Requerimento
              </h3>

              <div className="info-grid">

                <div className="info-box">
                  <label>Tipo</label>

                  <p>
                    {requerimento.tipo ||
                      "-"}
                  </p>
                </div>

                <div className="info-box">
                  <label>Data</label>

                  <p>
                    {formatarData(
                      requerimento.criadoEm
                    )}
                  </p>
                </div>

                <div className="info-box">
                  <label>Status</label>

                  <p>

                    <span
                      className={`status-requerimento ${
                        encaminhado
                          ? "status-encaminhado"
                          : "status-nao-encaminhado"
                      }`}
                    >
                      {encaminhado
                        ? "Encaminhado"
                        : "Não encaminhado"}
                    </span>

                  </p>
                </div>

              </div>

              <div className="info-box">

                <label>
                  Justificativa
                </label>

                <div className="justificativa-box">

                  {requerimento.descricao ||
                    "Nenhuma justificativa informada."}

                </div>

              </div>

            </section>

          </div>

          {/* =========================
              COLUNA DIREITA
          ========================= */}

          <aside>

            {/* DOCUMENTOS */}

            <section className="info-section">

              <h3>Documentos</h3>

              {!requerimento.anexos ||
              requerimento.anexos.length ===
                0 ? (
                <p>
                  Nenhum documento anexado.
                </p>
              ) : (

                <div className="document-list">

                  {requerimento.anexos.map(
                    (anexo) => (

                      <div
                        className="document-card"
                        key={anexo.id}
                      >

                        <span>
                          {anexo.nomeArquivo ||
                            "Documento"}
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

                </div>

              )}

            </section>

            {/* =========================
                ENCAMINHAMENTO
            ========================= */}

            {podeEncaminhar && (

              <section className="info-section encaminhamento-section">

                <h3>
                  Encaminhamento
                </h3>

                {encaminhado ? (

                  <div className="encaminhamento-finalizado">

                    <div className="encaminhamento-status">

                      <span>
                        ✓
                      </span>

                      <div>

                        <strong>
                          Requerimento encaminhado
                        </strong>

                        <p>
                          Este requerimento já foi
                          encaminhado para análise.
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <button
                    type="button"
                    className="btn-encaminhar"
                    onClick={
                      encaminharRequerimento
                    }
                    disabled={encaminhando}
                  >

                    {encaminhando
                      ? "Encaminhando..."
                      : "Encaminhar requerimento"}

                  </button>

                )}

              </section>

            )}

          </aside>

        </div>

      </main>

      {/* =========================
          MODAL DE MENSAGEM
      ========================= */}

      {modalMensagem && (

        <div className="analise-modal-overlay">

          <div
            className={`analise-modal ${tipoMensagem}`}
          >

            <div className="analise-modal-icon">

              {tipoMensagem ===
              "sucesso"
                ? "✓"
                : "!"}

            </div>

            <h3>

              {tipoMensagem ===
              "sucesso"
                ? "Sucesso"
                : "Atenção"}

            </h3>

            <p>
              {mensagem}
            </p>

            <button
              type="button"
              className="btn-modal-ok"
              onClick={
                fecharMensagem
              }
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
  );
}