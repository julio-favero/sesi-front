import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/esm/Table";

import "../../../../componentes/TabComponent/tabs.css";
import vmIP from "../../../../config/configPort.json";


const Gestor = () => {

  const [gestor, setGestor] = useState([]);

  let gestores = []
  useEffect(() => {
    axios.post(`http://${vmIP.server_ip_port}/listar`,{
      cargo: 'Gestor'
    })
    .then((res) => {
      for(let cont = 0; cont < res.data.length; cont++){
        gestores.push(res.data[cont])
      }
      setGestor(gestores)
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
            <th>E-mail</th>
          </tr>
        </thead>
        <tbody>
          {gestor.map((gest, idx) =>{
            return(
              <tr>
                <td>{gest.nome}</td>
                <td>{gest.cpf}</td>
                <td>{gest.email}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default Gestor;
