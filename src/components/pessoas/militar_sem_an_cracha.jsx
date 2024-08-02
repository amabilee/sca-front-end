import React, { useState, useRef } from 'react'
import { server } from '../../services/server'
import './style.css'
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import uploadIcon from '../../assets/upload.svg'
import Remove from '../../assets/remove_icon.svg'
import UserPhoto from '../../assets/login/user-photo.svg'

function MilitarSemANCrachaComponent() {
  const [efetivoFoto, setEfetivoFoto] = useState("")
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
      entrada: 'Não',
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
      unidade: '',
      graduacao: '',
      email: '',
      foto: '',

      cracha: '',
      entrada: 'Não',
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

  // Find Efetivo  

  const searchEfetivo = async (element) => {

    if (String(element).length == 7) {
      console.log(2)
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
          email: true,
          veiculo_placa: false,
        }))
      } catch (e) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Não foi encontrado um militar com este número de ordem!");
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          numero_ordem: element,
          nome_completo: true,
          nome_guerra: true,
          id_unidade: true,
          id_graduacao: true,
          email: true,
          veiculo_placa: true,
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
          veiculo_placa: ''
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
        veiculo_placa: ''
      }));

      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        nome_completo: true,
        nome_guerra: true,
        unidade: true,
        graduacao: true,
        email: true,
        veiculo_placa: true,
      }))
    }
  }

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

        setFormData((prevFormData) => ({
          ...prevFormData,
          veiculo_tipo: veiculoColected.tipo,
          veiculo_cor: veiculoColected.cor_veiculo,
          veiculo_placa: element,
          veiculo_renavam: veiculoColected.renavam,
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


  const send = () => {
    console.log(formData)
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
              <IMaskInput
                type="text"
                mask="0000000"
                className='filtering-input'
                value={formData.numero_ordem}
                onChange={(e) => searchEfetivo(e.target.value)}
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
          </div>
          <div className="session-input-line2">
            <div className="input-container">
              <p>Unidade*</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.unidade}
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Posto/Graduação*</p>
              <input
                type='text'
                className='filtering-input'
                disabled={disabledInputs.graduacao}
                value={formData.graduacao}
                onChange={(e) => setFormData({ ...formData, graduacao: e.target.value })}
              />
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
            disabled={disabledInputs.cracha}
            className='filtering-input'
            value={formData.cracha}
            onChange={(e) => setFormData({ ...formData, cracha: e.target.value })}
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
                className='filtering-input'
                disabled={disabledInputs.veiculo_cracha}
                value={formData.veiculo_cracha}
                onChange={(e) => setFormData({ ...formData, veiculo_cracha: e.target.value })}
              />
            </div>
            <div className="input-container">
                <p>Placa</p>
                <input
                  type="text"
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_placa}
                  value={formData.veiculo_placa}
                  onChange={(e) => searchVeiculos(e.target.value )}
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
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_renavam}
                  value={formData.veiculo_renavam}
                  onChange={(e) => setFormData({ ...formData, veiculo_renavam: e.target.value })}
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
          <button onClick={send}>
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

export default MilitarSemANCrachaComponent