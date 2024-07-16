import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server'

export default function CreateUnidadeModal({ closeModal, renderTable }) {
    const [receivedData, setReceivedData] = useState(
        {
            numero_ordem: '',
            nome_guerra: '',
            nome_completo: '',
            id_unidade: '',
            id_posto: '',
            email: '',
            foto: '',
            qrcode_efetivo: '',
            saram: '',
            ativo_efetivo: true
        })
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
        if (receivedData.numero_ordem.length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um número de ordem válido.");
        } else if (receivedData.nome_guerra == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome de guerra válido.");
        } else if (receivedData.nome_completo == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (receivedData.id_unidade == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma unidade válida.");
        } else if (receivedData.id_posto == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um posto/gradução válidos.");
        } else if (receivedData.email == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um email válido.");
        } else if (receivedData.foto == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma foto válida.");
        } else if (receivedData.qrcode_efetivo == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Gere um qr-code válido.");
        } else {
            sendRequest();
        }
    };

    const sendRequest = async () => {
        try {
            await server.post(`/efetivo`, receivedData);
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
                    <h1>Criar efetivo</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="usuario-inputs-1">
                        <div className="input-container">
                            <p>Número de ordem</p>
                            <input
                                className='filtering-input'
                                value={receivedData.numero_ordem}
                                onChange={(e) => setReceivedData({ ...receivedData, numero_ordem: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Nome de guerra</p>
                            <input
                                className='filtering-input'
                                value={receivedData.nome_guerra}
                                onChange={(e) => setReceivedData({ ...receivedData, nome_guerra: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Nome completo</p>
                            <input
                                className='filtering-input'
                                value={receivedData.nome_completo}
                                onChange={(e) => setReceivedData({ ...receivedData, nome_completo: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Unidade</p>
                            <input
                                className='filtering-input'
                                value={receivedData.unidade}
                                onChange={(e) => setReceivedData({ ...receivedData, unidade: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Posto\Graduação</p>
                            <input
                                className='filtering-input'
                                value={receivedData.posto_graduacao}
                                onChange={(e) => setReceivedData({ ...receivedData, posto_graduacao: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Saram</p>
                            <input
                                className='filtering-input'
                                value={receivedData.saram}
                                onChange={(e) => setReceivedData({ ...receivedData, saram: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="usuario-inputs-2">
                        <div className="input-container">
                            <p>Módulos</p>

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
