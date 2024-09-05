import { useState } from 'react'
import { server } from '../../services/server'
import './style.css'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserPhoto from '../../assets/login/user-photo.svg'

function MilitarSemANCrachaComponent() {
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
      //Militar
      numero_ordem: '',
      nome_completo: '',
      nome_guerra: '',
      unidade: '',
      graduacao: '',
      email: '',
      foto: '',

      //Registro
      entrada: 'militar',
      cracha: '',
      destino: '',
      veiculo_cracha: '',

      //Veiculo
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
      unidade: true,
      graduacao: true,
      email: true,

      cracha: false,
      destino: false,
      veiculo_cracha: true,

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
      numero_ordem: '',
      nome_completo: '',
      nome_guerra: '',
      unidade: '',
      graduacao: '',
      email: '',
      foto: '',

      cracha: '',
      entrada: 'militar',
      destino: '',
      veiculo_cracha: '',

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
      email: true,

      cracha: false,
      destino: false,
      veiculo_cracha: true,

      veiculo_tipo: true,
      veiculo_cor: true,
      veiculo_renavam: true,
      veiculo_marca: true,
      veiculo_modelo: true
    }))
  };

  // Find Efetivo  

  const searchEfetivo = async (element) => {

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

        const {
          nome_completo,
          nome_guerra,
          Unidade,
          email,
          Graduacao,
          Fotos
        } = response.data[0];

        let fotoBase64 = '';
        if (Fotos && Fotos.length > 0) {
          try {
            const fotoBuffer = Fotos[0].foto.data;
            fotoBase64 = `data:image/png;base64,${bufferToBase64(fotoBuffer)}`;
          } catch (error) {
            console.error('Error converting buffer to Base64:', error);
          }
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          numero_ordem: element,
          nome_completo: nome_completo || 'Vazio',
          nome_guerra: nome_guerra || 'Vazio',
          unidade: Unidade.nome || 'Vazio',
          graduacao: Graduacao.sigla || 'Vazio',
          email: email || 'Vazio',
          foto: fotoBase64,
        }));

        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: true,
          nome_guerra: true,
          unidade: true,
          graduacao: true,
          email: true
        }))
      } catch (e) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Não foi encontrado um militar com este número de ordem!");
        setAlertSeverity("error");
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          numero_ordem: element,
          nome_completo: true,
          nome_guerra: true,
          id_unidade: true,
          id_graduacao: true,
          email: true,
        }))
        setFormData((prevFormData) => ({
          ...prevFormData,
          numero_ordem: element,
          nome_completo: '',
          nome_guerra: '',
          unidade: '',
          graduacao: '',
          email: '',
          foto: '',
        }));
      }
    } else {

      setFormData((prevFormData) => ({
        ...prevFormData,
        numero_ordem: element,
        nome_completo: '',
        nome_guerra: '',
        unidade: '',
        graduacao: '',
        email: '',
        foto: '',
      }));

      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        nome_completo: true,
        nome_guerra: true,
        unidade: true,
        graduacao: true,
        email: true,
      }))
    }
  }

  // Handle Registrar Entrada Change

  const changeRegistroEntrada = (element) => {
    setFormData((prevFormData) => ({ ...prevFormData, entrada: element }));
    if (element == 'militar') {
      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        cracha: false,
        destino: false,
        veiculo_cracha: true,
      }));
    } else if (element == 'veiculo') {
      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        cracha: true,
        destino: false,
        veiculo_cracha: false,
      }));
    } else if (element == 'ambos') {
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
    if (String(element).length == 7) {
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

  //Handle Foto Input

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


    if (formData.entrada == 'militar') {
      if (String(formData.numero_ordem).length != 7) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um número de ordem válido.");
        setAlertSeverity("error");
      } else if (formData.nome_completo == '' || formData.nome_guerra == '' || formData.unidade == '' || formData.email == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um militar válido.");
        setAlertSeverity("error");
      } else if (String(formData.cracha).length != 5) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um crachá para o militar válido.");
        setAlertSeverity("error");
      } else if (formData.destino == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um destino válido.");
        setAlertSeverity("error");
      } else {
        formatSendRequest();
      }
    } else if (formData.entrada == 'veiculo') {
      if (formData.numero_ordem.length != 7) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um número de ordem válido.");
        setAlertSeverity("error");
      } else if (String(formData.veiculo_cracha).length != 5) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um crachá para o veículo válido.");
        setAlertSeverity("error");
      } else if (formData.destino == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um destino válido.");
        setAlertSeverity("error");
      } else if (!validarPlaca(formData.veiculo_placa.toUpperCase())) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira uma placa válida.");
        setAlertSeverity("error");
      } else if (formData.veiculo_tipo == 'Selecione') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um tipo válido.");
        setAlertSeverity("error");
      } else if (formData.veiculo_cor == 'Selecione') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira uma cor válida.");
        setAlertSeverity("error");
      } else if (String(formData.veiculo_renavam).length != 11) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um RENAVAM válido.");
        setAlertSeverity("error");
      } else if (formData.veiculo_marca == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira uma marca válida.");
        setAlertSeverity("error");
      } else if (formData.veiculo_modelo == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um modelo válido.");
        setAlertSeverity("error");
      } else {
        formatSendRequest();
      }
    } else if (formData.entrada == 'ambos') {
      if (formData.numero_ordem.length != 7) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um número de ordem válido.");
        setAlertSeverity("error");
      } else if (formData.nome_completo == '' || formData.nome_guerra == '' || formData.unidade == '' || formData.email == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um militar válido.");
        setAlertSeverity("error");
      } else if (String(formData.cracha).length != 5) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um crachá para o militar válido.");
        setAlertSeverity("error");
      } else if (String(formData.veiculo_cracha).length != 5) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um crachá para o veículo válido.");
        setAlertSeverity("error");
      } else if (formData.destino == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um destino válido.");
        setAlertSeverity("error");
      } else if (!validarPlaca(formData.veiculo_placa.toUpperCase())) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira uma placa válida.");
        setAlertSeverity("error");
      } else if (formData.veiculo_tipo == 'Selecione') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um tipo válido.");
        setAlertSeverity("error");
      } else if (formData.veiculo_cor == 'Selecione') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira uma cor válida.");
        setAlertSeverity("error");
      } else if (String(formData.veiculo_renavam).length != 11) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um RENAVAM válido.");
        setAlertSeverity("error");
      } else if (formData.veiculo_marca == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira uma marca válida.");
        setAlertSeverity("error");
      } else if (formData.veiculo_modelo == '') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Insira um modelo válido.");
        setAlertSeverity("error");
      } else {
        formatSendRequest();
      }
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

    if (formData.entrada == 'ambos') {
      sendRequestVeiculo(token, userDataParsed, 'ambos')
    } else if (formData.entrada == 'militar') {
      sendRequestRegistro(token, userDataParsed, 'militar')
    } else if (formData.entrada == 'veiculo') {
      sendRequestVeiculo(token, userDataParsed, 'veiculo')
    }
  };

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
      sendRequestRegistro(token, userDataParsed, typeRequest)
    } catch (e) {
      if (e.response.status && e.response.status == 400) {
        sendRequestRegistro(token, userDataParsed, typeRequest)
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

    if (typeRequest == 'militar') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2, //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        qrcode: formData.numero_ordem,
        qrcode_autorizador: formData.numero_ordem,
        sentinela: userDataParsed.usuario,
        detalhe: formData.destino
      }
    } else if (typeRequest == 'veiculo') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2,  //nivel_acesso posto principal
        cracha_veiculo_numero: formData.veiculo_cracha,
        placa_veiculo_sem_an: formData.veiculo_placa,
        qrcode_autorizador: formData.numero_ordem,
        sentinela: userDataParsed.usuario,
        detalhe: formData.destino
      }
    } else if (typeRequest == 'ambos') {
      registroFormattedData = {
        data: formattedDate,
        hora: formattedTime,
        tipo: 'Entrada',
        posto: 2,  //nivel_acesso posto principal
        cracha_pessoa_numero: formData.cracha,
        cracha_veiculo_numero: formData.veiculo_cracha,
        qrcode: formData.numero_ordem,
        placa_veiculo_sem_an: formData.veiculo_placa,
        qrcode_autorizador: formData.numero_ordem,
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

      if (typeRequest == 'militar') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Militar e registro cadastrados com sucesso.");
        setAlertSeverity("success");
      } else if (typeRequest == 'veiculo') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Veículo e registro cadastrados com sucesso.");
        setAlertSeverity("success");
      } else if (typeRequest == 'ambos') {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Militar, veículo e registro cadastrados com sucesso.");
        setAlertSeverity("success");
      }
      cleanInputs()
    } catch (e) {
      setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
      setMessage(e.response.data.message ? e.response.data.message : 'Erro ao inesperado ao criar registro.');
      setAlertSeverity("error");
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
        <h3>Dados militar sem AN/Crachá</h3>
        <p>Digite o número de ordem para pesquisar um militar</p>
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
              <p>Nome completo</p>
              <input
                type="text"
                disabled={disabledInputs.nome_completo}
                className='filtering-input'
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Nome de guerra</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.nome_guerra}
                value={formData.nome_guerra}
                onChange={(e) => setFormData({ ...formData, nome_guerra: e.target.value })}
              />
            </div>
          </div>
          <div className="session-input-line2">
            <div className="input-container">
              <p>Unidade</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.unidade}
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Posto/Graduação</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.graduacao}
                value={formData.graduacao}
                onChange={(e) => setFormData({ ...formData, graduacao: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Email</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '' ) })}
              />
            </div>
          </div>
        </div>
        <div className="input-container">
          <p>Foto</p>
          <div className="input-container input-foto">
            {formData.foto != '' ? (
              <img src={formData.foto} alt="Foto do Militar" className='photo-consulta' />
            ) : (
              <img src={UserPhoto} alt="Sem foto" className='no-photo-consulta' />
            )}
          </div>
        </div>
      </div>
      <div className="pessoas-section-title">
        <h3>Autorizador</h3>
      </div>
      <div className="pessoas-section-input  session-input-autorizador-simple">
        <div className="input-container">
          <p>Inserir entrada no sistema? </p>
          <select
            className='filtering-input'
            value={formData.entrada}
            onChange={(e) => changeRegistroEntrada(e.target.value)}
          >
            <option value={'militar'}>Somente militar</option>
            <option value={'veiculo'}>Somente veículo</option>
            <option value={'ambos'}>Militar e veículo</option>
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
          <p>Crachá</p>
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
      {formData.entrada != 'militar' && (
        <>
          <div className="pessoas-section-title">
            <h3>Veículo</h3>
          </div>
          <div className="pessoas-section-input session-input-visitante4">
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
          </div>
        </>
      )}
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
    </div >

  )
}

export default MilitarSemANCrachaComponent