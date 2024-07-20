import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server'

import { MuiColorInput } from 'mui-color-input'

import '../style.css'

export default function CreateAlertaModal({ closeModal, renderTable }) {
    const [receivedData, setReceivedData] = useState({ nome_alerta: "", cor: "", ativo_alerta: true})
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
        setReceivedData({ ...receivedData, nome_alerta: "", cor: "", ativo_alerta: true });
    };

    const confirmCreating = () => {
        const hexColorPattern = /^#([0-9A-F]{6})$/i;
    
        if (receivedData.nome_alerta.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (!hexColorPattern.test(receivedData.cor)) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma cor válida.");
        } else {
            sendRequest();
        }
    };
    

    const sendRequest = async () => {
        try {
            await server.post(`/alerta`, receivedData);
            renderTable('create');
            closeModal('create');
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao enviar dados.");
        }
    };

    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Criar alerta</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="page-filters filters-alerta">
                        <div className="input-container">
                            <p>Nome da unidade</p>
                            <input className='filtering-input' value={receivedData.nome_alerta} onChange={(e) => setReceivedData({ ...receivedData, nome_alerta: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Cor</p>
                            <MuiColorInput className='filtering-input color-input' format="hex" value={receivedData.cor} onChange={(e) => setReceivedData({ ...receivedData, cor: e })} />
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
