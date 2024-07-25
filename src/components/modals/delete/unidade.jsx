import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server';

export default function DeleteUnidadeModal({ currentData, closeModal, renderTable }) {
    const [removeOption, setRemoveOption] = useState(0);
    const [receivedData, setDataReceived] = useState(currentData || {});
    
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

    const confirmDeleting = () => {
        if (removeOption === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Para confirmar a remoção a opção 'Sim' deve ser selecionada");
        } else {
            sendRequest();
        }
    };

    const sendRequest = async () => {
        let removeData = { ...receivedData, ativo_unidade: false };
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            await server.put(`/unidade/${receivedData.id}`, removeData, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            renderTable('delete');
            closeModal('delete');
        } catch (e) {
            setState({ ...state, open: true });
            setMessage("Erro ao deletar a unidade.");
        }
    };

    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Deletar unidade {receivedData.nome}</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="page-filters">
                        <div className="input-container">
                            <p>Tem certeza que deseja deletar esta unidade?<br/>Esta ação não pode ser desfeita.</p>
                            <select value={removeOption} onChange={(e) => setRemoveOption(Number(e.target.value))} className='filtering-input filtering-select-level-access'>
                                <option value={0}>Não</option>
                                <option value={1}>Sim</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-buttons-container">
                        <div className="cancel-button">
                            <button onClick={() => closeModal('delete')}>
                                Voltar
                            </button>
                        </div>
                        <div className="form-buttons">
                            <button onClick={confirmDeleting}>
                                Confirmar
                            </button>
                        </div>
                        <Snackbar
                            ContentProps={{ sx: { borderRadius: '8px' } }}
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            autoHideDuration={4000}
                            onClose={handleClose}
                            key={vertical + horizontal}
                        >
                            <Alert variant="filled" severity="error" onClose={handleClose}>
                                {message}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </div>
        </>
    );
}
