import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server'

export default function CreateUnidadeModal({ closeModal, renderTable }) {
    const [receivedData, setReceivedData] = useState({ nome: "", nivel_acesso: 0, ativo_unidade: true, maximo_efetivo: 0, maximo_veiculo: 0 })
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

    const confirmCreating = () => {
        if (receivedData.nome.length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (receivedData.nivel_acesso == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nível de acesso válido.");
        } else if (receivedData.maximo_efetivo == 0){
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma quantidade de efetivos válida.");
        } else if (receivedData.maximo_veiculo == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma quantidade de veículos válida.");
        } else {
            sendRequest();
        }
    };

    const sendRequest = async () => {
        try {
            await server.post(`/unidade`, receivedData);
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
                    <h1>Criar unidade</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="page-filters filters-unidade">
                        <div className="input-container">
                            <p>Nome da unidade</p>
                            <input className='filtering-input' value={receivedData.nome} onChange={(e) => setReceivedData({ ...receivedData, nome: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Nível de acesso</p>
                            <select value={receivedData.nivel_acesso} onChange={(e) => setReceivedData({ ...receivedData, nivel_acesso: e.target.value })} className='filtering-input filtering-select-level-access'>
                                <option value={0}>Nenhum</option>
                                <option value={1}>Portaia</option>
                                <option value={2}>Aviões</option>
                                <option value={3}>Administrativa</option>
                            </select>
                        </div>
                        <div className="input-container">
                            <p>Número máximo de efetivos</p>
                            <input type="number" value={receivedData.maximo_efetivo} onChange={(e) => setReceivedData({... receivedData, maximo_efetivo: e.target.value})} className="filtering-input"/>
                        </div>
                        <div className="input-container">
                            <p>Número máximo de veículos</p>
                            <input type="number" value={receivedData.maximo_veiculo} onChange={(e) => setReceivedData({... receivedData, maximo_veiculo: e.target.value})} className="filtering-input"/>
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
