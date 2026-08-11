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
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const podeEncaminhar = usuario?.tipo === "ADMIN";
  const [requerimento, setRequerimento] = useState(null);
  const [emails, setEmails] = useState([]);
  const [emailSelecionado, setEmailSelecionado] = useState("");
  const [encaminhando, setEncaminhando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [modalMensagem, setModalMensagem] = useState(false);

  useEffect(() => {
    carregarRequerimento();
    carregarEmails();
  }, [id]);

  async function carregarRequerimento() {
    try {
      const response = await api.get(`/requerimentos/${id}`);
      setRequerimento(response.data);
    } catch (error) {
      console.error("Erro ao carregar requerimento:", error);
      mostrarMensagem(
        error.response?.data?.erro || "Erro ao carregar requerimento.",
        "erro"
      );
    }
  }

  function carregarEmails() {
    const dadosSalvos = localStorage.getItem("destinatariosEncaminhamento");

    if (!dadosSalvos) {
      setEmails([]);
      return;
    }

    try {
      const lista = JSON.parse(dadosSalvos);

      const emailsAtivos = Array.isArray(lista)
        ? lista.filter((item) => item.ativo)
        : [];

      setEmails(emailsAtivos);

      const emailPadrao = emailsAtivos.find((item) => item.padrao);

      if (emailPadrao) {
        setEmailSelecionado(String(emailPadrao.id));
      }
    } catch (error) {
      console.error("Erro ao carregar destinatários:", error);
      setEmails([]);
    }
  }

  async function encaminharRequerimento() {
    if (!emailSelecionado) {
      mostrarMensagem(
        "Selecione um destinatário antes de encaminhar o requerimento.",
        "erro"
      );
      return;
    }

    const destinatario = emails.find(
      (item) => String(item.id) === String(emailSelecionado)
    );

    if (!destinatario) {
      mostrarMensagem(
        "O destinatário selecionado não está disponível.",
        "erro"
      );
      return;
    }

    try {
      setEncaminhando(true);

      /*
       * Quando o endpoint estiver implementado no backend,
       * substitua o bloco abaixo pela chamada da API.
       *
       * Exemplo:
       *
       * await api.patch(
       *   `/requerimentos/${id}/encaminhar`,
       *   {
       *     email: destinatario.email
       *   }
       * );
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      setRequerimento((atual) => ({
        ...atual,
        status: "Encaminhado",
        emailEncaminhamento: destinatario.email,
        destinatarioEncaminhamento: destinatario.nome
      }));

      mostrarMensagem(
        `Requerimento encaminhado para ${destinatario.email}.`,
        "sucesso"
      );
    } catch (error) {
      console.error("Erro ao encaminhar requerimento:", error);

      mostrarMensagem(
        error.response?.data?.erro || "Erro ao encaminhar requerimento.",
        "erro"
      );
    } finally {
      setEncaminhando(false);
    }
  }

  function mostrarMensagem(texto, tipo) {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setModalMensagem(true);
  }

  function fecharMensagem() {
    setModalMensagem(false);
    setMensagem("");
    setTipoMensagem("");
  }

  function renderSidebar() {
    if (usuario?.tipo === "ADMIN") {
      return <SidebarAdmin itemAtivo="solicitacoes" />;
    }

    if (usuario?.tipo === "SERVIDOR") {
      return <SidebarServidor itemAtivo="solicitacoes" />;
    }

    return <SidebarAluno itemAtivo="solicitacoes" />;
  }

  function formatarData(data) {
    if (!data) {
      return "-";
    }

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return "-";
    }

    return dataFormatada.toLocaleDateString("pt-BR");
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

  const encaminhado = requerimento.status === "Encaminhado";

  const destinatarioAtual = emails.find(
    (item) => item.email === requerimento.emailEncaminhamento
  );

  return (
    <div className="dashboard-container">
      {renderSidebar()}

      <main className="admin-content">
        <header className="analise-header">
          <button
            type="button"
            className="btn-voltar"
            onClick={() => navigate("/solicitacoes")}
          >
            ← Voltar
          </button>

          <div className="analise-title-group">
            <h2>
              {podeEncaminhar
                ? "Encaminhar Requerimento"
                : "Detalhes do Requerimento"}

              <span> {requerimento.protocolo}</span>
            </h2>

            <p>
              Revise as informações do requerimento antes do encaminhamento.
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
                    {requerimento.usuario?.nome || "-"}
                  </p>
                </div>

                <div className="info-box">
                  <label>Matrícula</label>

                  <p>
                    {requerimento.usuario?.matricula || "-"}
                  </p>
                </div>

                <div className="info-box">
                  <label>Curso</label>

                  <p>
                    {requerimento.cursoAtual || "-"}
                  </p>
                </div>
              </div>
            </section>

            <section className="info-section">
              <h3>Detalhes do Requerimento</h3>

              <div className="info-grid">
                <div className="info-box">
                  <label>Tipo</label>

                  <p>
                    {requerimento.tipo || "-"}
                  </p>
                </div>

                <div className="info-box">
                  <label>Data</label>

                  <p>
                    {formatarData(requerimento.criadoEm)}
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
                      {requerimento.status || "Não encaminhado"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="info-box">
                <label>Justificativa</label>

                <div className="justificativa-box">
                  {requerimento.descricao ||
                    "Nenhuma justificativa informada."}
                </div>
              </div>
            </section>
          </div>

          <aside>
            <section className="info-section">
              <h3>Documentos</h3>

              {!requerimento.anexos ||
              requerimento.anexos.length === 0 ? (
                <p>Nenhum documento anexado.</p>
              ) : (
                <div className="document-list">
                  {requerimento.anexos.map((anexo) => (
                    <div
                      className="document-card"
                      key={anexo.id}
                    >
                      <span>
                        {anexo.nomeArquivo || "Documento"}
                      </span>

                      <a
                        href={`http://localhost:3000/uploads/${anexo.caminho}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Baixar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {podeEncaminhar && (
              <section className="info-section encaminhamento-section">
                <h3>Encaminhamento</h3>

                {encaminhado ? (
                  <div className="encaminhamento-finalizado">
                    <div className="encaminhamento-status">
                      <span>✓</span>

                      <div>
                        <strong>
                          Requerimento encaminhado
                        </strong>

                        <p>
                          O requerimento já foi encaminhado
                          para o destinatário selecionado.
                        </p>
                      </div>
                    </div>

                    <div className="encaminhamento-dados">
                      <div>
                        <label>Destinatário</label>

                        <p>
                          {requerimento.destinatarioEncaminhamento ||
                            destinatarioAtual?.nome ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <label>E-mail</label>

                        <p>
                          {requerimento.emailEncaminhamento || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-group-email">
                      <label htmlFor="emailEncaminhamento">
                        Destinatário
                      </label>

                      {emails.length === 0 ? (
                        <div className="sem-destinatarios">
                          <strong>
                            Nenhum destinatário disponível.
                          </strong>

                          <p>
                            Cadastre e ative um e-mail em
                            Gerenciar E-mails antes de
                            encaminhar.
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              navigate("/gerenciaremails")
                            }
                          >
                            Gerenciar e-mails
                          </button>
                        </div>
                      ) : (
                        <>
                          <select
                            id="emailEncaminhamento"
                            value={emailSelecionado}
                            onChange={(event) =>
                              setEmailSelecionado(
                                event.target.value
                              )
                            }
                          >
                            <option value="">
                              Selecione um destinatário
                            </option>

                            {emails.map((item) => (
                              <option
                                key={item.id}
                                value={item.id}
                              >
                                {item.nome} — {item.email}
                              </option>
                            ))}
                          </select>

                          {emailSelecionado && (
                            <div className="email-selecionado">
                              {(() => {
                                const item = emails.find(
                                  (email) =>
                                    String(email.id) ===
                                    String(emailSelecionado)
                                );

                                if (!item) {
                                  return null;
                                }

                                return (
                                  <>
                                    <strong>
                                      {item.nome}
                                    </strong>

                                    <span>
                                      {item.email}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {emails.length > 0 && (
                      <button
                        type="button"
                        className="btn-encaminhar"
                        onClick={encaminharRequerimento}
                        disabled={
                          encaminhando ||
                          !emailSelecionado
                        }
                      >
                        {encaminhando
                          ? "Encaminhando..."
                          : "Encaminhar requerimento"}
                      </button>
                    )}
                  </>
                )}
              </section>
            )}
          </aside>
        </div>
      </main>

      {modalMensagem && (
        <div className="analise-modal-overlay">
          <div
            className={`analise-modal ${tipoMensagem}`}
          >
            <div className="analise-modal-icon">
              {tipoMensagem === "sucesso" ? "✓" : "!"}
            </div>

            <h3>
              {tipoMensagem === "sucesso"
                ? "Sucesso"
                : "Atenção"}
            </h3>

            <p>{mensagem}</p>

            <button
              type="button"
              className="btn-modal-ok"
              onClick={fecharMensagem}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}