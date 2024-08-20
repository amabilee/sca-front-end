import { useState } from 'react'
import { server } from '../../services/server'
import './style.css'
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function DependenteComponent() {
  // SnackBar config
  const [message, setMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('')
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  //Data from the form

  const [formData, setFormData] = useState({
    //Dependente
    cpf: '',
    nome_completo: '',
    parentesco: 'Selecione',
    id_efetivo: '',

    numero_ordem: '',
    militar: '',
    //Registro
    cracha: '',
    entrada: 'Não',
    destino: '',
    veiculo_cracha: '',

    conduzindo: 'Não',

    //Veiculo
    veiculo_placa: '',
    veiculo_tipo: 'Selecione',
    veiculo_cor: 'Selecione',
    veiculo_renavam: '',
    veiculo_marca: '',
    veiculo_modelo: ''
  });

  const [disabledInputs, setDisabledInputs] = useState({
    nome_completo: true,
    parentesco: true,
    numero_ordem: true,
    militar: true,

    cracha: true,
    destino: true,
    veiculo_cracha: true,

    veiculo_placa: true,
    veiculo_tipo: true,
    veiculo_cor: true,
    veiculo_renavam: true,
    veiculo_marca: true,
    veiculo_modelo: true,
  });

  const cleanInputs = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      cpf: '',
      nome_completo: '',
      parentesco: 'Selecione',
      numero_ordem: '',
      militar: '',
      cracha: '',
      entrada: 'Não',
      destino: '',
      conduzindo: 'Não',
      veiculo_placa: '',
      veiculo_tipo: 'Selecione',
      veiculo_cor: 'Selecione',
      veiculo_renavam: '',
      veiculo_marca: '',
      veiculo_modelo: '',
      veiculo_cracha: '',
    }));
    setDisabledInputs((prevDisabledInputs) => ({
      ...prevDisabledInputs,
      nome_completo: true,
      parentesco: true,
      numero_ordem: true,
      militar: true,
      cracha: true,
      destino: true,
      veiculo_tipo: true,
      veiculo_cor: true,
      veiculo_placa: true,
      veiculo_renavam: true,
      veiculo_marca: true,
      veiculo_modelo: true,
      veiculo_cracha: true,
    }));
  };

  // Find Dependente

  const searchDependente = async (element) => {
    if (String(element).length === 14) {
      let formattedCPF = String(element).replace(/\D/g, '')
      let userData = localStorage.getItem('user');
      let userDataParsed = JSON.parse(userData);
      let token = localStorage.getItem('user_token');
      try {
        const response = await server.get(`/dependente?cpf=${formattedCPF}`, {
          headers: {
            'Authentication': token,
            'access-level': userDataParsed.nivel_acesso,
          },
        });


        const dependenteColected = response.data.formattedEntities[0];
      
        if (dependenteColected) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            id_efetivo: dependenteColected.id_efetivo,
            cpf: element,
            nome_completo: dependenteColected.nome,
            parentesco: dependenteColected.parentesco,

            militar: `${dependenteColected.graduacao} ${dependenteColected.nome_guerra}`,
            numero_ordem: dependenteColected.numero_ordem,
          }));

          setDisabledInputs((prevDisabledInputs) => ({
            ...prevDisabledInputs,
            nome_completo: true,
            parentesco: true,
            numero_ordem: true,
            militar: true,
            veiculo_placa: false,
          }));
        } else {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage('Não foi encontrado um dependente com este CPF');
          setAlertSeverity("error");
          setDisabledInputs((prevDisabledInputs) => ({
            ...prevDisabledInputs,
            nome_completo: false,
            parentesco: false,
            numero_ordem: false,
            militar: false,
            veiculo_placa: false,
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            nome_completo: '',
            parentesco: 'Selecione',
            numero_ordem: '',
            militar: '',
            cpf: element,
          }));
        }

      } catch (e) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Não foi encontrado um dependente com este CPF');
        setAlertSeverity("error");
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: false,
          parentesco: false,
          numero_ordem: false,
          militar: false,
          veiculo_placa: false,
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          nome_completo: '',
          parentesco: 'Selecione',
          numero_ordem: '',
          militar: '',
          cpf: element,
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nome_completo: '',
        parentesco: 'Selecione',
        numero_ordem: '',
        militar: '',
        veiculo_placa: '',
        cpf: element,
      }));

      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        nome_completo: true,
        parentesco: true,
        numero_ordem: true,
        militar: true,
        veiculo_placa: true,
      }));
    }
  };

  // Handle Registrar Entrada Change

  const changeRegistroEntrada = (element) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      entrada: element,
    }));
    if (element === 'Sim') {
      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        cracha: false,
        destino: false,
        veiculo_cracha: false,
      }));
    } else {
      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        cracha: true,
        destino: true,
        veiculo_cracha: true,
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        cracha: '',
        destino: '',
        veiculo_cracha: ''
      }));
    }
  };

  //Find Veiculo

  const searchVeiculos = async (element) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      veiculo_placa: element,
    }));
    if (String(element).length === 7) {
      let userData = localStorage.getItem('user');
      let userDataParsed = JSON.parse(userData);
      let token = localStorage.getItem('user_token');
      try {
        const response = await server.get(`/veiculo_an/consulta/${element}`, {
          headers: {
            'Authentication': token,
            'access-level': userDataParsed.nivel_acesso,
          },
        });

        const veiculoColected = response.data;

        let revanamLength = String(veiculoColected.renavam).length
        let finalRenavam = veiculoColected.renavam
        if (revanamLength != 11) {
          let diferenceRenavamLength = 11 - revanamLength
          for (let i = 0; i < diferenceRenavamLength; i++) {
            finalRenavam = "0" + finalRenavam
          }
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          veiculo_tipo: veiculoColected.tipo,
          veiculo_cor: veiculoColected.cor_veiculo,
          veiculo_placa: element,
          veiculo_renavam: finalRenavam,
          veiculo_marca: veiculoColected.marca,
          veiculo_modelo: veiculoColected.modelo,
        }));

        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          veiculo_tipo: true,
          veiculo_cor: true,
          veiculo_renavam: true,
          veiculo_marca: true,
          veiculo_modelo: true,
        }));
      } catch (e) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Não foi encontrado um veículo com esta placa');
        setAlertSeverity("error");
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          veiculo_tipo: false,
          veiculo_cor: false,
          veiculo_renavam: false,
          veiculo_marca: false,
          veiculo_modelo: false,
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          veiculo_tipo: 'Selecione',
          veiculo_cor: 'Selecione',
          veiculo_placa: element,
          veiculo_renavam: '',
          veiculo_marca: '',
          veiculo_modelo: ''
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        veiculo_tipo: 'Selecione',
        veiculo_cor: 'Selecione',
        veiculo_placa: element,
        veiculo_renavam: '',
        veiculo_marca: '',
        veiculo_modelo: ''
      }));

      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        veiculo_tipo: true,
        veiculo_cor: true,
        veiculo_renavam: true,
        veiculo_marca: true,
        veiculo_modelo: true
      }));
    }
  }

  // Handle Militar Search

  const militarInputType = async (type, element, event) => {
    setDisabledInputs((prevDisabledInputs) => ({
      ...prevDisabledInputs,
      numero_ordem: false,
      militar: false,
    }));
    if (type == 1) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        numero_ordem: element
      }));
      if (String(element).length >= 1) {
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          militar: true,
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          id_efetivo: '',
          militar: ''
        }));
        if (String(element).length === 7) {
          let userData = localStorage.getItem('user');
          let userDataParsed = JSON.parse(userData);
          let token = localStorage.getItem('user_token');
          try {
            const response = await server.get(`/efetivo/consulta/${element}`, {
              headers: {
                'Authentication': token,
                'access-level': userDataParsed.nivel_acesso,
              },
            });
            if (response.data.length !== 0) {
              const efetivoColected = response.data[0];

              setFormData((prevFormData) => ({
                ...prevFormData,
                id_efetivo: efetivoColected.id,
                militar: `${efetivoColected.Graduacao.sigla} ${efetivoColected.nome_guerra}`
              }));

              setDisabledInputs((prevDisabledInputs) => ({
                ...prevDisabledInputs,
                militar: true,
              }));
            } else {
              setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
              setMessage('Não foi encontrado um efetivo com este número de ordem');
              setAlertSeverity("error");
              setDisabledInputs((prevDisabledInputs) => ({
                ...prevDisabledInputs,
                militar: false,
              }));
              setFormData((prevFormData) => ({
                ...prevFormData,
                id_efetivo: '',
                militar: ''
              }));
            }

          } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage('Não foi encontrado um efetivo com este número de ordem');
            setAlertSeverity("error");
            setDisabledInputs((prevDisabledInputs) => ({
              ...prevDisabledInputs,
              militar: false,
            }));
            setFormData((prevFormData) => ({
              ...prevFormData,
              id_efetivo: '',
              militar: ''
            }));
          }
        }
      }
    } else {
      setFormData({ ...formData, militar: element });
      if (String(element).length >= 1) {
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          numero_ordem: true,
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          id_efetivo: '',
          numero_ordem: ''
        }));
        const splitMilitar = element.split(" ");
        if (splitMilitar.length >= 2 && splitMilitar[1] !== "") {
          if (event && event.key === "Enter") {
            let userData = localStorage.getItem("user");
            let userDataParsed = JSON.parse(userData);
            let token = localStorage.getItem("user_token");
            let formatted;

            if (splitMilitar.length === 2) {
              formatted = { graduacao: splitMilitar[0], nome_guerra: splitMilitar[1] };
            } else if (splitMilitar.length === 3) {
              formatted = { graduacao: `${splitMilitar[0]} ${splitMilitar[1]}`, nome_guerra: splitMilitar[2] };
            } else {
              setState({ ...state, vertical: "bottom", horizontal: "center", open: true });
              setMessage("Militar deve ser inserido no formato: graduação nome de guerra");
              setAlertSeverity("error");
              return;
            }

            try {
              const response = await server.get(`/efetivo?graduacao=${formatted.graduacao}&nome_guerra=${formatted.nome_guerra}`, {
                headers: {
                  "Authentication": token,
                  "access-level": userDataParsed.nivel_acesso,
                },
              });
              if (response.data.entities.length !== 0) {
                const efetivoColected = response.data.entities[0];

                setFormData((prevFormData) => ({
                  ...prevFormData,
                  id_efetivo: efetivoColected.id,
                  numero_ordem: efetivoColected.qrcode_efetivo
                }));

                setDisabledInputs((prevDisabledInputs) => ({
                  ...prevDisabledInputs,
                  numero_ordem: true,
                }));
              } else {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage('Não foi encontrado um efetivo com estes dados');
                setAlertSeverity("error");
                setDisabledInputs((prevDisabledInputs) => ({
                  ...prevDisabledInputs,
                  numero_ordem: false,
                }));
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  id_efetivo: '',
                  numero_ordem: '',
                  militar: ''
                }));
              }

            } catch (e) {
              setState({ ...state, vertical: "bottom", horizontal: "center", open: true });
              setMessage("Erro ao buscar dados");
              setAlertSeverity("error");
            }
          }
        }
      }
    }
  }

  //Handle submit form

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.cpf.length != 14) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um CPF válido.");
      setAlertSeverity("error");
    } else if (formData.nome_completo.length === 0) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um nome completo válido.");
      setAlertSeverity("error");
    } else if (formData.parentesco === 'Selecione') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um parentesco válido.");
      setAlertSeverity("error");
    } else if (formData.id_efetivo === '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um militar válido.");
      setAlertSeverity("error");
    } else if (formData.entrada === 'Sim' && formData.cracha == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um crachá para o dependente válido.");
      setAlertSeverity("error");
    } else if (formData.entrada === 'Sim' && formData.destino == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um destino válido.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && formData.entrada === 'Sim' && String(formData.veiculo_cracha).length != 5) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um crachá para o veículo válido.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && !validarPlaca(formData.veiculo_placa)) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma placa válida.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_tipo == 'Selecione') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um tipo válido.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_cor == 'Selecione') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma cor válida.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && String(formData.veiculo_renavam).length != 11) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um RENAVAM válido.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_marca == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma marca válida.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_modelo == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um modelo válido.");
      setAlertSeverity("error");
    } else {
      formatSendRequest();
    }
  };

  const validarPlaca = (placa) => {
    return /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/.test(placa);
  };

  //Types of requests

  const formatSendRequest = async () => {
    let userData = localStorage.getItem('user');
    let userDataParsed = JSON.parse(userData);
    let token = localStorage.getItem("user_token")

    if (formData.entrada == 'Sim' && formData.conduzindo == 'Sim') {
      sendRequestDependente(token, userDataParsed, 'dependente+veiculo+registro')
    } else if (formData.conduzindo == 'Sim' && formData.entrada == 'Não') {
      sendRequestDependente(token, userDataParsed, 'dependente+veiculo')
    } else if (formData.entrada == 'Sim' && formData.conduzindo == 'Não') {
      sendRequestDependente(token, userDataParsed, 'dependente+registro')
    } else if (formData.conduzindo == 'Não' && formData.entrada == 'Não') {
      sendRequestDependente(token, userDataParsed, 'dependente')
    }
  };

  //Dependente

  const sendRequestDependente = async (token, userDataParsed, typeRequest) => {
    let formattedCPF = String(formData.cpf).replace(/\D/g, '')
    let dependenteFormattedData = {
      id_efetivo: formData.id_efetivo,
      cpf: Number(formattedCPF),
      nome: formData.nome_completo,
      parentesco: formData.parentesco
    };
    try {
      await server.post(`/dependente`, dependenteFormattedData, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });

      if (typeRequest == 'dependente') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Dependente cadastrado com sucesso.");
        setAlertSeverity("success");
        setFormData((prevFormData) => ({
          ...prevFormData,
          id_efetivo: '',
          numero_ordem: '',
          militar: '',
          nome_completo: '',
          parentesco: 'Selecione',
          cpf: ''
        }));

        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: true,
          parentesco: true,
          numero_ordem: true,
          militar: true,
          veiculo_placa: true,
        }));
      } else if (typeRequest == 'dependente+veiculo') {
        sendRequestVeiculo(token, userDataParsed, typeRequest)
      } else if (typeRequest == 'dependente+registro') {
        sendRequestRegistro(token, userDataParsed, typeRequest)
      } else if (typeRequest == 'dependente+veiculo+registro') {
        sendRequestVeiculo(token, userDataParsed, typeRequest)
      }
    } catch (e) {
      if (e.response.status && e.response.status == 400) {
        if (typeRequest == 'dependente') {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage(e.response.data.message);
          setAlertSeverity("error");
        } else if (typeRequest == 'dependente+veiculo') {
          sendRequestVeiculo(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'dependente+registro') {
          sendRequestRegistro(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'dependente+veiculo+registro') {
          sendRequestVeiculo(token, userDataParsed, typeRequest)
        }
      } else {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Erro ao criar dependente.');
        setAlertSeverity("error");
      }
    }
  }

  //Veículo

  const sendRequestVeiculo = async (token, userDataParsed, typeRequest) => {
    let veiculoFormattedData = {
      tipo: formData.veiculo_tipo,
      cor_veiculo: formData.veiculo_cor,
      placa: formData.veiculo_placa,
      modelo: formData.veiculo_modelo,
      marca: formData.veiculo_marca,
      renavam: Number(formData.veiculo_renavam)
    };
    try {
      await server.post(`/veiculo_an`, veiculoFormattedData, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });

      if (typeRequest === 'dependente+veiculo+registro') {
        sendRequestRegistro(token, userDataParsed, typeRequest)
      } else if (typeRequest === 'dependente+veiculo') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Dependente e veículo cadastrados com sucesso.");
        setAlertSeverity("success");
        setFormData((prevFormData) => ({
          ...prevFormData,
          id_efetivo: '',
          numero_ordem: '',
          militar: '',
          nome_completo: '',
          parentesco: 'Selecione',
          cpf: '',

          conduzindo: 'Não',
          veiculo_placa: '',
          veiculo_tipo: 'Selecione',
          veiculo_cor: 'Selecione',
          veiculo_renavam: '',
          veiculo_marca: '',
          veiculo_modelo: '',
        }));

        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: true,
          parentesco: true,
          numero_ordem: true,
          militar: true,
          veiculo_placa: true,

          veiculo_tipo: true,
          veiculo_cor: true,
          veiculo_renavam: true,
          veiculo_marca: true,
          veiculo_modelo: true,
        }));
      }
    } catch (e) {
      if (e.response.status && e.response.status == 400) {
        if (typeRequest === 'dependente+veiculo+registro') {
          sendRequestRegistro(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'dependente+veiculo') {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage(e.response.data.message);
          setAlertSeverity("error");
        }
      } else {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Erro ao criar veículo.');
        setAlertSeverity("error");
      }
    }
  }

  //Registro

  const sendRequestRegistro = async (token, userDataParsed, typeRequest) => {
    let formattedCPF = String(formData.cpf).replace(/\D/g, '')
    let registroFormattedData

    const { formattedDate, formattedTime } = getFormattedDateTime();

    if (typeRequest === 'dependente+registro') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2, //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        cpf_dependente: formattedCPF,
        qrcode_autorizador: userDataParsed.usuario,
        detalhe: formData.destino
      }
    } else if (typeRequest === 'dependente+veiculo+registro') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2,  //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        cracha_veiculo_numero: formData.veiculo_cracha,
        cpf_dependente: formattedCPF,
        placa_veiculo_sem_an: formData.veiculo_placa,
        qrcode_autorizador: userDataParsed.usuario,
        detalhe: formData.destino
      };
    }
    try {
      await server.post(`/registro_acesso`, registroFormattedData, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });

      if (typeRequest === 'dependente+registro') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Dependente e registro cadastrados com sucesso.");
        setAlertSeverity("success");
        cleanInputs()

      } else if (typeRequest === 'dependente+veiculo+registro') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Dependente, veículo e registro cadastrados com sucesso.");
        setAlertSeverity("success");
        cleanInputs()
      }
    } catch (e) {
      if (e.response.status && e.response.status == 400) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage(e.response.data.message);
        setAlertSeverity("error");
      } else {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Erro ao criar registro.');
        setAlertSeverity("error");
      }
    }
  }

  const getFormattedDateTime = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}/${month}/${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return { formattedDate, formattedTime };
  };


  return (
    <div className="pessoas-container">
      <div className="pessoas-section-title">
        <h3>Dados dependente</h3>
        <p>Digite o CPF para pesquisar ou cadastrar um novo dependente</p>
      </div>
      <div className="pessoas-section-input session-input-dependente">
        <div className="input-container">
          <p>CPF*</p>
          <IMaskInput
            type="text"
            mask="000.000.000-00"
            className='filtering-input'
            value={formData.cpf}
            onChange={(e) => searchDependente(e.target.value)}
          />
        </div>
        <div className="input-container">
          <p>Nome completo*</p>
          <input
            type="text"
            disabled={disabledInputs.nome_completo}
            className='filtering-input'
            value={formData.nome_completo}
            onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
          />
        </div>
        <div className="input-container">
          <p>Parentesco*</p>
          <select
            className='filtering-input'
            disabled={disabledInputs.parentesco}
            value={formData.parentesco}
            onChange={(e) => setFormData({ ...formData, parentesco: e.target.value })}
          >
            <option value={'Selecione'}>Selecione</option>
            <option value={'Filho(a)'}>Filho(a)</option>
            <option value={'Cônjuge'}>Cônjuge</option>
            <option value={'Outro'}>Outro</option>
          </select>
        </div>
        <div className="session-input-box">
          <div className="input-container">
            <p>Número de ordem*</p>
            <input
              type="text"
              maxLength={7}
              className='filtering-input'
              disabled={disabledInputs.numero_ordem}
              value={formData.numero_ordem}
              onChange={(e) => militarInputType(1, e.target.value.replace(/[^0-9]/g, "") )}
            />
          </div>
          <p>ou</p>
          <div className="input-container">
            <p>Militar*</p>
            <input
              type="text"
              disabled={disabledInputs.militar}
              placeholder='Graduação e Nome de Guerra'
              className='filtering-input'
              value={formData.militar}
              onChange={(e) => militarInputType(2, e.target.value)}
              onKeyDown={(e) => militarInputType(2, e.target.value, e)}
            />
          </div>
        </div>
      </div>
      <div className="pessoas-section-title">
        <h3>Autorizador</h3>
      </div>
      <div className="pessoas-section-input session-input-autorizador-simple">
        <div className="input-container">
          <p>Inserir entrada deste dependente no sistema? </p>
          <select
            className='filtering-input'
            value={formData.entrada}
            onChange={(e) => changeRegistroEntrada(e.target.value)}
          >
            <option value={'Não'}>Não</option>
            <option value={'Sim'}>Sim</option>
          </select>
        </div>
        <div className="input-container">
          <p>Destino</p>
          <input
            type="text"
            className='filtering-input'
            value={formData.destino}
            disabled={disabledInputs.destino}
            onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
          />
        </div>
        <div className="input-container">
          <p>Crachá*</p>
          <input
            type="text"
            maxLength={5}
            disabled={disabledInputs.cracha}
            className='filtering-input'
            value={formData.cracha}
            onChange={(e) => setFormData({ ...formData, cracha: e.target.value.replace(/[^0-9]/g, "") })}
          />
        </div>
      </div>
      <div className="pessoas-section-title">
        <h3>Veículo</h3>
        <p>Digite a placa para pesquisar ou cadastrar um novo veículo</p>
      </div>
      <div className="pessoas-section-input session-input-dependente3">
        <div className="input-container">
          <p>Está conduzindo?*</p>
          <select
            className='filtering-input'
            value={formData.conduzindo}
            onChange={(e) => setFormData({ ...formData, conduzindo: e.target.value })}
          >
            <option value={'Não'}>Não</option>
            <option value={'Sim'}>Sim</option>
          </select>
        </div>
      </div>
      <div className="pessoas-section-input session-input-dependente4">
        {formData.conduzindo != 'Não' && (
          <>
            <div className="input-container">
              <p>Crachá</p>
              <input
                type="text"
                maxLength={5}
                className='filtering-input'
                disabled={disabledInputs.veiculo_cracha}
                value={formData.veiculo_cracha}
                onChange={(e) => setFormData({ ...formData, veiculo_cracha: e.target.value.replace(/[^0-9]/g, "") })}
              />
            </div>
            <div className="input-container">
              <p>Placa</p>
              <input
                type="text"
                maxLength={7}
                className='filtering-input'
                value={formData.veiculo_placa}
                disabled={disabledInputs.veiculo_placa}
                onChange={(e) => searchVeiculos(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              />
            </div>
            <div className="box-input-veiculo">
              <div className="input-container">
                <p>Tipo</p>
                <select
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_tipo}
                  value={formData.veiculo_tipo}
                  onChange={(e) => setFormData({ ...formData, veiculo_tipo: e.target.value })}
                >
                  <option value={'Selecione'}>Selecione</option>
                  <option value={'Motocicleta'}>Motocicleta</option>
                  <option value={'Carro'}>Carro</option>
                  <option value={'Caminhoneta'}>Caminhoneta</option>
                  <option value={'Ônibus'}>Ônibus</option>
                </select>
              </div>
              <div className="input-container">
                <p>Cor</p>
                <select
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_cor}
                  value={formData.veiculo_cor}
                  onChange={(e) => setFormData({ ...formData, veiculo_cor: e.target.value })}
                >
                  <option value={'Selecione'}>Selecione</option>
                  <option value={'Amarelo'}>Amarelo</option>
                  <option value={'Azul'}>Azul</option>
                  <option value={'Bege'}>Bege</option>
                  <option value={'Branca'}>Branca</option>
                  <option value={'Cinza'}>Cinza</option>
                  <option value={'Dourada'}>Dourada</option>
                  <option value={'Grená'}>Grená</option>
                  <option value={'Laranja'}>Laranja</option>
                  <option value={'Marrom'}>Marrom</option>
                  <option value={'Prata'}>Prata</option>
                  <option value={'Preta'}>Preta</option>
                  <option value={'Rosa'}>Rosa</option>
                  <option value={'Roxa'}>Roxa</option>
                  <option value={'Verde'}>Verde</option>
                  <option value={'Vermelha'}>Vermelha</option>
                  <option value={'Fantasia'}>Fantasia</option>
                </select>
              </div>
              <div className="input-container">
                <p>RENAVAM</p>
                <input
                  type="text"
                  maxLength={11}
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_renavam}
                  value={formData.veiculo_renavam}
                  onChange={(e) => setFormData({ ...formData, veiculo_renavam: e.target.value.replace(/[^0-9]/g, "") })}
                />
              </div>
              <div className="input-container">
                <p>Marca</p>
                <input
                  type="text"
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_marca}
                  value={formData.veiculo_marca}
                  onChange={(e) => setFormData({ ...formData, veiculo_marca: e.target.value })}
                />
              </div>
              <div className="input-container">
                <p>Modelo</p>
                <input
                  type="text"
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_modelo}
                  value={formData.veiculo_modelo}
                  onChange={(e) => setFormData({ ...formData, veiculo_modelo: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="form-buttons-container-pessoas">
        <div className="form-buttons">
          <button onClick={cleanInputs}>
            Limpar campos
          </button>
          <button onClick={handleSubmit}>
            Confirmar
          </button>
        </div>
      </div>
      <Snackbar
        ContentProps={{ sx: { borderRadius: '8px' } }}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert variant="filled" severity={alertSeverity}>
          {message}
        </Alert>
      </Snackbar>
    </div>

  )
}

export default DependenteComponent