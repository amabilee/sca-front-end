import React, { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";
import { server } from '../../../services/server';

export default function EditVeiculoModal({ currentData, closeModal, renderTable }) {
    const [receivedData, setReceivedData] = useState(currentData || {});
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
            id_efetivo: 0,
            tipo: 'Nenhum',
            cor_veiculo: 'Nenhum',
            placa: '',
            marca: '',
            modelo: '',
            renavam: 0,
            qrcode: 0
        });
    };

    const [efetivoData, setEfetivoData] = useState(
        {
            qrcode_efetivo: '',
            nome_guerra: '',
            graduacao: ''
        }
    )

    const confirmEditing = () => {
        const placaPattern = /^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/;
        if (String(efetivoData.qrcode_efetivo).length != 7) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um número de ordem válido.");
        } else if (receivedData.tipo == 'Nenhum') {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um tipo válido.");
        } else if (receivedData.cor_veiculo == 'Nenhum') {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma cor válida.");
        } else if (!placaPattern.test(receivedData.placa)) {
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

    const sendRequest = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            await server.put(`/veiculo/${receivedData.id}`, receivedData, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            renderTable('edit');
            closeModal('edit');
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage(e.response.data.message);
        }
    };


    const searchEfetivo = async (e) => {
        setEfetivoData({ ...efetivoData, qrcode_efetivo: e })
        if (String(e).length == 7 || String(receivedData.id_efetivo).length == 4) {
            let userData = localStorage.getItem('user');
            let userDataParsed = JSON.parse(userData);
            let token = localStorage.getItem("user_token")
            try {
                if (String(receivedData.id_efetivo).length == 4) {
                    const response = await server.get(`/efetivo/${receivedData.id_efetivo}`, {
                        headers: {
                            'Authentication': token,
                            'access-level': userDataParsed.nivel_acesso
                        }
                    });
                    setEfetivoData({ qrcode_efetivo: response.data.qrcode_efetivo, nome_guerra: response.data.nome_guerra, graduacao: response.data.Graduacao.sigla })
                    setReceivedData({ ...receivedData, id_efetivo: response.data.id })
                } else {
                    const response = await server.get(`/efetivo/consulta/${e}`, receivedData, {
                        headers: {
                            'Authentication': token,
                            'access-level': userDataParsed.nivel_acesso
                        }
                    });
                    setEfetivoData({ qrcode_efetivo: e, nome_guerra: response.data.nome_guerra, graduacao: response.data.Graduacao.sigla })
                    setReceivedData({ ...receivedData, id_efetivo: response.data.id })
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
            // setReceivedData({ ...receivedData, id_efetivo: '' })
        }
    }

    useEffect(() => {
        searchEfetivo()
    }, [])


    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Editar veículo</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="veiculo-inputs-1">
                        <div className="input-container">
                            <p>Número de ordem</p>
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
                            <input className='filtering-input' value={receivedData.placa} onChange={(e) => setReceivedData({ ...receivedData, placa: e.target.value })} />
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
                                type="number"
                                className='filtering-input'
                                value={receivedData.renavam}
                                onChange={(e) => setReceivedData({ ...receivedData, renavam: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Selo / AN</p>
                            <input
                                className='filtering-input'
                                value={receivedData.qrcode}
                                onChange={(e) => setReceivedData({ ...receivedData, qrcode: e.target.value })}
                            />

                        </div>
                    </div>
                    <div className="form-buttons-container">
                        <div className="cancel-button">
                            <button onClick={() => closeModal('edit')}>
                                Voltar
                            </button>
                        </div>
                        <div className="form-buttons">
                            <button onClick={() => cleanInputs()}>
                                Limpar campos
                            </button>
                            <button onClick={confirmEditing}>
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
                            <Alert variant="filled" severity="error" onClose={handleClose}>
                                {message || "Erro desconhecido"}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </div>
        </>
    );
}
