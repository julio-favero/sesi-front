import React, { useState, useEffect } from "react";
import { Formulario } from "../../../../componentes/Style/Formularios";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import ErrorWrapper from "../../errors";
import { toast } from "react-toastify";

//  Importações relacionadas o calendário do campo Data
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import vmIP from "../../../../config/configPort.json";


registerLocale('pt-BR', ptBR); // Registrar o calendário como BR
setDefaultLocale('pt-BR'); // Definir o calendário como BR


const Atleta = (props) => {

  // ----------------- Criação das Const -----------------
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [cargo, setCargo] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [posição, setPosição] = useState("");
  const [email, setEmail] = useState("");

  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [nasc, setNasc] = useState("")
  const [sexo, setSexo] = useState('');
  const [disabled, setDisabled] = useState(true);
  // ----------------- FIM Criação das Const -----------------

  // ---------------- Formatar data ----------------
  const formatarData = () => {
    if (nascimento) {    
      const dataFormatada = format(nascimento, 'yyyy-MM-dd'); // Padrão BD  
      setNasc(dataFormatada.toString())                             
    }
  };

  useEffect(() => {
    formatarData();
  }, [nascimento]);

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
      buscar()
    }
  };

  // getCategorias é uma função que criei, ela que vai gerar os valores que o campo categoria vai ter
  // Desse jeito os valores ficam dinámicos para cada esporte 
  const getCategorias = () => {     
    if (modalidade === 'Atletismo Olímpico') {
      return ['Corrida com obstáculos.', 
              'Corridas rasas de velocidade.', 
              'Decatlo e Heptatlo.',
              'Lançamentos.',
              'Meio-Fundo e Fundo.',
              'Provas de revezamento.',
              'Provas de rua.',
              'Saltos.'    
            ];
    } 
    else if (modalidade === 'Atletismo Paralímpico') {
      return ['Lançamento de disco', 
              'Salto em distância',
              'Lançamento de Dardo',
              'Arremesso de peso',
              'Salto em Altura.',
              'Salto Triplo'
            ];
    } 
    else if (modalidade === 'Ginástica Artística') {
      return ['Solo', 
              'Barras paralelas',
              'Barras Fixas',
              'Cavalo com alças e argolas',
              'Trave de Equilíbrio',
              'Barras Assimétricas'
            ];
    } 
    else if (modalidade === 'Luta Olímpica') {
      return ['Livre', 
              'Romana',              
            ];
    } 
    else if (modalidade === 'Natação') {
      return ['Crawl', 
              'Costas', 
              'Borboleta',
              'Peito'
            ];
    }
    else if (modalidade === 'Vôlei') {
      return ['Vôlei de quadra', 
              'vôlei de praia', 
              'vôlei sentado',
              'futevôlei'
            ];
    }
    else {
      return ['Padrão'];
    }
  };

  // getPosicao é uma função que criei, ela que vai gerar os valores que o campo posição vai ter
  // Desse jeito os valores ficam dinámicos para cada esporte 
  const getPosicao = () => {
    if (modalidade === 'Basquete') {
      return ['Armador', 
              'Ala-armador',
              'Ala',
              'Ala-pivô',
              'Pivô'
            ];
    }
    else if (modalidade === 'Goalball') {
      return ['Ala Esquerdo', 
              'Pivô',
              'Ala direito'
            ];
    } 
    else if (modalidade === 'Polo Aquático') {
      return ['Ponta Direita', 
              'ponta Esquerda',
              'Alas',
              'Armador',
              'Central'
             ];
    } 
    else if (modalidade === 'Vôlei') {
      return ['Levantador', 
              'Oposto',
              'Ponteiro',
              'Central',
              
            ];
    }  
    else {
      return ['Padrão'];
    }
  };

  const categorias = getCategorias(); // Variável responsável por pegar os campos da categoria
  const posicoes = getPosicao();// Variável responsável por pegar os campos da posição


  
  const buscar = () => {
    axios.post(`http://${vmIP.server_ip_port}/listarAtleta`,{
      cpf: cpf,
    })
    .then((res) => {
      console.log(res.data)
      setNome(res.data.nome)
      setModalidade(res.data.modalidade)
      setCargo(res.data.cargo)
      setCategoria(res.data.categoria)
      setEmail(res.data.email)
      setPosição(res.data.posicao)
      setNascimento(new Date(res.data.d_nasc))
      setSexo(res.data.sexo)
      toast.info("Atualize os campos desejados!")
      setDisabled(false)
    })
    .catch((err) => {
      toast.error("Atleta não encontrado!")
      setNome("")
      setModalidade("")
      setCargo("")
      setCategoria("")
      setEmail("")
      setPosição("")
      setNascimento("")
      setSexo("")
      setDisabled(true)
    })
  }

  const alterar = () => {
    axios.put(`http://${vmIP.server_ip_port}/alterar`,{
      cpf: cpf,
      nome: nome,
      modalidade: modalidade,
      cargo: cargo,
      categoria: categoria,
      email: email,
      posicao: posição,
      d_nasc: nasc,
      sexo: sexo
    })
    .then((res) => {
      toast.success('Atleta atualizado com sucesso!')
    })
    .catch((err) => {
      toast.error('Não foi possível atualizar o atleta!')
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
            Escreva corretamente o cpf
          </div>
        </Col>
        
        {/* Input da Modalidade */}
        <Col>
        <Form.Label name="modalidade">Modalidade:</Form.Label>
        <Form.Select
          autoComplete="off"
          className="form-control"
          name="modalidade"
          value={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
        >
          <option value="" disabled>Selecione uma modalidade</option>
          <option value="Atletismo Olímpico">Atletismo Olímpico</option>
          <option value="Atletismo Paralímpico">Atletismo Paralímpico</option>
          <option value="Bocha Paralímpica">Bocha Paralímpica</option>
          <option value="Basquete">Basquete</option>
          <option value="Ginástica Artística">Ginástica Artística</option>
          <option value="Goalball">Goalball</option>
          <option value="Judô">Judô</option>
          <option value="Karatê">Karatê</option>
          <option value="Luta Olímpica">Luta Olímpica</option>
          <option value="Natação">Natação</option>
          <option value="Polo Aquático">Polo Aquático</option>
          <option value="Triathlon">Triathlon</option>
          <option value="Vôlei">Vôlei</option>
          <option value="Vôlei Paralímpico">Vôlei Paralímpico</option>
        </Form.Select>
        <ErrorWrapper msg={hasError("modalidade")?.value} />
      </Col>

      {/* Input da Categoria */}
      {categorias.length > 0 && (
        <Col>
          <Form.Label name="categoria">Categoria:</Form.Label>
          <Form.Select
            autoComplete="off"
            className="form-control"
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="NaoSelecionado" selected>Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </Form.Select>
          <ErrorWrapper msg={hasError("categoria")?.value} />
        </Col>
      )}

      {/* Input da Posição */}
      {posicoes.length > 0 && (
        <Col>
          <Form.Label name="posicao">Posição:</Form.Label>
          <Form.Select
            autoComplete="off"
            className="form-control"
            name="posicao"
            value={posição}
            onChange={(e) => setPosição(e.target.value)}
          >
            <option value="NaoSelecionado" selected>Selecione uma posição</option>
            {posicoes.map((posicao) => (
              <option key={posicao} value={posicao}>
                {posicao}
              </option>
            ))}
          </Form.Select>
          <ErrorWrapper msg={hasError("posição")?.value} />
        </Col>
      )}

        <Col>
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            autoComplete="off"
            className={
              hasError("nome")
                ? "form-control is-invalid"
                : "form-control"
            }
            name="nome"
            onKeyPress={bloquearNumeros}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <ErrorWrapper msg={hasError("nome")?.value} />
        </Col>

        <Col>
          <Form.Label>Cargo:</Form.Label>
          <Form.Control
            autoComplete="off"
            className={
              hasError("cargo") ? "form-control is-invalid" : "form-control"
            }
            name="cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <ErrorWrapper msg={hasError("cargo")?.value} />
        </Col>

        {/* <Col>
          <Form.Label name="data_nasc">Data de nascimento: </Form.Label>
          <br/>
          <DatePicker
            selected={nasc}
            onChange={(date) => setNasc(date)}
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            required
            dropdownMode="select"
            className="form-control"
            locale="pt-BR"
          />
          <ErrorWrapper msg={hasError("data")?.value} />
        </Col> */}

        <Col>
          <Form.Label name="data_nasc">Data de nascimento: </Form.Label>
          <br/>
          <DatePicker
            selected={nascimento}
            onChange={(date) => setNascimento(date)}
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            required
            dropdownMode="select"
            className="form-control"
            locale="pt-BR"
          />
          <ErrorWrapper msg={hasError("data")?.value} />
        </Col>
        
        <Col>
          <Form.Label>Sexo:</Form.Label>
          <Form.Select 
            name="sexo"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option selected disabled value="">Selecione uma opção</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </Form.Select>
        </Col>
        
        <Col>
          <Form.Label>E-mail:</Form.Label>
          <Form.Control
            tipo="text"
            autoComplete="off"
            name="email"
            className={
              hasError("email") ? "form-control is-invalid" : "form-control"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={hasError("email") ? "inline-errormsg" : "hidden"}>
            Escreva corretamente seu e-mail
          </div>
        </Col>
      </Formulario>

      <Col>
        <div className="pt-4">
          <Button variant="success" size="sm" onClick={handleSubmit}>
            Buscar
          </Button>
          <Button disabled={disabled} variant="success" size="sm" onClick={alterar}>
            Atualizar
          </Button>
        </div>
      </Col>
    </main>
  );
};

export default Atleta;
