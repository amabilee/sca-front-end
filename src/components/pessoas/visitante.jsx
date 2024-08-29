import { useState, useRef } from 'react'
import { server } from '../../services/server'
import './style.css'
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import uploadIcon from '../../assets/upload.svg'
import Remove from '../../assets/remove_icon.svg'
import UserPhoto from '../../assets/login/user-photo.svg'

function VisitanteComponent() {
  const [visitanteFoto, setVisitanteFoto] = useState("")
  // SnackBar config
  const [message, setMessage] = useState("");
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

  const [formData, setFormData] = useState(
    {
      cpf: '',
      nome_completo: '',
      rua: '',
      numero: '',
      bairro: '',
      estado: 'Selecione',

      complemento: '',
      telefone: '',
      foto: '',
      empresa: '',


      cracha: '',
      autorizador_numero: '',
      autorizador: '',
      entrada: 'Não',
      destino: '',


      conduzindo: 'Não',
      veiculo_placa: '',
      veiculo_tipo: 'Selecione',
      veiculo_cor: 'Selecione',
      veiculo_renavam: '',
      veiculo_marca: '',
      veiculo_modelo: '',
      veiculo_cracha: ''
    }
  )

  const [disabledInputs, setDisabledInputs] = useState(
    {
      nome_completo: true,
      rua: true,
      numero: true,
      bairro: true,
      estado: true,

      complemento: true,
      telefone: true,
      foto: true,
      empresa: true,


      cracha: true,
      autorizador_numero: true,
      autorizador: true,
      destino: true,
      veiculo_cracha: true,


      veiculo_placa: true,
      veiculo_tipo: true,
      veiculo_cor: true,
      veiculo_renavam: true,
      veiculo_marca: true,
      veiculo_modelo: true
    }
  )

  const cleanInputs = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      cpf: '',
      nome_completo: '',
      rua: '',
      numero: '',
      bairro: '',
      estado: 'Selecione',

      complemento: '',
      telefone: '',
      foto: '',
      empresa: '',


      cracha: '',
      autorizador_numero: '',
      autorizador: '',
      entrada: 'Não',
      destino: '',


      conduzindo: 'Não',
      veiculo_placa: '',
      veiculo_tipo: 'Selecione',
      veiculo_cor: 'Selecione',
      veiculo_renavam: '',
      veiculo_marca: '',
      veiculo_modelo: '',
      veiculo_cracha: ''
    }));
    setVisitanteFoto('')
    setDisabledInputs((prevDisabledInputs) => ({
      ...prevDisabledInputs,
      nome_completo: true,
      telefone: true,
      empresa: true,
      foto: true,
      rua: true,
      numero: true,
      bairro: true,
      estado: true,
      complemento: true,
      cracha: true,
      autorizador_numero: true,
      autorizador: true,
      destino: true,
      veiculo_cracha: true,

      veiculo_existente: true,
      veiculo_tipo: true,
      veiculo_cor: true,
      veiculo_placa: true,
      veiculo_renavam: true,
      veiculo_marca: true,
      veiculo_modelo: true
    }))
  };

  // Find Visitante  

  const searchVisitante = async (element) => {
    if (String(element).length == 14) {
      let formattedCPF = String(element).replace(/\D/g, '');
      let userData = localStorage.getItem('user');
      let userDataParsed = JSON.parse(userData);
      let token = localStorage.getItem('user_token');

      try {
        const response = await server.get(`/visitante?cpf=${formattedCPF}`, {
          headers: {
            'Authentication': token,
            'access-level': userDataParsed.nivel_acesso,
          },
        });

        const entities = response.data.entities;

        if (entities.length >= 1) {
          const visitanteColected = entities[0];

          let fotoBase64 = '';
          if (visitanteColected.foto && visitanteColected.foto != null) {
            try {
              const fotoBuffer = visitanteColected.foto.data;
              fotoBase64 = `data:image/png;base64,${bufferToBase64(fotoBuffer)}`;
            } catch (error) {
              console.error('Error converting buffer to Base64:', error);
            }
          }

          setFormData((prevFormData) => ({
            ...prevFormData,
            cpf: element,
            nome_completo: visitanteColected.nome,
            rua: visitanteColected.rua,
            numero: visitanteColected.numero,
            bairro: visitanteColected.bairro,
            estado: visitanteColected.estado,
            complemento: visitanteColected.complemento == null || visitanteColected.complemento == "null" ? 'Não informado' : visitanteColected.complemento,
            telefone: visitanteColected.telefone && visitanteColected.telefone.length >= 13 ? visitanteColected.telefone : '',
            foto: fotoBase64,
            empresa: visitanteColected.empresa == null || visitanteColected.empresa == "null" ? 'Não informado' : visitanteColected.empresa,
          }));

          setDisabledInputs((prevDisabledInputs) => ({
            ...prevDisabledInputs,
            nome_completo: true,
            rua: true,
            numero: true,
            bairro: true,
            estado: true,
            complemento: true,
            telefone: true,
            foto: true,
            empresa: true,
            veiculo_placa: false,
          }));
        } else {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage('Não foi encontrado um visitante com este CPF');
          setAlertSeverity("error");
          setDisabledInputs((prevDisabledInputs) => ({
            ...prevDisabledInputs,
            nome_completo: false,
            rua: false,
            numero: false,
            bairro: false,
            estado: false,
            complemento: false,
            telefone: false,
            foto: false,
            empresa: false,
            veiculo_placa: false,
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            cpf: element,
            nome_completo: '',
            rua: '',
            numero: '',
            bairro: '',
            estado: 'Selecione',
            complemento: '',
            telefone: '',
            foto: '',
            empresa: '',
          }));
          setVisitanteFoto('')
        }
        return;
      } catch (e) {
        console.error('Error fetching visitante:', e);
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Não foi encontrado um visitante com este CPF');
        setAlertSeverity("error");
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: false,
          rua: false,
          numero: false,
          bairro: false,
          estado: false,
          complemento: false,
          telefone: false,
          foto: false,
          empresa: false,
          veiculo_placa: false,
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          cpf: element,
          nome_completo: '',
          rua: '',
          numero: '',
          bairro: '',
          estado: 'Selecione',
          complemento: '',
          telefone: '',
          foto: '',
          empresa: '',
        }));
        setVisitanteFoto('')
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        cpf: element,
        nome_completo: '',
        rua: '',
        numero: '',
        bairro: '',
        estado: 'Selecione',
        complemento: '',
        telefone: '',
        foto: '',
        empresa: '',
        veiculo_placa: '',
      }));

      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        nome_completo: true,
        rua: true,
        numero: true,
        bairro: true,
        estado: true,
        complemento: true,
        telefone: true,
        foto: true,
        empresa: true,
        veiculo_placa: true,
      }));
      setVisitanteFoto('')
    }
  };

  // Handle Registrar Entrada Change

  const changeRegistroEntrada = (element) => {
    setFormData({ ...formData, entrada: element })
    if (element == 'Sim') {
      setDisabledInputs({
        ...disabledInputs,
        cracha: false,
        veiculo_cracha: false,
        autorizador_numero: false,
        destino: false
      })
    } else {
      setDisabledInputs({
        ...disabledInputs,
        cracha: true,
        veiculo_cracha: true,
        autorizador_numero: true,
        destino: true
      })
    }
  }

  //Find Efetivo

  const searchEfetivo = async (element) => {
    setFormData({ ...formData, autorizador_numero: element })
    if (String(element).length === 7) {
      try {
        const response = await server.get(`/efetivo/consulta/${element}`);

        if (response.data[0]) {
          const efetivoColected = response.data[0];
          setFormData((prevFormData) => ({
            ...prevFormData,
            autorizador: `${efetivoColected.Graduacao.sigla} ${efetivoColected.nome_guerra}`,
          }));

          setDisabledInputs((prevDisabledInputs) => ({
            ...prevDisabledInputs,
            autorizador: true,
          }));
        } else {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage('Não foi encontrado um efetivo com este Número Ordem');
          setAlertSeverity("error");
          setFormData((prevFormData) => ({
            ...prevFormData,
            autorizador: '',
          }));
        }
      } catch (e) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Não foi encontrado um efetivo com este Número Ordem');
        setAlertSeverity("error");
        setFormData((prevFormData) => ({
          ...prevFormData,
          autorizador: '',
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        autorizador: '',
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
        return
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

  //Handle Foto Input

  const fileInputRef = useRef(null);

  const detectEntryFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormData({ ...formData, foto: file });
      setVisitanteFoto(fileURL);
    }
  }

  const removeFoto = () => {
    setFormData({ ...formData, foto: '' });
    setVisitanteFoto('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const bufferToBase64 = (data) => {
    let binaryString = "";
    const bytes = new Uint8Array(data);
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  };

  //Handle submit form

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      veiculo_placa: formData.veiculo_placa.toUpperCase(),
    }));

    if (formData.cpf.length != 14) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um CPF válido.");
    } else if (formData.nome_completo.length === 0) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um nome completo válido.");
    } else if (formData.bairro === '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um bairro.");
    } else if (formData.numero === '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um número.");
    } else if (formData.rua === '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma rua.");
    } else if (formData.estado === 'Selecione') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um estado.");
    } else if (formData.entrada === 'Sim' && String(formData.cracha).length != 5) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um crachá para o visitante válido.");
    } else if (formData.entrada === 'Sim' && formData.destino == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um destino válido.");
    } else if (formData.entrada === 'Sim' && formData.autorizador == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um autorizador válido.");
    } else if (formData.conduzindo === 'Sim' && formData.entrada === 'Sim' && String(formData.veiculo_cracha).length != 5) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um crachá para o veículo válido.");
    } else if (formData.conduzindo === 'Sim' && !validarPlaca(formData.veiculo_placa.toUpperCase())) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma placa válida.");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_tipo == 'Selecione') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um tipo válido.");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_cor == 'Selecione') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma cor válida.");
    } else if (formData.conduzindo === 'Sim' && String(formData.veiculo_renavam).length != 11) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um RENAVAM válido.");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_marca == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma marca válida.");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_modelo == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um modelo válido.");
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
      sendRequestVisitante(token, userDataParsed, 'visitante+veiculo+registro')
    } else if (formData.conduzindo == 'Sim' && formData.entrada == 'Não') {
      sendRequestVisitante(token, userDataParsed, 'visitante+veiculo')
    } else if (formData.entrada == 'Sim' && formData.conduzindo == 'Não') {
      sendRequestVisitante(token, userDataParsed, 'visitante+registro')
    } else if (formData.conduzindo == 'Não' && formData.entrada == 'Não') {
      sendRequestVisitante(token, userDataParsed, 'visitante')
    }
  };

  //Visitante

  const sendRequestVisitante = async (token, userDataParsed, typeRequest) => {
    let formattedCPF = String(formData.cpf).replace(/\D/g, '')
    let formattedTelefone = String(formData.telefone).replace(/\D/g, '')

    const formDataVisitante = new FormData();
    formDataVisitante.append('cpf', Number(formattedCPF),);
    formDataVisitante.append('nome', formData.nome_completo,);
    formDataVisitante.append('rua', formData.rua,);
    formDataVisitante.append('numero', formData.numero,);
    formDataVisitante.append('bairro', formData.bairro,);
    formDataVisitante.append('estado', formData.estado,);
    formDataVisitante.append('complemento', formData.complemento != '' ? formData.complemento : null,);
    formDataVisitante.append('telefone', formData.telefone != '' ? formattedTelefone : null,);
    formDataVisitante.append('empresa', formData.empresa != '' ? formData.empresa : null,);
    formDataVisitante.append('foto', formData.foto != '' ? formData.foto : null);

    try {
      await server.post(`/visitante`, formDataVisitante, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });

      if (typeRequest === 'visitante') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Visitante cadastrado com sucesso.");
        setAlertSeverity("success");
        setFormData((prevFormData) => ({
          ...prevFormData,
          cpf: '',
          nome_completo: '',
          rua: '',
          numero: '',
          bairro: '',
          estado: 'Selecione',
          complemento: '',
          telefone: '',
          foto: '',
          empresa: '',
        }));
        setVisitanteFoto('')
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: true,
          telefone: true,
          empresa: true,
          foto: true,
          rua: true,
          numero: true,
          bairro: true,
          estado: true,
          complemento: true,
        }));
      } else if (typeRequest === 'visitante+veiculo') {
        sendRequestVeiculo(token, userDataParsed, typeRequest)
      } else if (typeRequest === 'visitante+registro') {
        sendRequestRegistro(token, userDataParsed, typeRequest)
      } else if (typeRequest === 'visitante+veiculo+registro') {
        sendRequestVeiculo(token, userDataParsed, typeRequest)
      }
    } catch (e) {
      if (e.response && e.response.status == 400) {
        if (typeRequest === 'visitante') {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage(e.response.data.message);
          setAlertSeverity("error");
        } else if (typeRequest === 'visitante+veiculo') {
          sendRequestVeiculo(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'visitante+registro') {
          sendRequestRegistro(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'visitante+veiculo+registro') {
          sendRequestVeiculo(token, userDataParsed, typeRequest)
        }
      } else {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Erro ao criar visitante.');
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

      if (typeRequest === 'visitante+veiculo+registro') {
        sendRequestRegistro(token, userDataParsed, typeRequest)
      } else if (typeRequest === 'visitante+veiculo') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Visitante e veículo cadastrados com sucesso.");
        setAlertSeverity("success");
        setFormData((prevFormData) => ({
          ...prevFormData,
          cpf: '',
          nome_completo: '',
          rua: '',
          numero: '',
          bairro: '',
          estado: 'Selecione',
          complemento: '',
          telefone: '',
          foto: '',
          empresa: '',

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
          telefone: true,
          empresa: true,
          foto: true,
          rua: true,
          numero: true,
          bairro: true,
          estado: true,
          complemento: true,
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
        if (typeRequest === 'visitante+veiculo+registro') {
          sendRequestRegistro(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'visitante+veiculo') {
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

    if (typeRequest === 'visitante+registro') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2, //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        cpf_visitante: formattedCPF,
        autorizador: formData.autorizador,
        sentinela: userDataParsed.usuario,
        detalhe: formData.destino
      }
    } else if (typeRequest === 'visitante+veiculo+registro') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2,  //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        cracha_veiculo_numero: formData.veiculo_cracha,
        cpf_visitante: formattedCPF,
        placa_veiculo_sem_an: formData.veiculo_placa,
        autorizador: formData.autorizador,
        sentinela: userDataParsed.usuario,
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

      if (typeRequest === 'visitante+registro') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Visitante e registro cadastrados com sucesso.");
        setAlertSeverity("success");
        cleanInputs()
      } else if (typeRequest === 'visitante+veiculo+registro') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Visitante, veículo e registro cadastrados com sucesso.");
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
        <h3>Dados visitante</h3>
        <p>Digite o CPF para pesquisar ou cadastrar um novo visitante</p>
      </div>
      <div className="session-input-visitante1">
        <div className="session-input-visitante-box-input">
          <div className="session-input-line1">
            <div className="input-container">
              <p>CPF*</p>
              <IMaskInput
                type="text"
                mask="000.000.000-00"
                className='filtering-input'
                value={formData.cpf}
                onChange={(e) => searchVisitante(e.target.value)}
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
              <p>Telefone</p>
              <IMaskInput
                mask='(00) 0 0000-0000'
                type='text'
                className='filtering-input'
                disabled={disabledInputs.telefone}
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Empresa</p>
              <input
                type="text"
                className='filtering-input'
                disabled={disabledInputs.empresa}
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              />
            </div>
          </div>
          <div className="session-input-line2">
            <div className="input-container">
              <p>Bairro*</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.bairro}
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Número*</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.numero}
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Rua*</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.rua}
                value={formData.rua}
                onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Complemento</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.complemento}
                value={formData.complemento}
                onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Estado*</p>
              <select
                type='text'
                className='filtering-input'
                disabled={disabledInputs.estado}
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value={'Selecione'}>Selecione</option>
                <option value={'AC'}>AC</option>
                <option value={'AL'}>AL</option>
                <option value={'AP'}>AP</option>
                <option value={'AM'}>AM</option>
                <option value={'BA'}>BA</option>
                <option value={'CE'}>CE</option>
                <option value={'DF'}>DF</option>
                <option value={'ES'}>ES</option>
                <option value={'GO'}>GO</option>
                <option value={'MA'}>MA</option>
                <option value={'MT'}>MT</option>
                <option value={'MS'}>MS</option>
                <option value={'MG'}>MG</option>
                <option value={'PA'}>PA</option>
                <option value={'PB'}>PB</option>
                <option value={'PR'}>PR</option>
                <option value={'PE'}>PE</option>
                <option value={'PI'}>PI</option>
                <option value={'RJ'}>RJ</option>
                <option value={'RN'}>RN</option>
                <option value={'RS'}>RS</option>
                <option value={'RO'}>RO</option>
                <option value={'RR'}>RR</option>
                <option value={'SC'}>SC</option>
                <option value={'SP'}>SP</option>
                <option value={'SE'}>SE</option>
                <option value={'TO'}>TO</option>
              </select>
            </div>
          </div>
        </div>
        <div className="input-container">
          <p>Foto</p>
          {!disabledInputs.foto ? (
            <>
              <label htmlFor="arquivo" className="label-foto-input">Enviar arquivo<img src={uploadIcon} /></label>
              <input
                type="file"
                id="arquivo"
                ref={fileInputRef}
                className='filtering-input'
                onChange={detectEntryFoto}
              />
              {visitanteFoto && (
                <div className="foto-pessoa-preview">
                  <button className="remove-foto-button" onClick={removeFoto}>
                    <img src={Remove} />
                  </button>
                  <img src={visitanteFoto} alt="Foto do Efetivo" className="pessoa-foto" />
                </div>
              )}
            </>
          ) : (
            <div className="input-container input-foto">
              {formData.foto != '' ? (
                <img src={formData.foto} alt="Foto do Militar" className='photo-consulta' />
              ) : (
                <img src={UserPhoto} alt="Sem foto" className='no-photo-consulta' />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="pessoas-section-title">
        <h3>Autorizador</h3>
      </div>
      <div className="pessoas-section-input session-input-autorizador">
        <div className="input-container">
          <p>Inserir entrada deste visitante no sistema? </p>
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
          <p>Número de Ordem*</p>
          <input
            type="text"
            maxLength={7}
            className='filtering-input'
            value={formData.autorizador_numero}
            disabled={disabledInputs.autorizador_numero}
            onChange={(e) => searchEfetivo(e.target.value.replace(/[^0-9]/g, ""))}
          />
        </div>
        <div className="input-container">
          <p>Militar</p>
          <input
            className='filtering-input'
            disabled={true}
            value={formData.autorizador}
            onChange={(e) => setFormData({ ...formData, autorizador: e.target.value })}
          />
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
      </div>
      <div className="pessoas-section-input">
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
      <div className="pessoas-section-input session-input-visitante4">
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
                disabled={disabledInputs.veiculo_placa}
                value={formData.veiculo_placa}
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

export default VisitanteComponent