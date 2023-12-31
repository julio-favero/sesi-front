import React, { useState } from "react";
import { Formulario } from "../../../../componentes/Style/Formularios";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorWrapper from "../../errors";
import axios from "axios";
import { toast } from "react-toastify";

import vmIP from "../../../../config/configPort.json";


const Medico = (props) => {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState([]);
  const [primeiro_nome, setPrimeiro_nome] = useState("");
  const [CRM, setCRM] = useState("");
  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [disabled, setDisabled] = useState(true);

  function bloquearNumeros(event) {
    const tecla = event.which || event.keyCode;
    if (tecla >= 48 && tecla <= 57) {
      event.preventDefault();
    }
  }

  function hasError(key) {
    return error.find((o) => o.key === key);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    //validação
    var errors = [];

    //email
    const validarEmail = /\S+@\S+\./;
    var validEmail = validarEmail.test(String(email));

    if (!validEmail) {
      errors.push({ key: "email", value: "E-mail inválido" });
    }

    //CRM
    if (CRM === "") {
      errors.push({
        key: "CRM",
        value: "Informe o CRM"
      });
    }

    //cpf
    const validarCpf = /^\d{11}$/;
    var validCpf = validarCpf.test(Number(cpf));

    if (!validCpf) {
      errors.push({ key: "cpf", value: "Cpf invalido" });
    }

    setError(errors);

    if (errors.length > 0) {
      return false;
    } else {
      alterar();
    }
  };

  const buscar = () => {
    axios.post(`http://${vmIP.server_ip_port}/listarTodos`,{
      cargo: props.cargo,
      cpf: cpf,
    })
    .then((res) => {
      setPrimeiro_nome(res.data.nome)
      setCRM(res.data.crm)
      setEmail(res.data.email)
      setSexo(res.data.sexo)
      setEspecialidade(res.data.especialidade)
      toast.info("Atualize os campos desejados!")
      setDisabled(false)
    })
    .catch((err) => {
      toast.error("Médico não encontrado!")
      setPrimeiro_nome("")
      setCRM("")
      setEmail("")
      setEspecialidade("")
      setDisabled(true)
    })
  }

  const alterar = () => {
    axios.put(`http://${vmIP.server_ip_port}/alterar`,{
      cargo: props.cargo,
      cpf: cpf,
      nome: primeiro_nome,
      sexo: sexo,
      crm: CRM,
      email: email,
      especialidade: especialidade
    })
    .then((res) => {
      toast.success('Médico atualizado com sucesso!')
    })
    .catch((err) => {
      toast.error('Não foi possível atualizar o Médico!')
    })
  }

  return (
    <main>
      <Formulario action="">
        <Col>
          <Form.Label>CPF:</Form.Label>
          <Form.Control
            type="number"
            autoComplete="off"
            name="cpf"
            className={
              hasError("cpf") ? "form-control is-invalid" : "form-control"
            }
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <div className={hasError("cpf") ? "inline-errormsg" : "hidden"}>
            Informe o CPF
          </div>
        </Col>
        <Col>
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            autoComplete="off"
            className={
              hasError("primeiro_nome")
                ? "form-control is-invalid"
                : "form-control"
            }
            onKeyPress={bloquearNumeros}
            name="primeiro_nome"
            value={primeiro_nome}
            onChange={(e) => setPrimeiro_nome(e.target.value)}
          />
          <ErrorWrapper msg={hasError("primeiro_nome")?.value} />
        </Col>
        <Col>
          <Form.Label>Sexo:</Form.Label>
          <Form.Select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="M">M</option>
            <option value="F">F</option>
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>E-mail:</Form.Label>
          <Form.Control
            type="email"
            autoComplete="off"
            name="email"
            className={
              hasError("email") ? "form-control is-invalid" : "form-control"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorWrapper msg={hasError("email")?.value} />
        </Col>
        <Col>
          <Form.Label>CRM:</Form.Label>
          <Form.Control
            autoComplete="off"
            className={
              hasError("CRM") ? "form-control is-invalid" : "form-control"
            }
            name="CRM"
            value={CRM}
            onChange={(e) => setCRM(e.target.value)}
          />
          <ErrorWrapper msg={hasError("CRM")?.value} />
        </Col>

        <Col>
          <Form.Label name="especialidade" >Especialidade:</Form.Label>
          <Form.Select value={especialidade} onChange={(e) => setEspecialidade(e.target.value)}>
            <option selected disabled>Selecione uma opção</option>
            <option value="Ortopedista">Ortopedista</option>
            <option value="Cardiologista">Cardiologista</option>
            <option value="Clinico Geral">Clinico Geral</option>
          </Form.Select>
          <ErrorWrapper msg={hasError("especialidade")?.value} />
        </Col>

      </Formulario>

      <Col>
        <div className="pt-4">
          <Button variant="success" size="sm" onClick={buscar}>
            Buscar
          </Button>{" "}            
          <Button disabled={disabled} variant="success" size="sm" onClick={handleSubmit}>
            Atualizar
          </Button>{" "}
        </div>
      </Col>
    </main>
  );
};
export default Medico;
