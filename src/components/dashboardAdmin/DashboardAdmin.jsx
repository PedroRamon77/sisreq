import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './DashboardAdmin.css'
import SidebarAdmin from '../layout/sidebar/SidebarAdmin'

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [dados, setDados] = useState({
    totalAlunos: 0,
    totalServidores: 0,
    totalPendencias: 0,
    pendencias: [],
    acessos: [],
  })

  useEffect(() => {
    carregarDashboard()
  }, [])

  async function carregarDashboard() {
    try {
      const response = await api.get('/dashboard/admin')
      setDados(response.data)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <SidebarAdmin itemAtivo="visao-geral" />

        <main className="main-content admin-content">
          <h2>Carregando...</h2>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <SidebarAdmin itemAtivo="visao-geral" />

      <main className="main-content admin-content">
        <header className="admin-header">
          <div className="admin-title-group">
            <h2>Painel Administrativo</h2>
            <p>Visão geral de usuarios e requerimentos</p>
          </div>
        </header>

        <section className="admin-cards-grid">
          <div className="admin-card outline-green">
            <span className="admin-card-label">
              TOTAL DE USUARIOS
            </span>

            <span className="admin-card-value text-green">
              {dados.totalAlunos}
            </span>
          </div>

          <div className="admin-card outline-red">
            <span className="admin-card-label text-red">
              PENDÊNCIAS
            </span>

            <span className="admin-card-value text-red">
              {dados.totalPendencias}
            </span>
          </div>
        </section>

        <section className="admin-table-section">
          <div className="table-header">
            <h3>Pendências de Requerimentos</h3>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Tipo</th>
                  <th>Protocolo</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {dados.pendencias.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      Nenhuma pendência encontrada
                    </td>
                  </tr>
                ) : (
                  dados.pendencias.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>
                          {item.usuario?.nome}
                        </strong>
                      </td>

                      <td>
                        {item.tipo}
                      </td>

                      <td>
                        {item.protocolo}
                      </td>

                      <td>
                        <span
                          className={`status-pill ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn-action btn-light-green"
                          onClick={() =>
                            navigate(
                              `/analiserequerimento/${item.id}`,
                              {
                                state: {
                                  origem: 'dashboard-admin',
                                },
                              }
                            )
                          }
                        >
                          Analisar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-table-section">
          <div className="table-header flex-between">
            <h3>Controle de Acessos</h3>

            <button
              className="btn-gerenciar"
              onClick={() =>
                navigate('/gerenciarusuarios')
              }
            >
              Gerenciar usuários +
            </button>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Perfil</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {dados.acessos.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>
                        {item.nome}
                      </strong>
                    </td>

                    <td>
                      {item.tipo}
                    </td>

                    <td>
                      {item.ativo
                        ? 'Ativo'
                        : 'Bloqueado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}