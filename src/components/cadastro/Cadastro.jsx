import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './Cadastro.css'

const UserPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
)

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [tipoPerfil, setTipoPerfil] = useState('aluno')
  const [matricula, setMatricula] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const converterTipoPerfil = () => {
    if (tipoPerfil === 'aluno') return 'ALUNO'
    if (tipoPerfil === 'servidor') return 'SERVIDOR'
    return 'ADMIN'
  }

  const [modal, setModal] = useState({
  aberto: false,
  titulo: "",
  mensagem: "",
  tipo: "erro",
  });

  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (loading) return

    if (senha !== confirmarSenha) {
    setModal({
    aberto: true,
    titulo: "Senhas diferentes",
    mensagem: "As senhas digitadas não coincidem.",
    tipo: "erro",
    });
  return;
}
    try {
      setLoading(true)

      const response = await api.post('/auth/cadastro', {
        nome,
        email,
        senha,
        tipo: converterTipoPerfil(),
        matricula,
      })

      setModal({
        aberto: true,
        titulo: "Cadastro realizado",
        mensagem:
        response.data.mensagem || "Usuário cadastrado com sucesso.",
        tipo: "sucesso",
});
    } catch (error) {
      setModal({
        aberto: true,
        titulo: "Falha no cadastro",
        mensagem:
        error.response?.data?.erro ||
        "Não foi possível realizar o cadastro.",
        tipo: "erro",
});
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <section className="left-side">
        <div className="hero-content">
          <div className="hero-line" />

          <h1>
            Sis<span>Req.</span>
          </h1>

          <p>
            A nova era da gestão acadêmica no IFCE Cedro.
            Eficiência, transparência e tecnologia
            em um único ecossistema.
          </p>
        </div>
      </section>

      <section className="right-side">
        <div className="cadastro-card">

          <div className="cadastro-icon">
            <UserPlusIcon />
          </div>

          <h2>Criar Conta</h2>

          <p className="subtitle">
            Preencha os dados para ingressar no SisReq.
          </p>

          <form>

            <div className="input-group">
              <label>Nome completo</label>

              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Ex: Lucas Pereira"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>E-mail</label>

              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="nome@ifce.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Senha</label>

              <div className="input-wrapper">
                <input
                  type={showSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowSenha(!showSenha)}
                >
                  {showSenha ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Confirmar senha</label>

              <div className="input-wrapper">
                <input
                  type={showConfirmarSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                >
                  {showConfirmarSenha ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Matrícula</label>

              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Ex: 2023XXXXXXX"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>
            </div>

            <button
              className="cadastro-button"
              type="button"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Enviando...' : 'Solicitar Registro'}
            </button>

          </form>

          <div className="login-text">
            <span>Já possui acesso? </span>

            <a
              href="/"
              className="login-link-button"
            >
              Fazer Login
            </a>
          </div>
        </div>
      </section>

      {modal.aberto && (
  <div
    className="modal-overlay"
    onClick={() =>
      setModal({
        ...modal,
        aberto: false,
      })
    }
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
        onClick={() => {
          setModal({
            ...modal,
            aberto: false,
          });

          if (modal.tipo === "sucesso") {
            navigate("/");
          }
        }}
      >
        Fechar
      </button>
    </div>
  </div>
)}
    </main>
  )
}