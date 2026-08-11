import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './GerenciarUsuarios.css'
import SidebarAdmin from '../layout/sidebar/SidebarAdmin'

export default function GerenciarUsuarios() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const [usuarios, setUsuarios] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [formEdicao, setFormEdicao] = useState({
    nome: '',
    email: '',
    matricula: '',
    tipo: ''
  })
  const [modal, setModal] = useState({
    aberto: false,
    titulo: '',
    mensagem: '',
    tipo: 'info'
  })

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function carregarUsuarios() {
    try {
      const response = await api.get('/usuarios')
      setUsuarios(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      abrirModal(
        'Erro',
        'Não foi possível carregar os usuários.',
        'erro'
      )
    }
  }

  function voltarDashboard() {
    if (usuario?.tipo === 'ADMIN') {
      navigate('/dashboardadmin')
    } else if (usuario?.tipo === 'SERVIDOR') {
      navigate('/dashboardservidor')
    } else {
      navigate('/dashboardaluno')
    }
  }

  function abrirModal(titulo, mensagem, tipo = 'info') {
    setModal({
      aberto: true,
      titulo,
      mensagem,
      tipo
    })
  }

  function fecharModal() {
    setModal({
      aberto: false,
      titulo: '',
      mensagem: '',
      tipo: 'info'
    })
  }

  async function alterarStatus(id, ativo) {
    try {
      await api.put(`/usuarios/${id}/bloquear`)
      await carregarUsuarios()
      abrirModal(
        'Sucesso',
        ativo
          ? 'Usuário bloqueado com sucesso.'
          : 'Usuário desbloqueado com sucesso.',
        'sucesso'
      )
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      abrirModal(
        'Erro',
        'Não foi possível alterar o status do usuário.',
        'erro'
      )
    }
  }

  function abrirEdicao(usuario) {
    setUsuarioEditando(usuario)
    setFormEdicao({
      nome: usuario.nome || '',
      email: usuario.email || '',
      matricula: usuario.matricula || '',
      tipo: usuario.tipo || ''
    })
  }

  function fecharEdicao() {
    if (salvando) return
    setUsuarioEditando(null)
    setFormEdicao({
      nome: '',
      email: '',
      matricula: '',
      tipo: ''
    })
  }

  function alterarCampo(event) {
    const { name, value } = event.target
    setFormEdicao(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function salvarEdicao(event) {
    event.preventDefault()

    if (!formEdicao.nome.trim()) {
      abrirModal(
        'Campo obrigatório',
        'Informe o nome do usuário.',
        'erro'
      )
      return
    }

    if (!formEdicao.email.trim()) {
      abrirModal(
        'Campo obrigatório',
        'Informe o e-mail do usuário.',
        'erro'
      )
      return
    }

    if (!formEdicao.tipo) {
      abrirModal(
        'Campo obrigatório',
        'Selecione o perfil do usuário.',
        'erro'
      )
      return
    }

    try {
      setSalvando(true)

      await api.put(`/usuarios/${usuarioEditando.id}`, {
        nome: formEdicao.nome.trim(),
        email: formEdicao.email.trim(),
        matricula: formEdicao.matricula.trim() || null,
        tipo: formEdicao.tipo
      })

      setUsuarioEditando(null)

      setFormEdicao({
        nome: '',
        email: '',
        matricula: '',
        tipo: ''
      })

      await carregarUsuarios()

      abrirModal(
        'Sucesso',
        'Usuário atualizado com sucesso!',
        'sucesso'
      )
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)

      const mensagem =
        error.response?.data?.message ||
        'Não foi possível atualizar o usuário.'

      abrirModal(
        'Erro',
        mensagem,
        'erro'
      )
    } finally {
      setSalvando(false)
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario => {
    const nome = usuario.nome || ''
    const email = usuario.email || ''
    const textoBusca = busca.toLowerCase()

    const correspondeBusca =
      nome.toLowerCase().includes(textoBusca) ||
      email.toLowerCase().includes(textoBusca)

    const correspondeTipo =
      filtroTipo === '' ||
      usuario.tipo === filtroTipo

    return correspondeBusca && correspondeTipo
  })

  return (
    <div className="dashboard-container">
      <SidebarAdmin itemAtivo="gerenciar-usuarios" />

      <main className="admin-content users-content">
        <header className="users-header">
          <div className="users-title-group">
            <button
              type="button"
              className="btn-voltar"
              onClick={voltarDashboard}
            >
              ← Voltar
            </button>

            <h2>
              Gerenciar <span>Usuários</span>
            </h2>

            <p>
              Controle os acessos e permissões dos usuários cadastrados.
            </p>
          </div>

          <button
            type="button"
            className="btn-gerenciar"
            onClick={() => navigate('/novousuario')}
          >
            Novo Usuário +
          </button>
        </header>

        <section className="users-toolbar">
          <input
            type="text"
            className="search-box"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={event => setBusca(event.target.value)}
          />

          <select
            className="filter-select"
            value={filtroTipo}
            onChange={event => setFiltroTipo(event.target.value)}
          >
            <option value="">
              Todos os Perfis
            </option>

            <option value="ALUNO">
              Aluno
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>
        </section>

        <section className="admin-table-section">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Matrícula</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty-table"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map(usuario => (
                    <tr key={usuario.id}>
                      <td>
                        <strong>
                          {usuario.nome}
                        </strong>

                        <br />

                        {usuario.email}
                      </td>

                      <td>
                        {usuario.tipo}
                      </td>

                      <td>
                        {usuario.matricula || '-'}
                      </td>

                      <td>
                        <span
                          className={
                            usuario.ativo
                              ? 'status-ativo'
                              : 'status-bloqueado'
                          }
                        >
                          {usuario.ativo
                            ? 'Ativo'
                            : 'Bloqueado'}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn-action btn-light-green"
                          onClick={() =>
                            abrirEdicao(usuario)
                          }
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn-action btn-light-green"
                          onClick={() =>
                            alterarStatus(
                              usuario.id,
                              usuario.ativo
                            )
                          }
                        >
                          {usuario.ativo
                            ? 'Bloquear'
                            : 'Desbloquear'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {usuarioEditando && (
        <div
          className="edit-modal-overlay"
          onMouseDown={event => {
            if (
              event.target === event.currentTarget &&
              !salvando
            ) {
              fecharEdicao()
            }
          }}
        >
          <div className="edit-modal">
            <div className="edit-modal-header">
              <div>
                <h3>
                  Editar Usuário
                </h3>

                <p>
                  Atualize os dados do usuário cadastrado.
                </p>
              </div>

              <button
                type="button"
                className="edit-modal-close"
                onClick={fecharEdicao}
                disabled={salvando}
              >
                ×
              </button>
            </div>

            <form
              className="edit-form"
              onSubmit={salvarEdicao}
            >
              <div className="edit-form-group">
                <label htmlFor="nome">
                  Nome
                </label>

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formEdicao.nome}
                  onChange={alterarCampo}
                  placeholder="Digite o nome"
                  disabled={salvando}
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formEdicao.email}
                  onChange={alterarCampo}
                  placeholder="Digite o e-mail"
                  disabled={salvando}
                />
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="matricula">
                    Matrícula
                  </label>

                  <input
                    id="matricula"
                    name="matricula"
                    type="text"
                    value={formEdicao.matricula}
                    onChange={alterarCampo}
                    placeholder="Digite a matrícula"
                    disabled={salvando}
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="tipo">
                    Perfil
                  </label>

                  <select
                    id="tipo"
                    name="tipo"
                    value={formEdicao.tipo}
                    onChange={alterarCampo}
                    disabled={salvando}
                  >
                    <option value="ALUNO">
                      Aluno
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              <div className="edit-modal-actions">
                <button
                  type="button"
                  className="btn-cancelar-edit"
                  onClick={fecharEdicao}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-salvar-edit"
                  disabled={salvando}
                >
                  {salvando
                    ? 'Salvando...'
                    : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal.aberto && (
        <div
          className="edit-modal-overlay"
          onMouseDown={event => {
            if (
              event.target === event.currentTarget
            ) {
              fecharModal()
            }
          }}
        >
          <div
            className={
              `edit-modal message-modal ${modal.tipo}`
            }
          >
            <div className="edit-modal-header">
              <div>
                <h3>
                  {modal.titulo}
                </h3>

                <p>
                  {modal.mensagem}
                </p>
              </div>

              <button
                type="button"
                className="edit-modal-close"
                onClick={fecharModal}
              >
                ×
              </button>
            </div>

            <div className="message-modal-actions">
              <button
                type="button"
                className="btn-salvar-edit"
                onClick={fecharModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}