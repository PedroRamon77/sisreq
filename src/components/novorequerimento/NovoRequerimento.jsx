import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./NovoRequerimento.css";

const UploadIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default function NovoRequerimento() {
  const navigate = useNavigate();

  const hoje = new Date();

  const semestreAtual =
    hoje.getMonth() < 6
      ? `${hoje.getFullYear()}.1`
      : `${hoje.getFullYear()}.2`;

  const [semestre] = useState(semestreAtual);
  const [curso, setCurso] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexo, setAnexo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cancelar = () => {
    navigate("/dashboardaluno");
  };

  async function enviar(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("tipo", tipo);
      formData.append("descricao", descricao);
      formData.append("semestreAtual", semestre);
      formData.append("cursoAtual", curso);

      if (anexo) {
        formData.append("anexos", anexo);
      }

      await api.post("/requerimentos", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

    setCurso("");
    setTipo("");
    setDescricao("");
    setAnexo(null);

    setModalSucesso(true);
    } catch (error) {
      alert(
        error.response?.data?.erro ||
          "Erro ao enviar requerimento."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="requerimento-page">
      <div className="back-link">
        <Link
          to="/dashboardaluno"
          className="back-button"
        >
          <span className="back-arrow">←</span>
          <span>Voltar ao Painel</span>
        </Link>
      </div>

      <div className="requerimento-card">
        <div className="form-header">
          <h1 className="form-title">
            Novo Requerimento
          </h1>

          <p className="form-subtitle">
            Confira seus dados e preencha as informações abaixo para registrar sua solicitação acadêmica.
          </p>
        </div>

        <form onSubmit={enviar}>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">
                Matrícula
              </label>

              <input
                className="input"
                value={usuario?.matricula || ""}
                disabled
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                Semestre Atual
              </label>

              <input
                className="input"
                value={semestre}
                disabled
              />
            </div>

            <div className="input-group full">
              <label className="input-label">
                Curso Atual
              </label>

              <select
                className="select"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                required
              >
                <option value="">
                  Selecione o curso
                </option>

                <option>
                  Bacharelado em Sistemas de Informação
                </option>

                <option>
                  Engenharia Elétrica
                </option>

                <option>
                  Engenharia Mecânica
                </option>
              </select>
            </div>

            <div className="input-group full">
              <label className="input-label">
                Tipo de Solicitação
              </label>

              <select
                className="select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value="">
                  Selecione o tipo de solicitação
                </option>

                <option>
                  Trancamento de Disciplina
                </option>

                <option>
                  Atestado
                </option>

                <option>
                  Aproveitamento
                </option>

                <option>
                  Segunda Chamada
                </option>
              </select>
            </div>

            <div className="input-group full">
              <label className="input-label">
                Descrição
              </label>

              <textarea
                className="textarea"
                placeholder="Descreva detalhadamente sua solicitação..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="input-group full">
              <label className="input-label">
                Documento Anexado
              </label>

              <label className="upload-area">
                <div className="upload-content">
                  <div className="upload-icon">
                    <UploadIcon />
                  </div>

                  <div>
                    <div className="upload-title">
                      {anexo
                        ? anexo.name
                        : "Clique para selecionar um arquivo"}
                    </div>

                    <div className="upload-subtitle">
                      PDF, PNG, JPG ou JPEG
                    </div>
                  </div>
                </div>

                <input
                  hidden
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setAnexo(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={cancelar}
            >
              Cancelar
            </button>

            <button
              className="btn-enviar"
              disabled={loading}
            >
              {loading
                ? "Enviando..."
                : "Enviar Solicitação"}
            </button>
          </div>
        </form>
      </div>
{modalSucesso && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-icon-success">✓</div>

      <h2>Requerimento enviado!</h2>

      <button
        type="button"
        className="btn-enviar"
        onClick={() => {
          setModalSucesso(false);
          navigate("/dashboardaluno");
        }}
      >
        Voltar ao painel
      </button>
    </div>
  </div>
)}
    </div>
  );
}