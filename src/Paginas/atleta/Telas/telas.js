import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, ToggleButton, ButtonGroup, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

import AlterarPerfil from "../AtletaAlt/atletaalt";
import AvalicacoesPendentes from "../Enviar/enviar";
import Header from "../../../componentes/Header/Header";

import vmIP from "../../../config/configPort.json";

const Telas = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const botoes = [
    { name: "Alterar Perfil", value: "tab1" },
    { name: "Exames", value: "tab2" }
  ];

  const { email } = useParams()

  const [nome, setNome] = useState('')
  const [cargo, setCargo] = useState('')
  const [id, setId] = useState('')

  useEffect(() => {
    axios.post(`http://${vmIP.server_ip_port}/atleta/listar`, {
      email : email
    }).then((response) => response.data)
    .then((response) => {
      setId(response.idatleta)
      setNome(response.nome)
      setCargo(response.cargo)
    })
  }, [])


  return (
    <>
    <Header nome={nome} cargo={cargo}/>
    <Container className="mt-5">
      <h6 className="fw-normal text-start">Serviços:</h6>
      <ButtonGroup className="w-25">
        {botoes.map((botao) => (
          <ToggleButton
            className="rounded-0 me-2"
            size="sm"
            variant="outline-secondary"
            active={activeTab === botao.value}
            value={botao.value}
            onClick={() => {
              setActiveTab(botao.value);
            }}
          >
            {botao.name}
          </ToggleButton>
        ))}
      </ButtonGroup>

      <Card className="mt-3 mb-5">
        <Card.Body>
          {activeTab === "tab1" && <AlterarPerfil />}
          {activeTab === "tab2" && <AvalicacoesPendentes props={id} />}
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};
export default Telas;
