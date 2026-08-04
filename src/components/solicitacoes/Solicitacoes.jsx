import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import "./Solicitacoes.css";

import SidebarAdmin from "../layout/sidebar/SidebarAdmin";
import SidebarServidor from "../layout/sidebar/SidebarServidor";
import SidebarAluno from "../layout/sidebar/SidebarAluno";

export default function Solicitacoes() {

  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [busca,setBusca] = useState("");
  const [filtroStatus,setFiltroStatus] = useState("");
  const [solicitacoes,setSolicitacoes] = useState([]);


  async function carregarSolicitacoes(){

    try{

      const endpoint =
        usuario?.tipo === "ALUNO"
        ? "/requerimentos/meus"
        : "/requerimentos";


      const response = await api.get(endpoint,{
        params: usuario?.tipo !== "ALUNO"
        ? {
            busca,
            status:filtroStatus || undefined
          }
        : {}
      });


      setSolicitacoes(response.data);

    }catch(error){

      console.error(error);
      alert("Erro ao carregar solicitações");

    }

  }


  useEffect(()=>{
    carregarSolicitacoes();
  },[busca,filtroStatus]);



  function voltarDashboard(){

    if(usuario?.tipo==="ADMIN")
      navigate("/dashboardadmin");

    else if(usuario?.tipo==="SERVIDOR")
      navigate("/dashboardservidor");

    else
      navigate("/dashboardaluno");

  }



  function renderSidebar(){

    if(usuario?.tipo==="ADMIN")
      return <SidebarAdmin itemAtivo="solicitacoes"/>;


    if(usuario?.tipo==="SERVIDOR")
      return <SidebarServidor itemAtivo="solicitacoes"/>;


    return <SidebarAluno itemAtivo="solicitacoes"/>;

  }



  return (

    <div className="dashboard-container">

      {renderSidebar()}

      <main className="admin-content solicitacoes-content">

        <header className="solicitacoes-header">

          <button
            className="btn-voltar"
            onClick={voltarDashboard}
          >
            ← Voltar
          </button>


          <div className="solicitacoes-title-group">

            <h2>
              {usuario?.tipo==="ALUNO"
              ? "Minhas "
              : "Todas as "}
              <span>Solicitações</span>
            </h2>

            <p>
              Acompanhe os requerimentos acadêmicos.
            </p>

          </div>

        </header>



        {usuario?.tipo!=="ALUNO" && (

          <section className="users-toolbar">

            <input
              className="search-box"
              placeholder="Buscar protocolo ou aluno..."
              value={busca}
              onChange={e=>setBusca(e.target.value)}
            />


            <select
              className="filter-select"
              value={filtroStatus}
              onChange={e=>setFiltroStatus(e.target.value)}
            >

              <option value="">
                Todos os Status
              </option>

              <option value="Aberto">
                Aberto
              </option>

              <option value="Em analise">
                Em análise
              </option>

              <option value="Aguardando Ajuste">
                Aguardando ajuste
              </option>

              <option value="Deferido">
                Deferido
              </option>

              <option value="Indeferido">
                Indeferido
              </option>

            </select>

          </section>

        )}




        <section className="admin-table-section">

          <div className="table-container">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>Protocolo</th>

                  {usuario?.tipo!=="ALUNO" &&
                    <th>Aluno</th>
                  }

                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ação</th>

                </tr>

              </thead>



              <tbody>

              {solicitacoes.length===0 ? (

                <tr>

                  <td colSpan="6">
                    Nenhuma solicitação encontrada
                  </td>

                </tr>

              ) : (

                solicitacoes.map(req=>(

                  <tr key={req.id}>

                    <td>
                      {req.protocolo}
                    </td>


                    {usuario?.tipo!=="ALUNO" &&
                      <td>
                        {req.usuario?.nome}
                      </td>
                    }


                    <td>
                      {req.tipo}
                    </td>


                    <td>
                      {new Date(
                        req.criadoEm
                      ).toLocaleDateString("pt-BR")}
                    </td>


                    <td>

                      <span className={
                        `status-badge ${req.status.toLowerCase()}`
                      }>
                        {req.status}
                      </span>

                    </td>


                    <td>

<button
  className="btn-ver-detalhes"
  onClick={() =>
    navigate(
      `/analiserequerimento/${req.id}`,
      {
        state: {
          origem: "solicitacoes",
        },
      }
    )
  }
>
  Ver
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

    </div>

  );

}