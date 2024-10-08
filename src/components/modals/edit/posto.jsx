import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";
import { server } from '../../../services/server';
import PropTypes from 'prop-types';

export default function EditPostoModal({ currentPosto, closeModal, renderTable }) {
    const [dataFromPosto, setDataFromPosto] = useState(currentPosto || {});
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

    const confirmEditing = () => {
        if (dataFromPosto.nome.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else {
            sendRequest();
        }
    };

    const sendRequest = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            await server.put(`/posto/${dataFromPosto.id}`, dataFromPosto, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
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
                    <h1>Editar posto de serviço</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="page-filters">
                        <div className="input-container">
                            <p>Nome do posto</p>
                            <input className='filtering-input' value={dataFromPosto.nome} onChange={(e) => setDataFromPosto({ ...dataFromPosto, nome: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Nível de acesso</p>
                            <select value={dataFromPosto.nivel_acesso} onChange={(e) => setDataFromPosto({ ...dataFromPosto, nivel_acesso: e.target.value })} className='filtering-input '>
                                <option value={0}>Nenhum</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
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

EditPostoModal.propTypes = {
    currentPosto: PropTypes.shape({
        id: PropTypes.number,
        nome: PropTypes.string,
        nivel_acesso: PropTypes.number,
    }).isRequired,
    closeModal: PropTypes.func.isRequired,
    renderTable: PropTypes.func.isRequired,
};