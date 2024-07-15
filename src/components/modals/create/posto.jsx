import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server'

export default function CreatePostoModal({ closeModal, renderTable }) {
    const [dataFromPosto, setDataFromPosto] = useState({ nome: "", nivel_acesso: 0, ativo_posto: true })
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
        setDataFromPosto({ ...dataFromPosto, nome: "", nivel_acesso: 0 });
    };

    const confirmCreating = () => {
        if (dataFromPosto.nome.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (dataFromPosto.nivel_acesso === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nível de acesso válido.");
        } else {
            sendRequest();
        }
    };

    const sendRequest = async () => {
        try {
            await server.post(`/posto`, dataFromPosto);
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
                    <h1>Criar posto de serviço</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="page-filters filters-relatorio-efetivo">
                        <div className="input-container">
                            <p>Nome do posto</p>
                            <input className='filtering-input' value={dataFromPosto.nome} onChange={(e) => setDataFromPosto({ ...dataFromPosto, nome: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Nível de acesso</p>
                            <select value={dataFromPosto.nivel_acesso} onChange={(e) => setDataFromPosto({ ...dataFromPosto, nivel_acesso: e.target.value })} className='filtering-input filtering-select-level-access'>
                                <option value={0}>Nenhum</option>
                                <option value={1}>Portaria</option>
                                <option value={2}>Aviões</option>
                                <option value={3}>Administrativa</option>
                            </select>
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
