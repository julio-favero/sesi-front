import React, { useEffect, useState } from "react";
import "../../../../componentes/TabComponent/tabs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import vmIP from "../../../../config/configPort.json";


const Atleta = () => {

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [data, setDate] = useState("");
  const [sexo, setSexo] = useState("");
  const [situacao, setSituacao] = useState("");

  const [atletas, setAtletas] = useState([]);

  let atleta = []
  useEffect(() => {
    axios.post(`http://${vmIP.server_ip_port}/listar`,{
      cargo: 'Atleta'
    })
    .then((res) => {
      for(let cont = 0; cont < res.data.length; cont++){
        atleta.push(res.data[cont])
      }
      setAtletas(atleta)
    })
  }, [])


  return (
    <>
    <br/>
    <h3>Dados Pessoais:</h3>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Sexo</th>
            <th>E-mail</th>
            <th>Categoria</th>
            <th>Modalidade</th>
            <th>Posição</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {atletas.map((atl, idx) =>{
            return(
              <tr>
                <td>{atl.nome}</td>
                <td>{atl.cpf}</td>
                <td>{atl.d_nasc}</td>
                <td>{atl.sexo}</td>
                <td>{atl.email}</td>
                <td>{atl.categoria}</td>
                <td>{atl.modalidade}</td>
                <td>{atl.posicao}</td>
                <td>{atl.situacao}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default Atleta;
