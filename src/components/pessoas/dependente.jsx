import React, { useState } from 'react'
import { server } from '../../services/server'
import './style.css'
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function DependenteComponent() {
  // SnackBar config
  const [message, setMessage] = useState("");
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
      parentesco: 'Selecione',
      numero_ordem: '',
      militar: '',
      cracha: '',
      autorizador_numero: '',
      autorizador: '',
      entrada: 'Não',
      destino: '',
      conduzindo: 'Não',
      veiculo_existente: 'Selecione',
      veiculo_tipo: 'Selecione',
      veiculo_cor: 'Selecione',
      veiculo_placa: '',
      veiculo_renavam: '',
      veiculo_marca: '',
      veiculo_modelo: '',
      veiculo_cracha: ''
    }
  )

  const [disabledInputs, setDisabledInputs] = useState(
    {
      nome_completo: true,
      parentesco: true,
      numero_ordem: true,
      militar: true,
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
    }
  )

  const [veiculos, setVeiculos] = useState(
    [
      {
        id: 1,
        marca: 'Honda',
        modelo: 'Civic',
        placa: 'ASD9876'
      },
      {
        id: 2,
        marca: 'Ford',
        modelo: 'Fiest',
        placa: 'MNB9876'
      }
    ])

  const cleanInputs = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      cpf: '',
      nome_completo: '',
      parentesco: 'Selecione',
      numero_ordem: '',
      militar: '',
      cracha: '',
      autorizador_numero: '',
      autorizador: '',
      entrada: 'Não',
      destino: '',
      conduzindo: 'Não',
      veiculo_existente: 'Selecione',
      veiculo_tipo: 'Selecione',
      veiculo_cor: 'Selecione',
      veiculo_placa: '',
      veiculo_renavam: '',
      veiculo_marca: '',
      veiculo_modelo: '',
      veiculo_cracha: ''
    }));
    setDisabledInputs((prevDisabledInputs) => ({
      ...prevDisabledInputs,
      nome_completo: true,
      parentesco: true,
      numero_ordem: true,
      militar: true,
      cracha: true,
      autorizador_numero: true,
      autorizador: true,
      destino: true,
      veiculo_tipo: true,
      veiculo_cor: true,
      veiculo_placa: true,
      veiculo_renavam: true,
      veiculo_marca: true,
      veiculo_modelo: true,
      veiculo_cracha: true
    }))
  };

  // Find Dependente  

  const searchDependente = async (element) => {
    if (String(element).length == 14) {
      let userData = localStorage.getItem('user');
      let userDataParsed = JSON.parse(userData);
      let token = localStorage.getItem("user_token")
      try {
        const response = await server.get(`/dependente/consulta/${element}`, {
          headers: {
            'Authentication': token,
            'access-level': userDataParsed.nivel_acesso
          }
        });

        const dependenteColected = response.data[0]

        // setFormData({ nome_completo: dependenteColected.nome, parentesco: dependenteColected.parentesco, qrcode_efetivo: dependenteColected.qrcode_efetivo })
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: true,
          parentesco: true,
          numero_ordem: true,
          militar: true,
          veiculo_existente: false,
        }))
      } catch (e) {
        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
        setMessage("Não foi encontrado um dependente com este CPF");
        setDisabledInputs((prevDisabledInputs) => ({
          ...prevDisabledInputs,
          nome_completo: false,
          parentesco: false,
          numero_ordem: false,
          militar: false,
          veiculo_existente: false,
        }))
        setFormData((prevFormData) => ({
          ...prevFormData,
          nome_completo: '',
          parentesco: 'Selecione',
          numero_ordem: '',
          militar: '',
        }));
      }
    } else {

      setFormData((prevFormData) => ({
        ...prevFormData,
        nome_completo: '',
        parentesco: 'Selecione',
        numero_ordem: '',
        militar: '',
        veiculo_existente: 'Selecione'
      }));

      setDisabledInputs((prevDisabledInputs) => ({
        ...prevDisabledInputs,
        nome_completo: true,
        parentesco: true,
        numero_ordem: true,
        militar: true,
        veiculo_existente: true,
      }))
    }
    setFormData({ ...formData, cpf: element })
  }

  //Handle Veiculo Existente Change

  const changeVeiculoExistente = (element) => {
    setFormData({ ...formData, veiculo_existente: element })
    if (element == 'Novo') {
      setDisabledInputs({
        ...setDisabledInputs,
        veiculo_tipo: false,
        veiculo_cor: false,
        veiculo_placa: false,
        veiculo_renavam: false,
        veiculo_marca: false,
        veiculo_modelo: false,
      })
      setFormData((prevFormData) => ({
        ...prevFormData,
        veiculo_tipo: 'Selecione',
        veiculo_cor: 'Selecione',
        veiculo_placa: '',
        veiculo_renavam: '',
        veiculo_marca: '',
        veiculo_modelo: '',
        veiculo_cracha: ''
      }));
    } else {
      setDisabledInputs({
        ...setDisabledInputs,
        veiculo_tipo: true,
        veiculo_cor: true,
        veiculo_placa: true,
        veiculo_renavam: true,
        veiculo_marca: true,
        veiculo_modelo: true,
      })
    }
  }

  // Handle Registrar Entrada Change

  const changeRegistroEntrada = (element) => {
    setFormData({ ...formData, entrada: element })
    if (element == 'Sim') {
      setDisabledInputs({
        ...disabledInputs,
        cracha: false,
        veiculo_cracha: false
      })
    } else {
      setDisabledInputs({
        ...disabledInputs,
        cracha: true,
        veiculo_cracha: true
      })
    }
  }

  //Find Efetivo

  const searchEfetivo = async (element) => {
    if (String(element).length === 7) {
      let userData = localStorage.getItem('user');
      let userDataParsed = JSON.parse(userData);
      let token = localStorage.getItem("user_token");

      try {
        const response = await server.get(`/efetivo/consulta/${element}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'access-level': userDataParsed.nivel_acesso
          }
        });

        let efetivoColected = response.data[0];

        setFormData((prevFormData) => ({
          ...prevFormData,
          autorizador: `${efetivoColected.Graduacao.sigla} ${efetivoColected.nome_guerra}`,
          autorizador_numero: element
        }));
      } catch (e) {
        setState((prevState) => ({
          ...prevState,
          open: true,
          vertical: 'bottom',
          horizontal: 'center'
        }));
        setMessage("Não foi encontrado um efetivo com este número de ordem");
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        autorizador: '',
        autorizador_numero: element
      }));
    }
  };


  const send = () => {
    console.log(formData)
  }

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
              className='filtering-input'
              disabled={disabledInputs.numero_ordem}
              value={formData.numero_ordem}
              onChange={(e) => setFormData({ ...formData, numero_ordem: e.target.value })}
            />
          </div>
          <p>ou</p>
          <div className="input-container">
            <p>Militar*</p>
            <input
              type="text"
              disabled={disabledInputs.militar}
              className='filtering-input'
              value={formData.militar}
              onChange={(e) => setFormData({ ...formData, militar: e.target.value })}
            />
          </div>
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
        <h3>Autorizador</h3>
      </div>
      <div className="pessoas-section-input session-input-autorizador">
        <div className="input-container">
          <p>Número de Ordem*</p>
          <IMaskInput
            type='text'
            mask='0000000'
            className='filtering-input'
            value={formData.autorizador_numero}
            onChange={(e) => searchEfetivo(e.target.value)}
          />
        </div>
        <div className="input-container">
          <p>Militar</p>
          <input
            className='filtering-input'
            disabled={true}
            value={formData.autorizador}
          />
        </div>
        <div className="input-container">
          <p>Destino</p>
          <input
            type="text"
            className='filtering-input'
            value={formData.destino}
            onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
          />
        </div>
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
      </div>
      <div className="pessoas-section-title">
        <h3>Veículo</h3>
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
                className='filtering-input'
                disabled={disabledInputs.veiculo_cracha}
                value={formData.veiculo_cracha}
                onChange={(e) => setFormData({ ...formData, veiculo_cracha: e.target.value })}
              />
            </div>
            <div className="input-container">
              <p>Veículos atrelados à esta pessoa:</p>
              <select
                type="number"
                className='filtering-input'
                value={formData.veiculo_existente}
                disabled={disabledInputs.veiculo_existente}
                onChange={(e) => changeVeiculoExistente(e.target.value)}
              >
                <option value={'Selecione'}>Selecione</option>
                <option value={'Novo'}>Cadastrar um novo</option>
                {veiculos.map((veiculo, i) => (
                  <option key={i} value={veiculo.id}>{veiculo.marca} {veiculo.modelo} {veiculo.placa}</option>
                ))}
              </select>
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
                <p>Placa</p>
                <input
                  type="text"
                  className='filtering-input'
                  disabled={disabledInputs.veiculo_placa}
                  value={formData.veiculo_placa}
                  onChange={(e) => setFormData({ ...formData, veiculo_placa: e.target.value })}
                />
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
        <Alert variant="filled" severity="error">
          {message}
        </Alert>
      </Snackbar>
    </div>

  )
}

export default DependenteComponent