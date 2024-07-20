import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";
import "../style.css";
import { server } from '../../../services/server';
import { MuiColorInput } from 'mui-color-input'

export default function EditUnidadeModal({ currentData, closeModal, renderTable }) {
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
        setReceivedData({ ...receivedData, nome_alerta: "", cor: "" });
    };

    const confirmEditing = () => {
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
            await server.put(`/alerta/${receivedData.id}`, receivedData);
            renderTable('edit');
            closeModal('edit');
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao atualizar dados.");
        }
    };

    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Editar alerta</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="page-filters filters-relatorio-efetivo">
                        <div className="input-container">
                            <p>Descrição do alerta</p>
                            <input className='filtering-input' value={receivedData.nome_alerta} onChange={(e) => setReceivedData({ ...receivedData, nome_alerta: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Cor</p>
                            <MuiColorInput className='filtering-input color-input' format="hex" value={receivedData.cor} onChange={(e) => setReceivedData({ ...receivedData, cor: e })} />
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
