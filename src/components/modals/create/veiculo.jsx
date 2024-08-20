import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server'
import './style.css'
import { IMaskInput } from "react-imask";
import { UseAuth } from '../../../hooks';

export default function CreateVeiculoModal({ closeModal, renderTable }) {
    const { signOut } = UseAuth();
    const [receivedData, setReceivedData] = useState(
        {
            id_efetivo: "",
            tipo: 'Nenhum',
            cor_veiculo: 'Nenhum',
            placa: '',
            marca: '',
            modelo: '',
            renavam: '',
            qrcode: ''
        })

    const [efetivoData, setEfetivoData] = useState(
        {
            qrcode_efetivo: '',
            nome_guerra: '',
            graduacao: ''
        }
    )
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

    const cleanInputs = () => {
        setReceivedData({
            ...receivedData,
            id_efetivo: "",
            tipo: 'Nenhum',
            cor_veiculo: 'Nenhum',
            placa: '',
            marca: '',
            modelo: '',
            renavam: '',
            qrcode: ''
        });
    };

    const confirmCreating = () => {

        if (String(efetivoData.nome_guerra).length == 0 || String(efetivoData.graduacao).length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um número de ordem válido.");
        } else if (receivedData.tipo == 'Nenhum') {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um tipo válido.");
        } else if (receivedData.cor_veiculo == 'Nenhum') {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma cor válida.");
        } else if (!validarPlaca(receivedData.placa)) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma placa válida.");
        } else if (receivedData.marca.length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma marca válida.");
        } else if (receivedData.modelo.length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um modelo válido.");
        } else if (String(receivedData.renavam).length != 11) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um renavam válido.");
        } else if (receivedData.qrcode.length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um selo/AN válido.");
        } else {
            sendRequest();
        }
    };

    const validarPlaca = (placa) => {
        return /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/.test(placa);
    };

    const sendRequest = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            await server.post(`/veiculo`, receivedData, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            renderTable('create');
            closeModal('create');
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao enviar dados.");
        }
    };

    const searchEfetivo = async (e) => {
        setEfetivoData({ ...efetivoData, qrcode_efetivo: e })
        if (String(e).length == 7 || String(e).length == 10) {
            let userData = localStorage.getItem('user');
            let userDataParsed = JSON.parse(userData);
            let token = localStorage.getItem("user_token")
            try {
                const response = await server.get(`/efetivo/consulta/${e}`, receivedData, {
                    headers: {
                        'Authentication': token,
                        'access-level': userDataParsed.nivel_acesso
                    }
                });

                const efetivoColected = response.data[0]

                //Check VAL_CNH
                let validCNH = false
                let valCNH = convertDateToDDMMYYYY(efetivoColected.val_cnh)
                if (valCNH > new Date()) {
                    validCNH = true
                }

                //Show Efetivo
                if (efetivoColected.cnh == null || !validCNH) {
                    setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                    setMessage('Este efetivo apresenta irregulariedades na CNH');
                } else {
                    setEfetivoData({ qrcode_efetivo: e, nome_guerra: efetivoColected.nome_guerra, graduacao: efetivoColected.Graduacao.sigla })
                    setReceivedData({ ...receivedData, id_efetivo: efetivoColected.id })
                }

            } catch (e) {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Não foi encontrado um efetivo com este número de ordem");
            }
        } else {
            setEfetivoData(
                {
                    nome_guerra: '',
                    graduacao: ''
                }
            )
            setReceivedData({ ...receivedData, id_efetivo: '' })
        }
    }




    const convertDateToDDMMYYYY = (dateString) => {
        const [year, month, day] = dateString.split('-');
        var data = new Date(year, month, day);
        return data;
    };

    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Criar veículo</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="veiculo-inputs-1">
                        <div className="input-container">
                            <p>Número de ordem ou documento</p>
                            <input
                                type="text"
                                maxLength={11}
                                className='filtering-input'
                                value={efetivoData.qrcode_efetivo}
                                onChange={(e) => searchEfetivo(e.target.value.replace(/[^0-9]/g, ""))}
                            />
                        </div>
                        <div className="input-container">
                            <p>Militar</p>
                            <input disabled={true} className='filtering-input' value={`${efetivoData.graduacao} ${efetivoData.nome_guerra}`} />
                        </div>
                    </div>
                    <div className="veiculo-inputs-2">
                        <div className="input-container">
                            <p>Tipo</p>
                            <select
                                className='filtering-input'
                                value={receivedData.tipo}
                                onChange={(e) => setReceivedData({ ...receivedData, tipo: e.target.value })}
                            >
                                <option value={'Nenhum'}>Nenhum</option>
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
                                value={receivedData.cor_veiculo}
                                onChange={(e) => setReceivedData({ ...receivedData, cor_veiculo: e.target.value })}
                            >
                                <option value={'Nenhum'}>Nenhum</option>
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
                                maxLength={5}
                                className='filtering-input'
                                value={receivedData.placa}
                                onChange={(e) => setReceivedData({ ...receivedData, placa: e.target.value.replace(/[^a-zA-Z0-9]/g, "") })} />
                        </div>
                        <div className="input-container">
                            <p>Marca</p>
                            <input className='filtering-input' value={receivedData.marca} onChange={(e) => setReceivedData({ ...receivedData, marca: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Modelo</p>
                            <input className='filtering-input' value={receivedData.modelo} onChange={(e) => setReceivedData({ ...receivedData, modelo: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>RENAVAM</p>
                            <input
                                type="text"
                                maxLength={11}
                                className='filtering-input'
                                value={receivedData.renavam}
                                onChange={(e) => setReceivedData({ ...receivedData, renavam: e.target.value.replace(/[^0-9]/g, "") })} />
                        </div>
                        <div className="input-container">
                            <p>Selo / AN</p>
                            <input
                                type="text"
                                maxLength={5}
                                className='filtering-input'
                                value={receivedData.qrcode}
                                onChange={(e) => setReceivedData({ ...receivedData, qrcode: e.target.value.replace(/[^0-9]/g, "") })}
                            />

                        </div>
                    </div>
                    <div className="form-buttons-container">
                        <div className="cancel-button">
                            <button onClick={() => closeModal('create')}>
                                Voltar
                            </button>
                        </div>
                        <div className="form-buttons">
                            <button onClick={() => cleanInputs()}>
                                Limpar campos
                            </button>
                            <button onClick={confirmCreating}>
                                Confirmar
                            </button>
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
                </div>
            </div>
        </>
    );
}
