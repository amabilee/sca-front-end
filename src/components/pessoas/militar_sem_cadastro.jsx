import React, { useState, useRef, useEffect } from 'react'
import { server } from '../../services/server'
import './style.css'
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import uploadIcon from '../../assets/upload.svg'
import Remove from '../../assets/remove_icon.svg'
import UserPhoto from '../../assets/login/user-photo.svg'

function MilitarSemCadastroComponent() {
  const [efetivoFoto, setEfetivoFoto] = useState("")
  const [graduacaoOptions, setGraduacaoOptions] = useState([])
  const [unidadeOptions, setUnidadeOptions] = useState([])
  const [situacaoOptions, setSituacaoOptions] = useState([])

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
      numero_ordem: '',
      nome_completo: '',
      nome_guerra: '',
      id_unidade: '',
      graduacao: '',
      id_graduacao: '',
      id_alerta: '',
      email: '',
      foto: '',

      cracha: '',
      entrada: 'Não',
      destino: '',
      veiculo_cracha: '',

      conduzindo: 'Não',
      veiculo_tipo: 'Selecione',
      veiculo_cor: 'Selecione',
      veiculo_placa: '',
      veiculo_renavam: '',
      veiculo_marca: '',
      veiculo_modelo: '',
    }
  )

  const [disabledInputs, setDisabledInputs] = useState(
    {
      nome_completo: true,
      nome_guerra: true,
      id_unidade: true,
      id_graduacao: true,
      id_alerta: true,
      email: true,
      foto: true,

      cracha: true,
      destino: true,
      veiculo_cracha: true,

      veiculo_tipo: true,
      veiculo_cor: true,
      veiculo_placa: true,
      veiculo_renavam: true,
      veiculo_marca: true,
      veiculo_modelo: true
    }
  )

  const cleanInputs = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      numero_ordem: '',
      nome_completo: '',
      nome_guerra: '',
      id_unidade: '',
      id_graduacao: '',
      id_alerta: '',
      graduacao: '',
      email: '',
      foto: '',

      cracha: '',
      entrada: 'Não',
      destino: '',
      veiculo_cracha: '',

      conduzindo: 'Não',
      veiculo_tipo: 'Selecione',
      veiculo_cor: 'Selecione',
      veiculo_placa: '',
      veiculo_renavam: '',
      veiculo_marca: '',
      veiculo_modelo: '',

    }));
    setEfetivoFoto('')
    setDisabledInputs((prevDisabledInputs) => ({
      ...prevDisabledInputs,
      nome_completo: true,
      nome_guerra: true,
      id_unidade: true,
      id_graduacao: true,
      id_alerta: true,
      email: true,
      foto: true,

      cracha: true,
      destino: true,
      veiculo_cracha: true,

      veiculo_tipo: true,
      veiculo_cor: true,
      veiculo_placa: true,
      veiculo_renavam: true,
      veiculo_marca: true,
      veiculo_modelo: true
    }))
  };

  //Handle Foto Input

  const fileInputRef = useRef(null);

  const detectEntryFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormData({ ...formData, foto: file });
      setEfetivoFoto(fileURL);
    }
  }

  const removeFoto = () => {
    setFormData({ ...formData, foto: '' });
    setEfetivoFoto('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  //Selectors options

  const getSelectOptions = async () => {
    let userData = localStorage.getItem('user');
    let userDataParsed = JSON.parse(userData);
    let token = localStorage.getItem("user_token")
    try {
      const response = await server.get(`/graduacao`, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });
      setGraduacaoOptions(response.data.entities)
    } catch (e) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Error ao buscar graduações.");
      setAlertSeverity("error");
    }

    try {
      const response = await server.get(`/unidade`, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });
      setUnidadeOptions(response.data.entities)
    } catch (e) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Erro ao buscar unidades.");
      setAlertSeverity("error");
    }
    try {
      const response = await server.get(`/alerta`, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });
      console.log(response.data.entities)
      setSituacaoOptions(response.data.entities)
    } catch (e) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Erro ao buscar situações.");
      setAlertSeverity("error");
    }
  }

  useEffect(() => {
    getSelectOptions()
  }, [])

  // Find Efetivo  

  const searchEfetivo = async (element) => {
    setFormData((prevFormData) => ({ ...prevFormData, numero_ordem: element, }));
    if (String(element).length == 7) {
      let userData = localStorage.getItem('user');
      let userDataParsed = JSON.parse(userData);
      let token = localStorage.getItem("user_token")
      try {
        const response = await server.get(`/efetivo/consulta/${element}`, {
          headers: {
            'Authentication': token,
            'access-level': userDataParsed.nivel_acesso
          }
        });

        if (response.data[0]) {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage("Já existe um militar cadastrado com este número de ordem");
          setAlertSeverity("error");
          return
        } else {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage("Este número de ordem esta disponível!");
          setAlertSeverity("success");
          setDisabledInputs((prevDisabledInputs) => ({
            ...prevDisabledInputs,
            nome_completo: false,
            nome_guerra: false,
            id_unidade: false,
            id_graduacao: false,
            id_alerta: false,
            email: false,
            foto: false,
            veiculo_placa: false,
          }))
          setFormData((prevFormData) => ({
            ...prevFormData,
            nome_completo: '',
            nome_guerra: '',
            id_unidade: '',
            graduacao: '',
            id_graduacao: '',
            id_alerta: '',
            email: '',
            foto: '',
            veiculo_placa: ''
          }));
        }
      } catch (e) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Este número de ordem esta disponível!");
        setAlertSeverity("success");
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: false,
          nome_guerra: false,
          id_unidade: false,
          id_graduacao: false,
          id_alerta: false,
          email: false,
          foto: false,
          veiculo_placa: false,
        }))
        setFormData((prevFormData) => ({
          ...prevFormData,
          nome_completo: '',
          nome_guerra: '',
          id_unidade: '',
          graduacao: '',
          id_graduacao: '',
          email: '',
          id_alerta: '',
          foto: '',
          veiculo_placa: ''
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nome_completo: '',
        nome_guerra: '',
        id_unidade: '',
        graduacao: '',
        id_graduacao: '',
        id_alerta: '',
        email: '',
        foto: '',
        veiculo_placa: ''
      }));
      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        nome_completo: true,
        nome_guerra: true,
        id_unidade: true,
        id_graduacao: true,
        id_alerta: true,
        email: true,
        foto: true,
        veiculo_existente: true,
      }))
    }
  }

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

  //Handle submit form

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.numero_ordem.length != 7) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um número de ordem válido.");
      setAlertSeverity("error");
    } else if (formData.nome_completo.length === 0) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um nome completo válido.");
      setAlertSeverity("error");
    } else if (formData.nome_guerra === '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um nome de guerra.");
      setAlertSeverity("error");
    } else if (formData.id_unidade === '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma unidade válida.");
      setAlertSeverity("error");
    } else if (formData.id_graduacao === '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira uma graduação válida.");
      setAlertSeverity("error");
    } else if (!emailPattern.test(formData.email)) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um email válido.");
      setAlertSeverity("error");
    } else if (formData.entrada === 'Sim' && formData.cracha == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um crachá para o militar válido.");
      setAlertSeverity("error");
    } else if (formData.entrada === 'Sim' && formData.destino == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um destino válido.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && formData.entrada === 'Sim' && formData.veiculo_cracha == '') {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage("Insira um crachá para o veículo válido.");
      setAlertSeverity("error");
    } else if (formData.conduzindo === 'Sim' && formData.veiculo_placa.length != 7) {
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

  //Types of requests

  const formatSendRequest = async () => {
    let userData = localStorage.getItem('user');
    let userDataParsed = JSON.parse(userData);
    let token = localStorage.getItem("user_token")

    if (formData.entrada == 'Sim' && formData.conduzindo == 'Sim') {
      sendRequestEfetivo(token, userDataParsed, 'efetivo+veiculo+registro')
    } else if (formData.conduzindo == 'Sim' && formData.entrada == 'Não') {
      sendRequestEfetivo(token, userDataParsed, 'efetivo+veiculo')
    } else if (formData.entrada == 'Sim' && formData.conduzindo == 'Não') {
      sendRequestEfetivo(token, userDataParsed, 'efetivo+registro')
    } else if (formData.conduzindo == 'Não' && formData.entrada == 'Não') {
      sendRequestEfetivo(token, userDataParsed, 'efetivo')
    }
  };

  //Efetivo

  const sendRequestEfetivo = async (token, userDataParsed, typeRequest) => {

    const formDataEfetivo = new FormData();
    formDataEfetivo.append('qrcode_efetivo', Number(formData.numero_ordem),);
    formDataEfetivo.append('nome_completo', formData.nome_completo);
    formDataEfetivo.append('nome_guerra', formData.nome_guerra);
    formDataEfetivo.append('id_graduacao', formData.id_graduacao);
    formDataEfetivo.append('id_alerta', formData.id_alerta);
    formDataEfetivo.append('id_unidade', formData.id_unidade);
    formDataEfetivo.append('email', formData.email);
    formDataEfetivo.append('foto', formData.foto != '' ? formData.foto : null);

    try {
      await server.post(`/efetivo`, formDataEfetivo, {
        headers: {
          'Authentication': token,
          'access-level': userDataParsed.nivel_acesso
        }
      });

      if (typeRequest === 'efetivo') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Militar cadastrado com sucesso.");
        setAlertSeverity("success");
        setFormData((prevFormData) => ({
          ...prevFormData,
          numero_ordem: '',
          nome_completo: '',
          nome_guerra: '',
          id_unidade: '',
          graduacao: '',
          id_graduacao: '',
          id_alerta: '',
          email: '',
          foto: '',
        }));
        setEfetivoFoto('')
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: true,
          nome_guerra: true,
          id_unidade: true,
          id_graduacao: true,
          id_alerta: true,
          email: true,
          foto: true,
        }));
      } else if (typeRequest === 'efetivo+veiculo') {
        sendRequestVeiculo(token, userDataParsed, typeRequest)
      } else if (typeRequest === 'efetivo+registro') {
        sendRequestRegistro(token, userDataParsed, typeRequest)
      } else if (typeRequest === 'efetivo+veiculo+registro') {
        sendRequestVeiculo(token, userDataParsed, typeRequest)
      }
    } catch (e) {
      if (e.response.status && e.response.status == 400) {
        if (typeRequest === 'efetivo') {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage(e.response.data.message);
          setAlertSeverity("error");
        } else if (typeRequest === 'efetivo+veiculo') {
          sendRequestVeiculo(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'efetivo+registro') {
          sendRequestRegistro(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'efetivo+veiculo+registro') {
          sendRequestVeiculo(token, userDataParsed, typeRequest)
        }
      } else {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Erro inesperado ao criar militar.');
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

      if (typeRequest === 'efetivo+veiculo+registro') {
        sendRequestRegistro(token, userDataParsed, typeRequest)
      } else if (typeRequest === 'efetivo+veiculo') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Militar e veículo cadastrados com sucesso.");
        setAlertSeverity("success");
        setFormData((prevFormData) => ({
          ...prevFormData,
          numero_ordem: '',
          nome_completo: '',
          nome_guerra: '',
          id_unidade: '',
          graduacao: '',
          id_graduacao: '',
          id_alerta: '',
          email: '',
          foto: '',

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
          nome_guerra: true,
          id_unidade: true,
          id_graduacao: true,
          id_alerta: true,
          email: true,
          foto: true,

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
        if (typeRequest === 'efetivo+veiculo+registro') {
          sendRequestRegistro(token, userDataParsed, typeRequest)
        } else if (typeRequest === 'efetivo+veiculo') {
          setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
          setMessage(e.response.data.message);
          setAlertSeverity("error");
        }
      } else {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage('Erro inesperado ao criar veículo.');
        setAlertSeverity("error");
      }
    }
  }

  //Registro

  const sendRequestRegistro = async (token, userDataParsed, typeRequest) => {
    let registroFormattedData

    const { formattedDate, formattedTime } = getFormattedDateTime();

    if (typeRequest === 'efetivo+registro') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2, //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        qrcode: formData.numero_ordem,
        qrcode_autorizador: userDataParsed.usuario,
        detalhe: formData.destino
      }
    } else if (typeRequest === 'efetivo+veiculo+registro') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2,  //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        cracha_veiculo_numero: formData.veiculo_cracha,
        qrcode: formData.numero_ordem,
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

      if (typeRequest === 'efetivo+registro') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Militar e registro cadastrados com sucesso.");
        setAlertSeverity("success");
        cleanInputs()

      } else if (typeRequest === 'efetivo+veiculo+registro') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Militar, veículo e registro cadastrados com sucesso.");
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
        <h3>Dados militar sem cadastro</h3>
        <p>Digite o número de ordem para pesquisar ou cadastrar um novo militar</p>
      </div>
      <div className="session-input-militar1">
        <div className="session-input-militar-box-input">
          <div className="session-input-line1">
            <div className="input-container">
              <p>Número de ordem*</p>
              <input
                type="text"
                maxLength={7}
                className='filtering-input'
                value={formData.numero_ordem}
                onChange={(e) => searchEfetivo(e.target.value.replace(/[^0-9]/g, ""))}
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
              <p>Nome de guerra*</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.nome_guerra}
                value={formData.nome_guerra}
                onChange={(e) => setFormData({ ...formData, nome_guerra: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Situação*</p>
              <select
                value={formData.id_alerta}
                disabled={disabledInputs.id_alerta}
                className='filtering-input'
                onChange={(e) => setFormData({ ...formData, id_alerta: e.target.value })}>
                <option value={0}>Nenhuma</option>
                {situacaoOptions.map((modulo, i) => (
                  <option key={i} value={modulo.id}>{modulo.nome_alerta}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="session-input-line2">
            <div className="input-container">
              <p>Unidade*</p>
              <select
                value={formData.id_unidade}
                disabled={disabledInputs.id_unidade}
                className='filtering-input'
                onChange={(e) => setFormData({ ...formData, id_unidade: e.target.value })}>
                <option value={0}>Nenhuma</option>
                {unidadeOptions.map((modulo, i) => (
                  <option key={i} value={modulo.id}>{modulo.nome}</option>
                ))}
              </select>
            </div>
            <div className="input-container">
              <p>Posto\Graduação*</p>
              <select
                value={formData.id_graduacao}
                disabled={disabledInputs.id_graduacao}
                className='filtering-input'
                onChange={(e) => setFormData({ ...formData, id_graduacao: e.target.value, graduacao: e.target.options[e.target.selectedIndex].text })}>
                <option value={0}>Nenhuma</option>
                {graduacaoOptions.map((modulo, i) => (
                  <option key={i} value={modulo.id}>{modulo.sigla}</option>
                ))}
              </select>
            </div>
            <div className="input-container">
              <p>Email*</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
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
              {efetivoFoto && (
                <div className="foto-pessoa-preview">
                  <button className="remove-foto-button" onClick={removeFoto}>
                    <img src={Remove} />
                  </button>
                  <img src={efetivoFoto} alt="Foto do Efetivo" className="pessoa-foto" />
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
      <div className="pessoas-section-input  session-input-autorizador-simple">
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
            onChange={(e) => setFormData({ ...formData, cracha: e.target.value.replace(/[^0-9]/g, "")})}
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
                className='filtering-input'
                disabled={disabledInputs.veiculo_placa}
                value={formData.veiculo_placa}
                onChange={(e) => searchVeiculos(e.target.value)}
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
                  onChange={(e) => setFormData({ ...formData, veiculo_renavam: e.target.value.replace(/[^0-9]/g, "")  })}
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

export default MilitarSemCadastroComponent