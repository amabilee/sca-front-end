import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";
import { server } from '../../../services/server';

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
        setReceivedData({ ...receivedData, nome: "", nivel_acesso: 0 });
    };

    const confirmEditing = () => {
        if (receivedData.nome.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else {
            sendRequest();
        }
    };

    const sendRequest = async () => {
        try {
            await server.put(`/unidade/${receivedData.id}`, receivedData);
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
                    <h1>Editar unidade</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="page-filters filters-relatorio-efetivo">
                        <div className="input-container">
                            <p>Nome da unidade</p>
                            <input className='filtering-input' value={receivedData.nome} onChange={(e) => setReceivedData({ ...receivedData, nome: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Nível de acesso</p>
                            <select value={receivedData.nivel_acesso} onChange={(e) => setReceivedData({ ...receivedData, nivel_acesso: e.target.value })} className='filtering-input filtering-select-level-access'>
                                <option value={0}>Nenhum</option>
                                <option value={1}>Guarda</option>
                                <option value={2}>Refeitório</option>
                                <option value={3}>Operacional</option>
                            </select>
                        </div>
                        <div className="input-container">
                            <p>Número máximo de efetivos</p>
                            <input type="number" value={receivedData.maximo_efetivo} onChange={(e) => setReceivedData({ ...receivedData, maximo_efetivo: e.target.value })} className="filtering-input" />
                        </div>
                        <div className="input-container">
                            <p>Número máximo de veículos</p>
                            <input type="number" value={receivedData.maximo_veiculo} onChange={(e) => setReceivedData({ ...receivedData, maximo_veiculo: e.target.value })} className="filtering-input" />
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
