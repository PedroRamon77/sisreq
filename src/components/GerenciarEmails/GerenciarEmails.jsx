import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../layout/sidebar/SidebarAdmin";
import "./GerenciarEmails.css";

export default function GerenciarEmails() {
  const navigate = useNavigate();

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  })();

  const [emails, setEmails] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [emailEditando, setEmailEditando] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [modalMensagem, setModalMensagem] = useState(false);

  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [emailExcluindo, setEmailExcluindo] = useState(null);

  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    ativo: true
  });

  useEffect(() => {
    if (usuario?.tipo === "ADMIN") {
      carregarEmails();
    }
  }, []);

  function carregarEmails() {
    const dadosSalvos = localStorage.getItem(
      "destinatariosEncaminhamento"
    );

    if (!dadosSalvos) {
      setEmails([]);
      return;
    }

    try {
      const dados = JSON.parse(dadosSalvos);
      setEmails(Array.isArray(dados) ? dados : []);
    } catch {
      setEmails([]);
    }
  }

  function salvarEmails(lista) {
    setEmails(lista);

    localStorage.setItem(
      "destinatariosEncaminhamento",
      JSON.stringify(lista)
    );
  }

  function abrirCadastro() {
    setModoEdicao(false);
    setEmailEditando(null);

    setFormulario({
      nome: "",
      email: "",
      ativo: true
    });

    setModalAberto(true);
  }

  function abrirEdicao(item) {
    setModoEdicao(true);
    setEmailEditando(item);

    setFormulario({
      nome: item.nome,
      email: item.email,
      ativo: item.ativo
    });

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setModoEdicao(false);
    setEmailEditando(null);

    setFormulario({
      nome: "",
      email: "",
      ativo: true
    });
  }

  function alterarFormulario(event) {
    const { name, value, type, checked } = event.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function salvarDestinatario(event) {
    event.preventDefault();

    const nome = formulario.nome.trim();
    const email = formulario.email.trim();

    if (!nome || !email) {
      mostrarMensagem(
        "Preencha o nome do setor e o e-mail."
      );
      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      mostrarMensagem("Digite um e-mail válido.");
      return;
    }

    const emailDuplicado = emails.some(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.id !== emailEditando?.id
    );

    if (emailDuplicado) {
      mostrarMensagem(
        "Este e-mail já está cadastrado."
      );
      return;
    }

    if (modoEdicao) {
      const listaAtualizada = emails.map((item) =>
        item.id === emailEditando.id
          ? {
              ...item,
              nome,
              email,
              ativo: formulario.ativo
            }
          : item
      );

      salvarEmails(listaAtualizada);
      fecharModal();

      mostrarMensagem(
        "Destinatário atualizado com sucesso."
      );

      return;
    }

    const novoDestinatario = {
      id: Date.now(),
      nome,
      email,
      ativo: formulario.ativo,
      padrao: emails.length === 0
    };

    salvarEmails([
      ...emails,
      novoDestinatario
    ]);

    fecharModal();

    mostrarMensagem(
      "Destinatário cadastrado com sucesso."
    );
  }

  function definirPadrao(id) {
    const destinatario = emails.find(
      (item) => item.id === id
    );

    if (!destinatario) {
      return;
    }

    if (!destinatario.ativo) {
      mostrarMensagem(
        "Ative o destinatário antes de defini-lo como padrão."
      );

      return;
    }

    const listaAtualizada = emails.map((item) => ({
      ...item,
      padrao: item.id === id
    }));

    salvarEmails(listaAtualizada);

    mostrarMensagem(
      `"${destinatario.nome}" foi definido como e-mail padrão.`
    );
  }

  function alterarAtivo(id) {
    const destinatario = emails.find(
      (item) => item.id === id
    );

    if (!destinatario) {
      return;
    }

    if (
      destinatario.ativo &&
      destinatario.padrao
    ) {
      mostrarMensagem(
        "O e-mail padrão não pode ser desativado. Defina outro e-mail como padrão primeiro."
      );

      return;
    }

    const listaAtualizada = emails.map((item) =>
      item.id === id
        ? {
            ...item,
            ativo: !item.ativo
          }
        : item
    );

    salvarEmails(listaAtualizada);
  }

  function solicitarExclusao(item) {
    if (item.padrao) {
      mostrarMensagem(
        "Defina outro e-mail como padrão antes de excluir este destinatário."
      );

      return;
    }

    setEmailExcluindo(item);
    setModalConfirmacao(true);
  }

  function fecharConfirmacao() {
    setModalConfirmacao(false);
    setEmailExcluindo(null);
  }

  function confirmarExclusao() {
    if (!emailExcluindo) {
      return;
    }

    const listaAtualizada = emails.filter(
      (item) => item.id !== emailExcluindo.id
    );

    const haviaPadrao = emailExcluindo.padrao;

    if (
      haviaPadrao &&
      listaAtualizada.length > 0
    ) {
      listaAtualizada[0].padrao = true;
    }

    salvarEmails(listaAtualizada);

    fecharConfirmacao();

    mostrarMensagem(
      "Destinatário excluído com sucesso."
    );
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);
    setModalMensagem(true);
  }

  function fecharMensagem() {
    setModalMensagem(false);
    setMensagem("");
  }

  function voltarDashboard() {
    navigate("/dashboardAdmin");
  }

  if (usuario?.tipo !== "ADMIN") {
    return (
      <div className="acesso-negado-container">
        <div className="acesso-negado-card">
          <div className="acesso-negado-icon">
            !
          </div>

          <h2>Acesso não autorizado</h2>

          <p>
            Apenas administradores podem gerenciar
            os destinatários.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboardAdmin")
            }
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <SidebarAdmin
        itemAtivo="gerenciar-emails"
      />

      <main className="admin-content emails-content">

        <header className="emails-header">

          <button
            type="button"
            className="btn-voltar"
            onClick={voltarDashboard}
          >
            ← Voltar
          </button>

          <div className="emails-title-group">
            <h2>
              Gerenciar{" "}
              <span>Destinatários</span>
            </h2>

            <p>
              Cadastre e defina os e-mails utilizados
              para encaminhar requerimentos.
            </p>
          </div>

          <button
            type="button"
            className="btn-novo-email"
            onClick={abrirCadastro}
          >
            + Novo destinatário
          </button>

        </header>

        <section className="email-info-card">

          <div className="email-info-icon">
            @
          </div>

          <div>
            <strong>E-mail padrão</strong>

            <p>
              Cadastre os destinatários e escolha
              manualmente qual será utilizado como
              padrão nos encaminhamentos.
            </p>
          </div>

        </section>

        <section className="emails-list-section">

          <div className="emails-list-header">

            <div>

              <h3>
                Destinatários cadastrados
              </h3>

              <p>
                {emails.length}{" "}
                {emails.length === 1
                  ? "destinatário cadastrado"
                  : "destinatários cadastrados"}
              </p>

            </div>

          </div>

          {emails.length === 0 ? (

            <div className="emails-vazio">

              <div className="emails-vazio-icon">
                @
              </div>

              <h3>
                Nenhum destinatário
              </h3>

              <p>
                Nenhum e-mail foi cadastrado ainda.
                Cadastre um destinatário para começar.
              </p>

              <button
                type="button"
                onClick={abrirCadastro}
              >
                + Cadastrar destinatário
              </button>

            </div>

          ) : (

            <div className="emails-list">

              {emails.map((item) => (

                <article
                  className={`email-card ${
                    item.ativo
                      ? ""
                      : "email-inativo"
                  }`}
                  key={item.id}
                >

                  <div className="email-card-main">

                    <div className="email-card-icon">
                      @
                    </div>

                    <div className="email-card-info">

                      <div className="email-card-title">

                        <h3>
                          {item.nome}
                        </h3>

                        {item.padrao && (
                          <span className="badge-padrao">
                            ★ Padrão
                          </span>
                        )}

                        {!item.ativo && (
                          <span className="badge-inativo">
                            Inativo
                          </span>
                        )}

                      </div>

                      <p>
                        {item.email}
                      </p>

                    </div>

                  </div>

                  <div className="email-card-actions">

                    {!item.padrao &&
                      item.ativo && (
                        <button
                          type="button"
                          className="btn-padrao"
                          onClick={() =>
                            definirPadrao(
                              item.id
                            )
                          }
                        >
                          Definir como padrão
                        </button>
                      )}

                    <button
                      type="button"
                      className="btn-acao"
                      onClick={() =>
                        abrirEdicao(item)
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn-acao"
                      onClick={() =>
                        alterarAtivo(item.id)
                      }
                    >
                      {item.ativo
                        ? "Desativar"
                        : "Ativar"}
                    </button>

                    <button
                      type="button"
                      className="btn-acao btn-excluir"
                      onClick={() =>
                        solicitarExclusao(item)
                      }
                    >
                      Excluir
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* MODAL CADASTRO / EDIÇÃO */}

      {modalAberto && (
        <div className="email-modal-overlay">

          <div className="email-modal">

            <div className="email-modal-header">

              <div>
                <h3>
                  {modoEdicao
                    ? "Editar destinatário"
                    : "Novo destinatário"}
                </h3>

                <p>
                  Informe os dados do destinatário.
                </p>
              </div>

              <button
                type="button"
                className="btn-fechar-modal"
                onClick={fecharModal}
                aria-label="Fechar"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={salvarDestinatario}
            >

              <div className="form-group-email">

                <label htmlFor="nome">
                  Nome do setor
                </label>

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Ex.: Secretaria Acadêmica"
                  value={formulario.nome}
                  onChange={alterarFormulario}
                />

              </div>

              <div className="form-group-email">

                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ex.: secretaria@ifce.edu.br"
                  value={formulario.email}
                  onChange={alterarFormulario}
                />

              </div>

              <label className="checkbox-email">

                <input
                  type="checkbox"
                  name="ativo"
                  checked={formulario.ativo}
                  onChange={alterarFormulario}
                />

                <span>
                  Destinatário ativo
                </span>

              </label>

              <div className="email-modal-actions">

                <button
                  type="button"
                  className="btn-cancelar-email"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-salvar-email"
                >
                  {modoEdicao
                    ? "Salvar alterações"
                    : "Cadastrar destinatário"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* MODAL DE MENSAGEM */}

      {modalMensagem && (
        <div className="email-modal-overlay">

          <div className="email-modal email-modal-mensagem">

            <button
              type="button"
              className="btn-fechar-modal modal-mensagem-fechar"
              onClick={fecharMensagem}
              aria-label="Fechar"
            >
              ×
            </button>

            <div className="mensagem-icon">
              ✓
            </div>

            <h3>
              Informação
            </h3>

            <p>
              {mensagem}
            </p>

            <button
              type="button"
              className="btn-salvar-email"
              onClick={fecharMensagem}
            >
              OK
            </button>

          </div>

        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}

      {modalConfirmacao &&
        emailExcluindo && (
          <div className="email-modal-overlay">

            <div className="email-modal email-modal-confirmacao">

              <button
                type="button"
                className="btn-fechar-modal confirmacao-fechar"
                onClick={fecharConfirmacao}
                aria-label="Fechar"
              >
                ×
              </button>

              <div className="mensagem-icon mensagem-icon-alerta">
                !
              </div>

              <h3>
                Confirmar exclusão
              </h3>

              <p>
                Deseja realmente excluir o
                destinatário{" "}
                <strong>
                  {emailExcluindo.nome}
                </strong>
                ?
              </p>

              <span className="confirmacao-email">
                {emailExcluindo.email}
              </span>

              <div className="email-modal-actions">

                <button
                  type="button"
                  className="btn-excluir-confirmacao"
                  onClick={confirmarExclusao}
                >
                  Excluir
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}